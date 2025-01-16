import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rentApi from '@/api/rentApi';
import RentalItem from '@components/RentalItem';

interface Rental {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  vehicleName: string;
  vehicleImage: string;
  rentalDate: string;
  duration: string;
  owner: string;
}

const RideScreen = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      // Lấy thông tin token từ AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Người dùng chưa đăng nhập.');
        setLoading(false);
        return;
      }

      // Giải mã payload từ token để lấy roles
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRoles = payload.roles;

      // Kiểm tra xem người dùng có vai trò nào
      const isOwner = userRoles.includes('ROLE_OWNER');
      const isCustomer = userRoles.includes('ROLE_CUSTOMER');

      if (!isOwner && !isCustomer) {
        setError('Không có quyền truy cập.');
        setLoading(false);
        return;
      }

      // Lấy thông tin userId từ AsyncStorage
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        setError('Không tìm thấy thông tin người dùng.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userJson);
      const userId = user.id;

      const payloadRequest = {
        carId: 2,  // Ví dụ: carId có thể được lấy từ UI hoặc thông tin người dùng
        startDate: '2025-01-22T10:00:00',  // Cập nhật giá trị theo yêu cầu
        endDate: '2025-01-25T10:00:00',  // Cập nhật giá trị theo yêu cầu
      };

      // Gọi API tương ứng tùy theo vai trò
      let rentalsData;
      if (isOwner) {
        rentalsData = await rentApi.getRentByOwner(userId, payloadRequest);
      } else if (isCustomer) {
        rentalsData = await rentApi.getRentByUser(userId, payloadRequest);
      }

      if (rentalsData) {
        setRentals(rentalsData);  // Giả sử trả về một mảng các rental
      }

    } catch (error: any) {
      console.error('Error loading rentals:', error.message);
      setError('Không thể tải dữ liệu thuê xe.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Rental }) => (
    <RentalItem
      status={item.status}
      vehicleName={item.vehicleName}
      vehicleImage={item.vehicleImage}
      rentalDate={item.rentalDate}
      duration={item.duration}
      owner={item.owner}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text>Không có chuyến đi nào</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rentals}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        onRefresh={loadRentals}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
});

export default RideScreen;
