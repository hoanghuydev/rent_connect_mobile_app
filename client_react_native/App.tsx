import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from '@/screens/LoginScreen';
import ExploreScreen from '@/screens/ExploreScreen';
import MessageScreen from '@/screens/MessageScreen';
import RideScreen from '@/screens/RideScreen';
import SupportScreen from '@/screens/SupportScreen';
import { store } from '@/store/store';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
   <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              // Render icon
              let iconName;
              switch (route.name) {
                case 'Explore':
                  iconName = 'home-outline';
                  break;
                case 'Messages':
                  iconName = 'chat-outline';
                  break;
                case 'Rides':
                  iconName = 'car';
                  break;
                case 'Support':
                  iconName = 'headset';
                  break;
                case 'Login':
                  iconName = 'account-outline';
                  break;
                default:
                  iconName = 'home-outline';
              }
              return <Icon name={iconName || ''} size={size} color={color} />;
            },
            // màu khi active
            tabBarActiveTintColor: 'green',
            // màu khi không active
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Explore" component={ExploreScreen} />
          <Tab.Screen name="Messages" component={MessageScreen} />
          <Tab.Screen name="Rides" component={RideScreen} />
          <Tab.Screen name="Support" component={SupportScreen} />
          <Tab.Screen name="Login" component={LoginScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </Provider>
 
  );
}
