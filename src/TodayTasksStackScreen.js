import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import HistoryTaskOpen from '../HistoryTaskOpen';
import TodayTaskList from '../TodayTaskList';
import TodayTaskOpen from '../TodayTaskOpen';
import HitCard from '../HitCard';

import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function TodayTasksStackScreen(props) {
  return (
    <Stack.Navigator
      initialRouteName="TodayTaskList"
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
        name="TodayTaskList"
        component={TodayTaskList}
        options={{

        }}
      />
      <Stack.Screen
        name="TodayTaskOpen"
        component={TodayTaskOpen}
        options={{

        }}
      />
      <Stack.Screen
        name="HitCard"
        component={HitCard}
        options={{
          
        }}
      />
    </Stack.Navigator>
  );
}