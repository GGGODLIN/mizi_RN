import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';

import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {ThemeProvider, Avatar} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider,ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import CarCheckScreen from './CarCheckScreen';

const CheckMainScreen = props => {
  console.log('Navigation?', props?.navigation);
  const [data, setdata] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        let url = `http://wheat-tainan.1966.org.tw:20021/api/DriverInfo/GetDriverCheck/${
          obj_value?.response?.Id
        }`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log('FETCH CHECKED??????', res?.response?.CarCheck);
            setcarChecked(res?.response?.CarCheck);
            setbodyChecked(res?.response?.DriverCheck);
          }).catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
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

  useFocusEffect(
    React.useCallback(() => {
      //alert('Screen was focused');
      fetchData().then(() => setLoading(false));
      return () => {
        setLoading(true);
        //alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  if (isLoading) {
    console.log('info screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} size='large' />
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Icon
            name="close"
            size={30}
            color="#900"
            style={carChecked && bodyChecked ? {display: 'none'} : {flex: 0.2}}
          />
          <Icon
            name="check"
            size={30}
            color="#900"
            style={carChecked && bodyChecked ? {flex: 0.2}:{display: 'none'}}
          />
          <Text>
            {carChecked && bodyChecked
              ? '您今日已完成每日檢查'
              : '您今日尚未完成檢查'}
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Button
            color="red"
            style={{flex: 1}}
            labelStyle={{color: 'black'}}
            contentStyle={{width: '100%', height: '100%'}}
            icon={carChecked ? 'check' : 'close'}
            mode="text"
            onPress={() => console.log('Pressed')}>
            車輛
          </Button>
          <Divider />
          <Button
            color="red"
            style={{flex: 1}}
            labelStyle={{color: 'black'}}
            contentStyle={{width: '100%', height: '100%'}}
            icon={bodyChecked ? 'check' : 'close'}
            mode="text"
            onPress={() => console.log('Pressed')}>
            身心
          </Button>
        </View>
        <View
          style={(carChecked&&bodyChecked)?{display:'none'}:{
            flex: 8,
            justifyContent: 'flex-start',
            flexDirection: 'column',
            width: '100%',
           
          }}>
         
            <Button
              color="orange"
              style={
                carChecked
                  ? {
                      flex: 0.2,
                      marginVertical: 8,
                      marginHorizontal: 16,
                      borderRadius: 50,
                      display: 'none',
                    }
                  : {
                      flex: 0.2,
                      marginVertical: 8,
                      marginHorizontal: 16,
                      borderRadius: 50,
                    }
              }
              labelStyle={{color: 'black'}}
              contentStyle={{width: '100%', height: '100%'}}
              icon="car"
              mode="contained"
              onPress={() => props?.navigation?.navigate('CarCheckScreen')}>
              進行車輛檢查
            </Button>
            <Button
              color="orange"
              style={
                bodyChecked
                  ? {
                      flex: 0.2,
                      marginVertical: 8,
                      marginHorizontal: 16,
                      borderRadius: 50,
                      display: 'none',
                    }
                  : {
                      flex: 0.2,
                      marginVertical: 8,
                      marginHorizontal: 16,
                      borderRadius: 50,
                    }
              }
              labelStyle={{color: 'black'}}
              contentStyle={{width: '100%', height: '100%'}}
              icon="heart"
              mode="contained"
              onPress={() => props?.navigation.navigate('BodyCheckScreen')}>
              進行身心檢查
            </Button>
        </View>
        <View style={{flex:1}}></View>
        <Image
          resizeMode='center'
          style={(carChecked&&bodyChecked)?{flex:6}:{display:'none'}}
          source={require('./img/ok.png')}
        />
        <View style={{flex:1}}></View>
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
