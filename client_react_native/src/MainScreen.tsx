import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Search } from 'lucide-react-native';
import LoginScreen from '@/screens/login/LoginScreen';
import ExploreScreen from '@/screens/explore/ExploreScreen';
import MessageScreen from '@/screens/message/MessageScreen';
import RideScreen from '@/screens/ride/RideScreen';
import SupportScreen from '@/screens/support/SupportScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from './screens/profile/ProfileScreen';
import { authApi } from './api/authApi';

const Tab = createBottomTabNavigator();

export default function MainScreen() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('token');
            setIsLoggedIn(!!token); // Nếu có token thì người dùng đã đăng nhập
        };

        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        await authApi.logout();
        setIsLoggedIn(false); // Đặt lại trạng thái login khi người dùng đăng xuất
    };

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
                                    case 'Profile':
                                        iconName = 'account-outline';
                                        break;
                                    case 'Login':
                                        iconName = 'account-outline'; // Đảm bảo dùng biểu tượng cho Login đúng
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
                        {isLoggedIn ? (
                <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ onLogout: handleLogout }} />
            ) : (
                <Tab.Screen name="Login" component={LoginScreen} />
            )}
                    </Tab.Navigator>

    );
}
