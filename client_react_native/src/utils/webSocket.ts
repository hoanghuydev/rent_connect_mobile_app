import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {PORT, SERVER_IP} from "@/api/axios";
import Rental from "@/models/Rental";

let activeClient: Client | null = null;
let activeSubscription: StompSubscription | null = null;

export const connectWebSocket = async (userId: number, callback: (data: Rental) => Promise<void>) => {
    // Cleanup any existing connection
    await disconnectWebSocket();

    const client = new Client({
        connectHeaders: {
            'userId': userId.toString()
        },
        webSocketFactory: () => {
            const socket = new SockJS(`http://${SERVER_IP}:${PORT}/ws`);
            socket.onclose = (event) => {
                console.log('SockJS connection closed:', {
                    code: event.code,
                    reason: event.reason,
                    // wasClean: event.wasClean
                });
            };
            return socket;
        },
        // Disable auto reconnect
        reconnectDelay: 0,
        // Optional: you can remove these if not needed
        // heartbeatIncoming: 4000,
        // heartbeatOutgoing: 4000,

        debug: (msg) => {
            if (msg.includes('Opening') || msg.includes('Closed')) {
                console.log('WS Debug:', msg);
            }
        },

        onConnect: () => {
            console.log('Connected to WebSocket');
            if (!client.connected) return;

            try {
                // Subscribe to user's queue
                activeSubscription = client.subscribe(`/user/${userId}/queue/rentals`, (message) => {
                    try {
                        const rentalData = JSON.parse(message.body);
                        console.log('Received rental data:', rentalData);
                        callback(rentalData as Rental);
                    } catch (error) {
                        console.error('Error processing message:', error);
                    }
                });
            } catch (error) {
                console.error('Error subscribing:', error);
            }
        },

        onStompError: (frame) => {
            console.error('Stomp error:', frame.headers['message']);
            disconnectWebSocket();
        },

        onWebSocketError: (event) => {
            console.error('WebSocket error:', event);
            disconnectWebSocket();
        },

        onWebSocketClose: () => {
            console.log('WebSocket connection closed');
            activeSubscription = null;
            activeClient = null;
        },

        onDisconnect: () => {
            console.log('Disconnected from WebSocket');
            activeSubscription = null;
            activeClient = null;
        }
    });

    try {
        activeClient = client;
        await client.activate();
        return client;
    } catch (error) {
        console.error('Error activating client:', error);
        activeClient = null;
        return null;
    }
};

export const disconnectWebSocket = async () => {
    try {
        if (activeSubscription) {
            activeSubscription.unsubscribe();
            activeSubscription = null;
        }

        if (activeClient?.connected) {
            await activeClient.deactivate();
        }
        activeClient = null;
    } catch (error) {
        console.error('Error during disconnect:', error);
        // Reset anyway
        activeSubscription = null;
        activeClient = null;
    }
};