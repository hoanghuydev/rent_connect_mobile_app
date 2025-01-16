import React from 'react';
import { Card, Text, Badge, Avatar } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RentalItemProps {
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  vehicleName: string;
  vehicleImage: string;
  rentalDate: string;
  duration: string;
  owner: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#f59e0b'; // yellow
    case 'active':
      return '#10b981'; // green
    case 'completed':
      return '#3b82f6'; // blue
    case 'cancelled':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ xử lý';
    case 'active':
      return 'Đang thuê';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

const RentalItem = ({
  status,
  vehicleName,
  vehicleImage,
  rentalDate,
  duration,
  owner
}: RentalItemProps) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Image section */}
        <Card.Cover 
          source={{ uri: vehicleImage }} 
          style={styles.image}
        />

        {/* Content section */}
        <View style={styles.details}>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title}>
              {vehicleName}
            </Text>
            <Badge style={[styles.badge, { backgroundColor: getStatusColor(status) }]}>
              {getStatusText(status)}
            </Badge>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Icon name="calendar" size={20} color="#666" />
              <Text variant="bodyMedium" style={styles.infoText}>
                Ngày thuê: {rentalDate}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="clock-outline" size={20} color="#666" />
              <Text variant="bodyMedium" style={styles.infoText}>
                Thời gian thuê: {duration}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="account" size={20} color="#666" />
              <Text variant="bodyMedium" style={styles.infoText}>
                Chủ xe: {owner}
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    gap: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#666',
  },
});

export default RentalItem;