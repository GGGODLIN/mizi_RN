import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';

const Stack = createStackNavigator();

export default function CheckStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName="CheckMainScreen"
      headerMode="none"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'tomato' },
      }}
    >
      <Stack.Screen
        name="CheckMainScreen"
        component={CheckMainScreen}
        options={{
          title: 'Awesome app',
        }}
      />
      <Stack.Screen
        name="CarCheckScreen"
        component={CarCheckScreen}
        options={{
          title: 'My profile',
        }}
      />
      <Stack.Screen
        name="BodyCheckScreen"
        component={BodyCheckScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}