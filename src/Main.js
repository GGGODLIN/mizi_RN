import React from 'react';
import {Text, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTab from './BottomTab';
import DrawerContent from './DrawerContent';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

export default function RootNavigator(props) {
  var data = props.logindata;
  if (!props.switchOn) {
    return null;
  }
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: 'white',
        margin: 0,
        padding: 0,
        borderWidth: 0,
        top: 0,
      }}
      drawerContent={props => <DrawerContent {...props} logindata={data} />}>
      <Drawer.Screen name="Home" component={BottomTab} />
      <Drawer.Screen name="CarCheckScreen" component={CarCheckScreen} />
      <Drawer.Screen name="BodyCheckScreen" component={BodyCheckScreen} />
    </Drawer.Navigator>
  );
}
