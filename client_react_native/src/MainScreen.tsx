import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from '@/screens/login/LoginScreen';
import ExploreScreen from '@/screens/explore/ExploreScreen';
import MessageScreen from '@/screens/message/MessageScreen';
import RideScreen from '@/screens/ride/RideScreen';
import SupportScreen from '@/screens/support/SupportScreen';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
    return (
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ color, size }) => {
                                // Render icon
                                let iconName;
                                switch (route.name) {
                                    case 'Explore':
                                        iconName = 'home-outline';
                                        break;
                                    case 'Messages':
                                        iconName = 'chat-outline';
                                        break;
                                    case 'Rides':
                                        iconName = 'car';
                                        break;
                                    case 'Support':
                                        iconName = 'headset';
                                        break;
                                    case 'Login':
                                        iconName = 'account-outline';
                                        break;
                                    default:
                                        iconName = 'home-outline';
                                }
                                return <Icon name={iconName || ''} size={size} color={color} />;
                            },
                            // màu khi active
                            tabBarActiveTintColor: 'green',
                            // màu khi không active
                            tabBarInactiveTintColor: 'gray',
                            tabBarLabel: () => null,
                        })}
                    >
                        <Tab.Screen name="Explore" component={ExploreScreen} />
                        <Tab.Screen name="Messages" component={MessageScreen} />
                        <Tab.Screen name="Rides" component={RideScreen} />
                        <Tab.Screen name="Support" component={SupportScreen} />
                        <Tab.Screen name="Login"  component={LoginScreen} />
                    </Tab.Navigator>

    );
}
