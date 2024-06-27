import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons

import ProfilePage from '../screens/ProfilePage';
import PieChartPage from '../screens/PieChartPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const BottomNavigatorPage = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Profile') {
              iconName = focused ? 'ios-person' : 'ios-person-outline';
            } else if (route.name === 'PieChart') {
              iconName = focused ? 'ios-pie-chart' : 'ios-pie-chart-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            display: 'flex', // Adjust as per your requirement
          },
        })}
      >
        <Tab.Screen name="Profile" component={ProfilePage} />
        <Tab.Screen name="PieChart" component={PieChartPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomNavigatorPage;
