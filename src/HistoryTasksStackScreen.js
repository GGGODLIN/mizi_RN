import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import HistoryTaskOpen from '../HistoryTaskOpen';

import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function HistoryTasksStackScreen(props) {
  return (
    <Stack.Navigator
      initialRouteName="HistoryTaskList"
      headerMode="float"
      screenOptions={{
        headerTintColor: 'black',
        headerStyle: { backgroundColor: 'white' },
        headerLeft:({color, size}) => (
            <Icon name="bars" color={color} size={20} onPress={() => props.navigation.openDrawer()}/>
          ),
        headerLeftContainerStyle:{padding:20},
        title: 'Donkey Move 司機端',
      }}
    >
      <Stack.Screen
        name="HistoryTaskList"
        component={HistoryTaskList}
        options={{

        }}
      />
      <Stack.Screen
        name="HistoryTaskOpen"
        component={HistoryTaskOpen}
        options={{

        }}
      />
      <Stack.Screen
        name="BodyCheckScreen"
        component={BodyCheckScreen}
        options={{
          
        }}
      />
    </Stack.Navigator>
  );
}