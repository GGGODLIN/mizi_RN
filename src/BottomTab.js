import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import { useIsFocused } from '@react-navigation/native';

import InfoScreen from '../InfoScreen';
import CheckMainScreen from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CheckStackScreen from './CheckStackScreen';
import InfoStackScreen from './InfoStackScreen';
import TodayTasksStackScreen from './TodayTasksStackScreen';
import HistoryTasksStackScreen from './HistoryTasksStackScreen';


import call from 'react-native-phone-call';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Linking} from 'react-native'
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  Button,
} from 'react-native-paper';
const args = {
  number: '9093900003', // String value with the number to call
  prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
};
const Tab = createMaterialBottomTabNavigator();
const callOut = ({ navigation }) => {
  const isFocused = useIsFocused();
 
  if(isFocused){
    call(args);
    navigation.goBack();
    return null;
  }
  else{
    return(<Text>QQ</Text>);
  }
};

export default function BottomTab(route) {
  return (
    <Tab.Navigator
      initialRouteName="TodayTasksStackScreen"
      shifting={false}
      unmountOnBlur={true}>
      <Tab.Screen
        name="首頁"
        component={TodayTasksStackScreen}
        options={{
          tabBarIcon: 'home-account',
        }}
      />
      <Tab.Screen
        name="基本資料"
        component={InfoStackScreen}
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
        component={HistoryTasksStackScreen}
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
