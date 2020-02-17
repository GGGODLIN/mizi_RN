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

import CarCheckScreen from './CarCheckScreen';

const CheckMainScreen = props => {
  console.log('Navigation?', props.navigation);
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
          <Text>您今日尚未完成檢查</Text>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Button
            color='red'
            style={{flex:1}}
            labelStyle={{color:'black'}}
            contentStyle={{width:'100%',height:'100%'}}
            icon="check"
            mode="text"
            onPress={() => console.log('Pressed')}>
            車輛
          </Button>
          <Divider />
          <Button
            color='red'
            style={{flex:1}}
            labelStyle={{color:'black'}}
            contentStyle={{width:'100%',height:'100%'}}
            icon="close"
            mode="text"
            onPress={() => console.log('Pressed')}>
            身心
          </Button>
        </View>
        <View
          style={{
            flex: 8,
            justifyContent: 'flex-start',
            flexDirection: 'column',
            width:'100%',
          }}>
          <Button
            color='orange'
            style={carChecked?{flex:0.2,marginVertical: 8,marginHorizontal: 16,borderRadius:50,display:'none'}:{flex:0.2,marginVertical: 8,marginHorizontal: 16,borderRadius:50}}
            labelStyle={{color:'black'}}
            contentStyle={{width:'100%',height:'100%'}}
            icon="car"
            mode="contained"
            onPress={() => console.log('Pressed')}>
            進行車輛檢查
          </Button>
          <Button
            color='orange'
            style={bodyChecked?{flex:0.2,marginVertical: 8,marginHorizontal: 16,borderRadius:50,display:'none'}:{flex:0.2,marginVertical: 8,marginHorizontal: 16,borderRadius:50}}
            labelStyle={{color:'black'}}
            contentStyle={{width:'100%',height:'100%'}}
            icon="heart"
            mode="contained"
            onPress={() => console.log('Pressed')}>
            進行身心檢查
          </Button>
        </View>
      </View>
    );
  }
};

export default CheckMainScreen;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: '7%',
  },
});
