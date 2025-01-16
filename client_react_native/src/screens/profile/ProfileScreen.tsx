import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { List, Card, Divider, Avatar } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '@/api/authApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {primaryColor, softGrayColor} from "@/utils/constant";
import UserDetail from "@/models/UserDetail";


const ProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState<UserDetail>(null);
    const [loading, setLoading] = useState(true);
    const role = AsyncStorage.getItem('roles');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            route.params?.onLogout();
        } catch (error) {
            alert(error.message);
        }
    };

    const [mainMenuItems, setMainMenuItems] = useState([]);

useEffect(() => {
    const checkUserRole = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                // Parse base64 của JWT token để lấy payload
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userRoles = payload.roles;

                const baseMenuItems = [
                    { icon: 'account', title: 'Tài khoản của tôi' , screen: 'ProfileEditing'},
                    { icon: 'map-marker', title: 'Địa chỉ của tôi' },
                    { icon: 'card-account-details', title: 'Giấy phép lái xe' },
                    { icon: 'credit-card', title: 'Thẻ của tôi' },
                    { icon: 'lock', title: 'Đổi mật khẩu', screen: 'PasswordChanging'},
                ];

                if (userRoles.includes('ROLE_OWNER')) {
                    baseMenuItems.splice(1, 0, { icon: 'car', title: 'Xe của tôi', screen: 'MyVeh'});
                }
                if (userRoles.includes('ROLE_CUSTOMER')) {
                    baseMenuItems.splice(1, 0, { icon: 'history', title: 'Lịch sử', screen: 'BookingHistory' });
                }

                setMainMenuItems(baseMenuItems);
            }
        } catch (error) {
            console.error('Error checking user role:', error);
        }
    };

    checkUserRole();
}, []);


    const renderMenuCard = (items) => (
        <Card style={styles.menuCard}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <List.Item
                        title={item.title}
                        left={props => <List.Icon {...props} icon={item.icon} color={primaryColor}/>}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate(item.screen)}
                        style={styles.menuItem}
                    />
                    {index < items.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </Card>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header with Avatar */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Avatar.Image
                        size={80}
                        source={require('../assets/default-avatar.png')}
                        style={styles.avatar}
                    />
                </View>
                <Text style={styles.userName}>{user?.fullName || 'Profile Name'}</Text>
            </View>

            {/* Menu Items */}
            {renderMenuCard(mainMenuItems)}
            
            {/* Logout Button */}
            <List.Item
                title="Đăng xuất"
                left={props => <List.Icon {...props} icon="logout" color="red" />}
                onPress={handleLogout}
                titleStyle={styles.logoutText}
                style={styles.logoutButton}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        backgroundColor: '#fff',
    },
    vipBadge: {
        position: 'absolute',
        bottom: 0,
        right: -4,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    menuCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        elevation: 4,
        backgroundColor: '#fff',
    },
    menuItem: {
        paddingVertical: 8,
    },
    logoutButton: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20,
    },
    logoutText: {
        color: 'red',
    },
});

export default ProfileScreen;