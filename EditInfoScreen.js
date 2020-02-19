import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {ThemeProvider, Avatar} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditInfoScreen = props => {
  console.log('CHECK CAR?');
  const [data, setdata] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        console.log(obj_value);
        setdata(obj_value);
        setLoading(false);
      }
    } catch (error) {
      console.log('cannot get ITEM');
      // Error retrieving data
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    console.log('info screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>LOADING.............</Text>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',width:'100%'}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center',flexDirection: 'row',}}>
          <Icon name="close" size={30} color="#900" style={{flex:0.2}}/>
          <Text>to do 編輯基本資料</Text>
          <Button title="Go back" onPress={() => props.navigation.goBack()} >GO BACK!!</Button>
        </View>
        
        
      </View>
    );
  }
};

export default EditInfoScreen;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: '7%',
  },
});
