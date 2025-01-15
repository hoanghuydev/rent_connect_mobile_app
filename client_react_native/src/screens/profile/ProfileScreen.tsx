import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { authApi } from '@/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ route }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm loading khi tải thông tin người dùng

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            route.params.onLogout(); // Gọi hàm onLogout từ MainScreen để cập nhật trạng thái đăng nhập
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5fcf86" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.header}>Thông tin tài khoản</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{user?.email}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Tên:</Text>
                        <Text style={styles.infoValue}>{user?.name}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Button
                mode="contained"
                style={styles.logoutButton}
                onPress={handleLogout}
                color="#5fcf86"
            >
                Đăng xuất
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 10,
        elevation: 5,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#5fcf86',
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        marginTop: 20,
        width: '100%',
        borderRadius: 50,
    },
});

export default ProfileScreen;
