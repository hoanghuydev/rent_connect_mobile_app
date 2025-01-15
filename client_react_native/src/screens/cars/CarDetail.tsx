import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform, Dimensions } from 'react-native';
import { Text, Avatar, Button, Badge, Card, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const primaryColor = '#5fcf86';
const softGrayColor = '#E0E0E0';
const screenWidth = Dimensions.get('window').width;

const CarDetailScreen = ({ route, navigation }: any) => {
  const { vehicle } = route.params;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Button
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Quay lại
        </Button>
        <Button
          icon="square-edit-outline"
          onPress={() => navigation.navigate('EditVehicle', { vehicle })}
          style={styles.editButton}
        >
          Chỉnh sửa
        </Button>
      </View>

      <ScrollView style={styles.container} bounces={false}>
        {/* Car Image Section */}
        <View style={styles.imageSection}>
          <Avatar.Icon
            size={120}
            icon="car"
            style={styles.carImage}
            color="#fff"
          />
          <Badge
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(vehicle.status) }
            ]}
          >
            {getStatusText(vehicle.status)}
          </Badge>
        </View>

        {/* Car Info Card */}
        <Card style={styles.mainCard}>
          <Card.Content>
            <Text style={styles.carName}>{vehicle.name}</Text>
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={16} color="#666" />
              <Text style={styles.locationText}>{vehicle.location}</Text>
            </View>
            <Text style={styles.priceText}>{formatPrice(vehicle.pricePerDay)}/ngày</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="car-clock" size={24} color={primaryColor} />
                <Text style={styles.statValue}>{vehicle.rentCount}</Text>
                <Text style={styles.statLabel}>Lượt thuê</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="star" size={24} color={primaryColor} />
                <Text style={styles.statValue}>{vehicle.rating}</Text>
                <Text style={styles.statLabel}>Đánh giá</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="car-shift-pattern" size={24} color={primaryColor} />
                <Text style={styles.statValue}>
                  {vehicle.transmission_id === 1 ? 'Tự động' : 'Số sàn'}
                </Text>
                <Text style={styles.statLabel}>Hộp số</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Description Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Mô tả</Text>
            <Text style={styles.descriptionText}>{vehicle.description}</Text>
          </Card.Content>
        </Card>

        {/* Features Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Tính năng nổi bật</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Icon name="car-door" size={24} color={primaryColor} />
                <Text style={styles.featureText}>4 chỗ ngồi</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="air-conditioner" size={24} color={primaryColor} />
                <Text style={styles.featureText}>Điều hòa</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="bluetooth" size={24} color={primaryColor} />
                <Text style={styles.featureText}>Bluetooth</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="car-brake-parking" size={24} color={primaryColor} />
                <Text style={styles.featureText}>Cảm biến lùi</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="camera" size={24} color={primaryColor} />
                <Text style={styles.featureText}>Camera 360°</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="map-marker" size={24} color={primaryColor} />
                <Text style={styles.featureText}>GPS</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Requirements Card */}
        <Card style={[styles.card, styles.lastCard]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Yêu cầu khi thuê xe</Text>
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <Icon name="card-account-details" size={20} color={primaryColor} />
                <Text style={styles.requirementText}>CCCD gắn chip hoặc Passport</Text>
              </View>
              <View style={styles.requirementItem}>
                <Icon name="license" size={20} color={primaryColor} />
                <Text style={styles.requirementText}>Giấy phép lái xe</Text>
              </View>
              <View style={styles.requirementItem}>
                <Icon name="home" size={20} color={primaryColor} />
                <Text style={styles.requirementText}>Hộ khẩu hoặc KT3</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
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
  backButton: {
    marginRight: 8,
  },
  editButton: {
    marginLeft: 8,
  },
  imageSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative',
  },
  carImage: {
    backgroundColor: primaryColor,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 4,
  },
  mainCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  lastCard: {
    marginBottom: 24,
  },
  carName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: softGrayColor,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
});

export default CarDetailScreen;