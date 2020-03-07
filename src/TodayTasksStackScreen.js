import React from 'react';
import {Image,Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../historyTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import HistoryTaskOpen from '../HistoryTaskOpen';
import TodayTaskList from '../TodayTaskList';
import TodayTaskOpen from '../TodayTaskOpen';
import HitCard from '../HitCard';
import PastReceiveStackScreen from './PastReceiveStackScreen';
import PastReceive from '../PastReceive';
import HistoryTasksStackScreen from './HistoryTasksStackScreen';

import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function TodayTasksStackScreen(props) {
  return (
    <Stack.Navigator
      initialRouteName="TodayTaskList"
      headerMode="float"
      screenOptions={{
        headerTintColor: 'black',
        headerStyle: { backgroundColor: '#f6a91e' },
        headerRight:({color, size}) => (
            <Icon name="bars" color='white' size={20} onPress={() => props.navigation.openDrawer()}/>

          ),
       headerLeft:({color, size}) => (
            <Image
          style={{width:'100%', height:'100%',padding:20,paddingStart:'500%'}}
          source={require('../img/logo-light.png')}
        />

          ),
        headerRightContainerStyle:{padding:20},
        headerLeftContainerStyle:{padding:20},
        title: ' ',
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
      <Stack.Screen
        name="PastReceive"
        component={PastReceive}
        options={{

        }}
      />
      <Stack.Screen
        name="HistoryTasksStackScreen"
        component={HistoryTasksStackScreen}
        options={{

        }}
      />
    </Stack.Navigator>
  );
}
