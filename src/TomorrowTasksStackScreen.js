import React from 'react';
import {Image,Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../historyTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import HistoryTaskOpen from '../HistoryTaskOpen';
import TomorrowTaskList from '../TomorrowTaskList';
import TomorrowTaskOpen from '../TomorrowTaskOpen';
import HitCard from '../HitCard';
import PastReceiveStackScreen from './PastReceiveStackScreen';
import PastReceive from '../PastReceive';
import HistoryTasksStackScreen from './HistoryTasksStackScreen';

import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function TomorrowTasksStackScreen(props) {
  return (
    <Stack.Navigator
      initialRouteName="TomorrowTaskList"
      headerMode="float"
      screenOptions={{
        headerTintColor: 'black',
        headerStyle: { backgroundColor: '#f6a91e' },
        headerRight:({color, size}) => (
            <Icon name="bars" color='white' size={20} onPress={() => props.navigation.openDrawer()}/>

          ),
       headerLeft:({color, size}) => (
            <Image
          style={{width:'440%', height:'100%',padding:20,paddingStart:'300%'}}
          source={require('../img/driver_logo.png')}
        />

          ),
        headerRightContainerStyle:{padding:20},
        headerLeftContainerStyle:{padding:20},
        title: ' ',
      }}
    >
      <Stack.Screen
        name="TomorrowTaskList"
        component={TomorrowTaskList}
        options={{

        }}
      />
      <Stack.Screen
        name="TomorrowTaskOpen"
        component={TomorrowTaskOpen}
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
