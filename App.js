import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Button, ThemeProvider} from 'react-native-elements';

import Screen from './Screen';
import LoginScreen from './LoginScreen';

const App: () => React$Node = () => {
  const [logged, setlogged] = useState(false);

  {
    /*const [data, setdata] = useState({});
    const [loading, setloading] = useState({lodingOrNot:true});
  
    async function fetchData() {
      const res = await fetch("http://qif-nantou.1966.org.tw:20022/api/DriverInfo/Get/15");
      res.json()
        .then(res => {
          console.log(res.msg);
          setdata(res);
          setloading({lodingOrNot:false});
        })
        .catch(err => {console.log("HAHA ERROR!")});
    }
  
    useEffect(() => {
      fetchData();
    }, []);*/
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem('TASKS', 'I like to save it.');
    } catch (error) {
      console.log('LOCALSTORAGE WRONG');
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('TASKS');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      console.log('cannot get ITEM');
      // Error retrieving data
    }
  };


  handleLogin = async res => {
    try {
      await AsyncStorage.setItem('userLoginInfo', JSON.stringify(res));
      console.log('SAVED ASYNC',res);
      setlogged(res.success);
    } catch (error) {
      console.log('LOCALSTORAGE WRONG');
      // Error saving data
    }
    //console.log("handel",res);
    
  };

  return (
    <>
      <ThemeProvider>
      <LoginScreen handleLogin={handleLogin} switchOn={!logged} />
      <Screen switchOn={logged} />
      </ThemeProvider>
      
      
      <StatusBar barStyle="dark-content" />

    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {},
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;