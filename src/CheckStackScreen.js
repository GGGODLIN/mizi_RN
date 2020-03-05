import React from 'react';
import {Image,Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../HistoryTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function CheckStackScreen(props) {
  return (
    <Stack.Navigator
      initialRouteName="CheckMainScreen"
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
        name="CheckMainScreen"
        component={CheckMainScreen}
        options={{

        }}
      />
      <Stack.Screen
        name="CarCheckScreen"
        component={CarCheckScreen}
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