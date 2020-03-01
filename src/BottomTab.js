import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useIsFocused} from '@react-navigation/native';

import InfoScreen from '../InfoScreen';
import CheckMainScreen from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CheckStackScreen from './CheckStackScreen';
import InfoStackScreen from './InfoStackScreen';
import TodayTasksStackScreen from './TodayTasksStackScreen';
import HistoryTasksStackScreen from './HistoryTasksStackScreen';

import call from 'react-native-phone-call';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Linking} from 'react-native';
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
  number: '038705115', // String value with the number to call
  prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
};
const Tab = createMaterialBottomTabNavigator();
const callOut = ({navigation}) => {
  const isFocused = useIsFocused();

  if (isFocused) {
    call(args);
    navigation.goBack();
    return null;
  } else {
    return <Text>QQ</Text>;
  }
};

export default function BottomTab(props) {
  return (
    <Tab.Navigator
      initialRouteName="今日任務"
      shifting={false}
      lazy={false}
      unmountOnBlur={true}>
      <Tab.Screen
        name="基本資料"
        component={InfoStackScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="user-check" color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: e => {
            // Prevent default action
            //e.preventDefault();
            console.log('HAHA56974957912779455712945957462416119457------------------------------');
          },
        }}
      />
      <Tab.Screen
        name="每日檢查"
        component={CheckStackScreen}
        options={{
          tabBarIcon: 'message-text-outline',
        }}
        listeners={{
          tabPress: e => {
            // Prevent default action
            //e.preventDefault();
            console.log('HAHA56974957912779455712945957462416119457------------------------------');
          },
        }}
      />
      <Tab.Screen
        name="今日任務"
        component={TodayTasksStackScreen}
        options={{
          tabBarIcon: 'home-account',
        }}
        listeners={{ tabPress: e => {e.preventDefault();} }}
      />

      <Tab.Screen
        name="聯繫行控"
        component={callOut}
        options={{
          tabBarIcon: 'message-text-outline',
          tabBarButton: props => <callOut {...props} />,
        }}
        listeners={{ tabPress: e => console.log('Tab press', e.target), }}
      />
    </Tab.Navigator>
  );
}
