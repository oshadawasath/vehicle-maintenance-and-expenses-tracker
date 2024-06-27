import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigations from './navigations/AppNavagations';
import HomePage from './screens/HomePage';

const App = () => {
  const Stack = createStackNavigator();

  return (
   
    <>
      {/* { <AppNavigations/> } */}
      <HomePage/>
   </>    
  );
};

export default App;
