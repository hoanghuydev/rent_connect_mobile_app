
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, FlatList, Platform, PermissionsAndroid } from 'react-native';
import { 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Text,
  Portal,
  Modal,
  List,
  Provider as PaperProvider,
  IconButton
} from 'react-native-paper';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset
} from 'react-native-image-picker';
import SelectInput from '@/components/SelectInput';

interface CarFormData {
  name: string;
  description: string;
  dailyRate: string;
  transmission: string;
  fuelType: string;
  fuelCapacity: string;
  location: string;
  images: Asset[];
}

const CreateCar = () => {
  const [formData, setFormData] = useState<CarFormData>({
    name: '',
    description: '',
    dailyRate: '',
    transmission: '',
    fuelType: '',
    fuelCapacity: '',
    location: '',
    images: [],
  });

  // Modal visibility states
  const [transmissionModalVisible, setTransmissionModalVisible] = useState(false);
  const [fuelTypeModalVisible, setFuelTypeModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const transmissionOptions = [
    { value: 'manual', label: 'Số sàn' },
    { value: 'automatic', label: 'Số tự động' },
    { value: 'dualClutch', label: 'Ly hợp kép' },
    { value: 'semiAutomatic', label: 'Bán tự động' },
  ];

  const fuelOptions = [
    { value: 'petrol', label: 'Xăng' },
    { value: 'electric', label: 'Điện' },
    { value: 'diesel', label: 'Dầu diesel' },
    { value: 'hydrogen', label: 'Hydrogen' },
    { value: 'hybrid', label: 'Xăng/Điện' },
  ];

  const locationOptions = [
    { value: 'hcm', label: 'Tp.HCM' },
    { value: 'hanoi', label: 'Hà Nội' },
  ];

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: "Quyền truy cập ảnh",
            message: "Ứng dụng cần quyền truy cập thư viện ảnh của bạn",
            buttonNeutral: "Hỏi lại sau",
            buttonNegative: "Từ chối",
            buttonPositive: "Đồng ý"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }
        // Đối với Android < 33, thử với READ_EXTERNAL_STORAGE
        const legacyGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return legacyGranted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermission();
      
      if (!hasPermission) {
        alert('Cần cấp quyền truy cập thư viện ảnh để chọn hình');
        return;
      }

      const options: ImagePicker.ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 0,
        includeBase64: false,
        quality: 0.7,
      };

      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          alert('Có lỗi khi chọn ảnh: ' + response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...response.assets],
          }));
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Có lỗi khi chọn ảnh');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const renderImageItem = ({ item, index }: { item: Asset; index: number }) => (
    <View style={styles.imageContainer}>
      <Image 
        source={{ uri: item.uri }} 
        style={styles.imagePreview}
        resizeMode="cover"
      />
      <IconButton
        icon="close-circle"
        size={20}
        style={styles.removeImageButton}
        iconColor="white"
        onPress={() => removeImage(index)}
      />
    </View>
  );

  const handleSubmit = async () => {
    // API call sẽ được thêm vào đây sau
    console.log('Form ', formData);
  };

  const renderModal = (
    visible: boolean,
    hideModal: () => void,
    options: Array<{ value: string; label: string }>,
    onSelect: (value: string) => void,
    title: string
  ) => (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}
      >
        <Card>
          <Card.Content>
            <Title style={styles.modalTitle}>{title}</Title>
            {options.map((option) => (
              <List.Item
                key={option.value}
                title={option.label}
                onPress={() => {
                  onSelect(option.value);
                  hideModal();
                }}
                style={styles.modalItem}
              />
            ))}
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Thêm Xe Mới</Title>

            {/* Image Upload Section */}
            <View style={styles.imageUploadSection}>
              <Text style={styles.sectionTitle}>Hình ảnh xe</Text>
              <Button 
                mode="outlined"
                onPress={pickImage}
                style={styles.uploadButton}
                icon="camera"
              >
                Chọn ảnh
              </Button>

              <FlatList
                data={formData.images}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => `${item.uri}-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageList}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>Chưa có ảnh nào được chọn</Text>
                )}
              />
            </View>

            <TextInput
              label="Tên xe"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Mô tả"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <TextInput
              label="Giá thuê 1 ngày"
              value={formData.dailyRate}
              onChangeText={(text) => setFormData({ ...formData, dailyRate: text })}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />

            <SelectInput
            label="Hộp số"
            value={formData.transmission}
            options={transmissionOptions}
            onPress={() => setTransmissionModalVisible(true)}
            style={styles.input}
            />

            <SelectInput
            label="Nhiên liệu"
            value={formData.fuelType}
            options={fuelOptions}
            onPress={() => setFuelTypeModalVisible(true)}
            style={styles.input}
            />

            <TextInput
              label="Dung tích nhiên liệu"
              value={formData.fuelCapacity}
              onChangeText={(text) => setFormData({ ...formData, fuelCapacity: text })}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />

            <SelectInput
            label="Vị trí"
            value={formData.location}
            options={locationOptions}
            onPress={() => setLocationModalVisible(true)}
            style={styles.input}
            />

            <Button 
              mode="contained" 
              onPress={handleSubmit}
              style={[styles.button, { backgroundColor: '#5fcf86' }]}
            >
              Lưu Thông Tin
            </Button>
          </Card.Content>
        </Card>

        {renderModal(
          transmissionModalVisible,
          () => setTransmissionModalVisible(false),
          transmissionOptions,
          (value) => setFormData({ ...formData, transmission: value }),
          'Chọn loại hộp số'
        )}

        {renderModal(
          fuelTypeModalVisible,
          () => setFuelTypeModalVisible(false),
          fuelOptions,
          (value) => setFormData({ ...formData, fuelType: value }),
          'Chọn loại nhiên liệu'
        )}

        {renderModal(
          locationModalVisible,
          () => setLocationModalVisible(false),
          locationOptions,
          (value) => setFormData({ ...formData, location: value }),
          'Chọn vị trí'
        )}
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 8,
  },
  imageUploadSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  uploadButton: {
    marginBottom: 16,
  },
  imageList: {
    paddingVertical: 8,
  },
  imageContainer: {
    marginRight: 8,
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
  },
});

export default CreateCar;