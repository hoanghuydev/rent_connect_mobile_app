import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '@/api/authApi';

const ProfileScreen = ({route}) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Lấy thông tin người dùng từ AsyncStorage
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser)); // Chuyển đổi chuỗi JSON về đối tượng
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
                        <Text style={styles.infoLabel}>ID:</Text>
                        <Text style={styles.infoValue}>{user?.userId}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Họ và Tên:</Text>
                        <Text style={styles.infoValue}>{user?.fullName}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{user?.email}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Số điện thoại:</Text>
                        <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
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
            <Button
                mode="outlined"
                style={styles.editButton}
                onPress={() => navigation.navigate('ProfileEditing')}
                color="#5fcf86"
            >
            Chỉnh sửa thông tin
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
    editButton: {
        marginTop: 10,
        width: '100%',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#5fcf86',
    },
    
});

export default ProfileScreen;
