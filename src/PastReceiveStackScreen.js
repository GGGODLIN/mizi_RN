import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {Image,Text} from 'react-native';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../historyTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import HistoryTaskOpen from '../HistoryTaskOpen';
import PastReceive from '../PastReceive';

import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function PastReceiveStackScreen(props) {
  return (
    <Stack.Navigator
      initialRouteName="PastReceive"
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
          source={require('../img/driver_logo.png')}
        />

          ),
        headerRightContainerStyle:{padding:20},
        headerLeftContainerStyle:{padding:20},
        title: ' ',
      }}
    >
      
      <Stack.Screen
        name="PastReceive"
        component={PastReceive}
        options={{
          
        }}
      />
    </Stack.Navigator>
  );
}