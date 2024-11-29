import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import styles from "src/styles/RegisterScreen.styles";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AccountStackParamList } from "@/routes/AccountStack";
import authApi from "@/api/authApi";

const RegisterScreen = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      // Gửi thông tin đăng ký đến backend
      // Ví dụ: const response = await authApi.register({ fullName, phoneNumber, password });

      // Giả lập phản hồi thành công
      const response = await authApi.register({ fullName, phoneNumber, password, email });
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Đăng ký thành công", "Chào mừng bạn đã trở thành thành viên!");
        // Điều hướng sang màn hình đăng nhập hoặc trang chính
      }, 1500);
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến server. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const navigateLogin = () => {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

      <Text style={styles.label}>Họ và tên</Text>
      <TextInput
        mode="outlined"
        placeholder="Nhập họ và tên"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        mode="outlined"
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        left={<TextInput.Icon icon="phone" />}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        mode="outlined"
        placeholder="Nhập Email"
        value={fullName}
        onChangeText={setEmail}
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        mode="outlined"
        placeholder="Nhập mật khẩu"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <Text style={styles.label}>Xác nhận mật khẩu</Text>
      <TextInput
        mode="outlined"
        placeholder="Nhập lại mật khẩu"
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        buttonColor="#4CAF50"
        style={styles.registerButton}
        labelStyle={styles.registerButtonText}
        loading={loading}
        disabled={loading}
      >
        Đăng ký
      </Button>

      <View style={styles.socialContainer}>
        <IconButton
          icon="google"
          size={30}
          onPress={() => Alert.alert("Google đăng ký")}
        />
        <IconButton
          icon="facebook"
          size={30}
          onPress={() => Alert.alert("Facebook đăng ký")}
        />
        <IconButton
          icon="apple"
          size={30}
          onPress={() => Alert.alert("Apple đăng ký")}
        />
      </View>

      <Text style={styles.footerText}>
        Đã có tài khoản?{" "}
        <Text
          style={styles.loginText}
          onPress={navigateLogin}
        >
          Hãy đăng nhập ngay
        </Text>
      </Text>
    </View>
  );
};

export default RegisterScreen;
