import React from 'react';
import {Image,Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen  from '../InfoScreen';
import CheckMainScreen  from '../CheckMainScreen';
import HistoryTaskList from '../historyTaskList';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import EditInfoScreen from '../EditInfoScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

export default function InfoStackScreen(props) {
  return (
    <Stack.Navigator
      initialRouteName="InfoScreen"
      headerMode="float"
      screenOptions={{
        headerTintColor: 'black',
        headerStyle: { backgroundColor: '#f6a91e' },
        headerRight:({color, size}) => (
                                        <Icon name="bars" color='white' size={25} style={{paddingBottom:50}} onPress={() => props.navigation.openDrawer()}/>

          ),
       headerLeft:({color, size}) => (
            <Image
          //style={{width:'100%', height:'100%',padding:20,paddingStart:'500%'}}
          source={require('../img/driver_logo.png')}
        />

          ),
        headerRightContainerStyle:{padding:20},
        headerLeftContainerStyle:{paddingHorizontal:20,paddingBottom:20},
        title: ' ',
      }}
    >
      <Stack.Screen
        name="InfoScreen"
        component={InfoScreen}
        options={{

        }}
      />
      <Stack.Screen
        name="EditInfoScreen"
        component={EditInfoScreen}
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
