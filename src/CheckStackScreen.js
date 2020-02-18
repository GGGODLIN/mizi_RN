import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function CheckStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName="CheckMainScreen"
      headerMode="float"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'tomato' },
        headerLeft:({color, size}) => (
            <Icon name="bars" color={color} size={30} />
          ),
        headerLeftContainerStyle:{padding:20},
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