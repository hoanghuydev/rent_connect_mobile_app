import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Card, Text, Avatar, Button, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const primaryColor = '#5fcf86';
const softGrayColor = '#E0E0E0';

interface Vehicle {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  rentCount: number;
  transmission_id: number;
  status: 'available' | 'rented' | 'maintenance';
  imageUrl?: string;
  location: string;
  rating: number;
}

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Toyota Camry 2.5Q',
    description: 'Sedan cao cấp, phù hợp cho gia đình',
    pricePerDay: 1200000,
    rentCount: 45,
    transmission_id: 1, // Số tự động
    status: 'available',
    location: 'Quận 1, TP.HCM',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Honda Civic RS',
    description: 'Sedan thể thao, động cơ mạnh mẽ',
    pricePerDay: 1000000,
    rentCount: 38,
    transmission_id: 1,
    status: 'rented',
    location: 'Quận 7, TP.HCM',
    rating: 4.7
  },
  {
    id: '3',
    name: 'Hyundai Tucson',
    description: 'SUV đa dụng, rộng rãi',
    pricePerDay: 1100000,
    rentCount: 52,
    transmission_id: 2, // Số sàn
    status: 'maintenance',
    location: 'Quận Bình Thạnh, TP.HCM',
    rating: 4.9
  },
  {
    id: '4',
    name: 'VinFast VF8',
    description: 'SUV điện hiện đại',
    pricePerDay: 1500000,
    rentCount: 15,
    transmission_id: 1,
    status: 'available',
    location: 'Quận 2, TP.HCM',
    rating: 4.6
  },
  {
    id: '5',
    name: 'Mazda CX-5',
    description: 'Crossover cao cấp',
    pricePerDay: 1050000,
    rentCount: 41,
    transmission_id: 1,
    status: 'available',
    location: 'Quận Phú Nhuận, TP.HCM',
    rating: 4.8
  }
];

const MyVehScreen = ({ navigation }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'rented':
        return '#FFC107';
      case 'maintenance':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Sẵn sàng';
      case 'rented':
        return 'Đang cho thuê';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'đ';
  };

  const renderVehicleCard = (vehicle: Vehicle) => (
    <Card key={vehicle.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Badge
          style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}
        >
          {getStatusText(vehicle.status)}
        </Badge>
      </View>
      <Card.Content style={styles.cardContent}>
        <View style={styles.vehicleInfo}>
          <View style={styles.avatarContainer}>
            <Avatar.Icon
              size={60}
              icon="car"
              style={[styles.avatar, { backgroundColor: primaryColor }]}
              color="#fff"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.location}>
              <Icon name="map-marker" size={14} color="#666" /> {vehicle.location}
            </Text>
            <Text style={styles.price}>{formatPrice(vehicle.pricePerDay)}/ngày</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="car-clock" size={20} color={primaryColor} />
            <Text style={styles.statValue}>{vehicle.rentCount}</Text>
            <Text style={styles.statLabel}>Lượt thuê</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <Icon name="star" size={20} color={primaryColor} />
            <Text style={styles.statValue}>{vehicle.rating}</Text>
            <Text style={styles.statLabel}>Đánh giá</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <Icon name="car-shift-pattern" size={20} color={primaryColor} />
            <Text style={styles.statValue}>
              {vehicle.transmission_id === 1 ? 'Tự động' : 'Số sàn'}
            </Text>
            <Text style={styles.statLabel}>Hộp số</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('CarDetail', { vehicle: vehicle })}
          style={styles.detailButton}
          labelStyle={styles.buttonLabel}
        >
          Xem chi tiết
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách xe của tôi</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddVehicle')}
          style={styles.addButton}
          icon="plus"
        >
          Thêm xe
        </Button>
      </View>
      <ScrollView style={styles.container} bounces={false}>
        {mockVehicles.map(vehicle => renderVehicleCard(vehicle))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: softGrayColor,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: primaryColor,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    padding: 12,
    paddingBottom: 0,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  cardContent: {
    padding: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    backgroundColor: primaryColor,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: softGrayColor,
    borderBottomWidth: 1,
    borderBottomColor: softGrayColor,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: softGrayColor,
    marginVertical: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detailButton: {
    backgroundColor: primaryColor,
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 14,
    paddingVertical: 2,
  },
});

export default MyVehScreen;