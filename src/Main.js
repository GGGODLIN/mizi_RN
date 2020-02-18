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
  if (!props.switchOn){
    return null;
  }
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={BottomTab} />
      <Drawer.Screen name="CarCheckScreen" component={CarCheckScreen} />
      <Drawer.Screen name="BodyCheckScreen" component={BodyCheckScreen} />
    </Drawer.Navigator>
  );
}
