import React from 'react';
import {Text, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Header} from 'react-native-elements';
import BottomTab from './BottomTab';
import DrawerContent from './DrawerContent';
import CarCheckScreen from '../CarCheckScreen';
import BodyCheckScreen from '../BodyCheckScreen';
import PastReceive from '../PastReceive';
import HistoryTasksStackScreen from './HistoryTasksStackScreen';
import PastReceiveStackScreen from './PastReceiveStackScreen';


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
  console.log("LOGOUT",props.handleLogout);
  function handleLogout(){
    console.log("LOG OUT!!!!");
    props.handleLogout(false);
  }

  if (!props.switchOn) {
    return null;
  }
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerPosition='right'
      drawerStyle={{
        backgroundColor: 'white',
        margin: 0,
        padding: 0,
        borderWidth: 0,
        top: 0,
      }}
      drawerContent={props => <DrawerContent {...props} logindata={data} handleLogout={handleLogout}/>}
      >
      <Drawer.Screen name="Home" component={BottomTab} />
      <Drawer.Screen name="過去營收" component={PastReceiveStackScreen} />
      <Drawer.Screen name="任務歷程" component={HistoryTasksStackScreen} />
    </Drawer.Navigator>
  );
}
