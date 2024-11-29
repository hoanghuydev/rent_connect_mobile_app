import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import AccountDetail from '@/screens/AccountDetail';

export type AccountStackParamList = {
  Login: undefined;
  Register: undefined;
  AccountDetail: undefined;
};

const Stack = createStackNavigator<AccountStackParamList>();

const AccountStack = () => {
    const isLoggedIn = false; //check logged status
  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? 'AccountDetail' : 'Login'}>
      <Stack.Screen name="AccountDetail" component={AccountDetail} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AccountStack;
