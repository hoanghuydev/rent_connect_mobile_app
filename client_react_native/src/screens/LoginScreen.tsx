import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import authApi from "src/api/authApi"; // Đảm bảo đường dẫn đúng
import styles from "src/styles/LoginScreen.styles";
import { AccountStackParamList } from "@/routes/AccountStack";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await authApi.login({ phoneNumber, password });
      if (response.status === 200) {
        Alert.alert("Đăng nhập thành công", `Chào mừng, ${response.data.name}`);
      } else {
        Alert.alert(
          "Đăng nhập thất bại",
          response.data.message || "Số điện thoại hoặc mật khẩu không đúng"
        );
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const navigateRegister = () => {
    navigation.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Đăng nhập
      </Text>

      <Text style={styles.label}>Số điện thoại của bạn</Text>
      <TextInput
        mode="outlined"
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        left={<TextInput.Icon icon="phone" />}
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

      <Button
        onPress={() => Alert.alert("Quên mật khẩu", "Hãy liên hệ hỗ trợ.")}
        textColor="#4CAF50"
      >
        Quên mật khẩu?
      </Button>

      <Button
        mode="contained"
        onPress={handleLogin}
        buttonColor="#4CAF50"
        style={styles.loginButton}
        labelStyle={styles.loginButtonText}
        loading={loading}
        disabled={loading}
      >
        Đăng nhập
      </Button>

      <View style={styles.socialContainer}>
        <IconButton icon="google" size={30} onPress={() => Alert.alert("Google login")} />
        <IconButton icon="facebook" size={30} onPress={() => Alert.alert("Facebook login")} />
        <IconButton icon="apple" size={30} onPress={() => Alert.alert("Apple login")} />
      </View>

      <Text style={styles.footerText}>
        Bạn chưa là thành viên?{" "}
        <Text
          style={styles.registerText}
          onPress={navigateRegister}
        >
          Hãy đăng ký ngay
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
