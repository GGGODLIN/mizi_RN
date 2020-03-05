import React from 'react';
import {Image,Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {NavigationContainer,useFocusEffect,StackActions} from '@react-navigation/native';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import HistoryTaskOpen from '../HistoryTaskOpen';
import PastReceive from '../PastReceive';

import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function HistoryTasksStackScreen(props) {

  const pushAction = StackActions.push('TodayTaskList');
  useFocusEffect(
    React.useCallback(() => {
      //alert('Screen was focused');
    
      
      return () => {

        props.navigation.dispatch(pushAction);
        //alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <Stack.Navigator
      initialRouteName="HistoryTaskList"
      headerMode="none"
      
    >
      <Stack.Screen
        name="HistoryTaskList"
        component={HistoryTaskList}
        
      />
      <Stack.Screen
        name="HistoryTaskOpen"
        component={HistoryTaskOpen}
        
      />
      <Stack.Screen
        name="PastReceive"
        component={PastReceive}
        
      />
      
    </Stack.Navigator>
  );
}