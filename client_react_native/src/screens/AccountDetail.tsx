import React from 'react';
import { View, Text, Button } from 'react-native';
import { AccountStackParamList } from "@/routes/AccountStack";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const AccountDetail = ({}) => {
    const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  return (
    <View>
      <Text>Welcome to your account details!</Text>
      <Button title="Log out" onPress={
        () => navigation.navigate('Login')
        } />
    </View>
  );
};

export default AccountDetail;
