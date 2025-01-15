import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from '@/screens/login/LoginScreen';
import MyVehScreen from '@/screens/profile/MyVehScreen';
import CarDetailScreen from '@/screens/cars/CarDetail';
import ExploreScreen from '@/screens/explore/ExploreScreen';
import MessageScreen from '@/screens/message/MessageScreen';
import RideScreen from '@/screens/ride/RideScreen';
import SupportScreen from '@/screens/support/SupportScreen';
import { store } from '@/store/store';
import {createStackNavigator} from "@react-navigation/stack";
import MainScreen from "@/MainScreen";
import RegisterScreen from "@/screens/register/RegisterScreen";
import LocationFilterScreen from "@/screens/locationFilter/LocationFilterScreen";
import {RootStackParamList} from "@/navigation/type";
import DateFilterScreen from "@/screens/dateFilter/DateFilterScreen";
import ProfileScreen from '@/screens/profile/ProfileScreen';
import ProfileEditing from '@/screens/profile/ProfileEditing';
import BookingHistoryScreen from '@/screens/bookingHistory/BookingHistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();
export default function App() {
  return (
    <Provider store={store}>
   <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Main" // Đặt màn hình chính là MainScreen
            screenOptions={{
              headerShown: false, // Ẩn header
            }}
        >
          <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="LocationFilter" component={LocationFilterScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="DateFilter" component={DateFilterScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ProfileEditing" component={ProfileEditing} />
            <Stack.Screen name="MyVeh" component={MyVehScreen} />
            <Stack.Screen name="CarDetail" component={CarDetailScreen} />
            <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </Provider>

  );
}
