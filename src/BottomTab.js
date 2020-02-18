import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import InfoScreen from '../InfoScreen';
import CheckMainScreen from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CheckStackScreen from './CheckStackScreen';
import call from 'react-native-phone-call';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Linking} from 'react-native'

const args = {
  number: '9093900003', // String value with the number to call
  prompt: true, // Optional boolean property. Determines if the user should be prompt prior to the call
};
const Tab = createMaterialBottomTabNavigator();
const callOut = ({ navigation }) => {
 
  return ({call(args).then(res=>navigation.goBack()).catch(console.error)});
};

export default function BottomTab(route) {
  return (
    <Tab.Navigator
      initialRouteName="HistoryTaskList"
      shifting={true}
      sceneAnimationEnabled={false}>
      <Tab.Screen
        name="首頁"
        component={HistoryTaskList}
        options={{
          tabBarIcon: 'home-account',
        }}
      />
      <Tab.Screen
        name="基本資料"
        component={InfoScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="user-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="每日檢查"
        component={CheckStackScreen}
        options={{
          tabBarIcon: 'message-text-outline',
        }}
      />
      <Tab.Screen
        name="任務歷程"
        component={HistoryTaskList}
        options={{
          tabBarIcon: 'home-account',
        }}
      />
      <Tab.Screen
        name="聯繫行控"
        component={callOut}
        options={{
          tabBarIcon: 'message-text-outline',
          tabBarButton: props => <callOut {...props} />,
        }}
      />
    </Tab.Navigator>
  );
}
