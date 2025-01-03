import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Podcasts from '../screens/Podcasts';
import Heroes from '../screens/Heroes';

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, animation: "none"}}>
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="Podcasts"
          component={Podcasts}
        />
        <Stack.Screen
          name="Heroes"
          component={Heroes}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};