/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {ThemeProvider, Avatar} from 'react-native-elements';
import {Header} from 'react-native-elements';
import {Button, Card, Title, Paragraph} from 'react-native-paper';
import InfoScreen from './InfoScreen';
import HistoryTaskList from './historyTaskList';
import CheckMainScreen from './CheckMainScreen';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    console.log('PROPS IS', props);

    this.state = {
      loading: true,
    };
    this.checkTodayScreen = this.checkTodayScreen.bind(this);
    this.handleMenuOnPress = this.handleMenuOnPress.bind(this);
    this.LoadingScreen = this.LoadingScreen.bind(this);
    this.taskTodayScreen = this.taskTodayScreen.bind(this);
  }

  componentDidMount = async () => {
    const data = await fetch(
      'http://cih.1966.org.tw/api/DriverInfo/Get/15',
    )
      .then(response => response.json())
      .then(res => console.log(res));
    this.setState({
      data: data,
      loading: false,
    });
  };

  LoadingScreen({route, navigation}) {
    console.log('LOADING PAGE');

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>LOADING.............</Text>
      </View>
    );
  }

  checkTodayScreen({route, navigation, props}) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Settings!</Text>
      </View>
    );
  }
  taskTodayScreen({route, navigation, props}) {
    console.log('TASKLOADING?', this.state.loading);
    if (this.state.loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>
            {this.state.loading ? 'TASKLOADING!!!!!!!!!!!!!!!' : 'TASK HAHA'}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>taskToday!</Text>
        </View>
      );
    }
  }

  handleMenuOnPress(){
    console.log("PRESSED!");
    <InfoScreen />

  }

  render() {
    if (!this.props.switchOn) {
      return null;
    }
    const Tab = createBottomTabNavigator();
    const Drawer = createDrawerNavigator();
    var isload = this.state.loading;
    console.log('ARE U LOADING?', isload);
    return (
      
      <NavigationContainer>
        <Header
          leftComponent={{icon: 'menu', color: '#fff', onPress:() => this.handleMenuOnPress(), size:35,}}
          centerComponent={{text: 'MY TITLE', style: {color: '#fff', flex:10}}}
          rightComponent={{icon: 'home', color: '#fff'}}
          containerStyle={{
    backgroundColor: '#3D6DCC',
    justifyContent: 'space-evenly',
    flex:0.1,
  }}
        />
        <Tab.Navigator
          initialRouteName="今日任務"
          activeColor="#f0edf6"
          inactiveColor="black"
          barStyle={{backgroundColor: '#694fad'}}>
          <Tab.Screen name="基本資料" component={InfoScreen} />
          <Tab.Screen name="每日檢查" component={CheckMainScreen} />
          <Tab.Screen name="今日任務" component={HistoryTaskList} />
          <Tab.Screen name="聯繫行控" component={InfoScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});
