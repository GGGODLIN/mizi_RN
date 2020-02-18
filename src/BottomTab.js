import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CheckStackScreen from './CheckStackScreen';


const Tab = createMaterialBottomTabNavigator();

export default function BottomTab () {
  return (
    <Tab.Navigator
      initialRouteName="HistoryTaskList"
      shifting={true}
      sceneAnimationEnabled={false}
    >
      <Tab.Screen
        name="InfoScreen"
        component={InfoScreen}
        options={{
          tabBarIcon: 'home-account',
        }}
      />
      <Tab.Screen
        name="HistoryTaskList"
        component={HistoryTaskList}
        options={{
          tabBarIcon: 'bell-outline',
        }}
      />
      <Tab.Screen
        name="CheckStackScreen"
        component={CheckStackScreen}
        options={{
          tabBarIcon: 'message-text-outline',
        }}
      />
    </Tab.Navigator>
  );
};