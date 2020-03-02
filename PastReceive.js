import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
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

import {NavigationContainer,useFocusEffect,StackActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {ThemeProvider, Avatar} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider,ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

function Item ({data, navigation}) {

  return(
    <View
    elevation={5}
        style={{
          width: '95%',
          alignItems: 'center',
          backgroundColor: 'white',
          alignSelf: 'center',
          marginVertical: 10,
          borderRadius:10,

        }}>
        <View style={{flexDirection: 'row',justifyContent:'space-around',alignItems:'center',borderBottomWidth:1,width:'95%'}}>
          <Text style={{flex:2,paddingVertical:10}}>日期</Text>
          <Text style={{flex:1}}>{data.CreateDate.slice(0, 10)}</Text>
        </View>
        <View style={{flexDirection: 'row',justifyContent:'space-around',alignItems:'center',borderBottomWidth:1,width:'95%'}}>
          <Text style={{flex:2,paddingVertical:10}}>應收金額</Text>
          <Text style={{flex:1}}>{data.ShouldReceiveAmt}</Text>
        </View>
        <View style={{flexDirection: 'row',justifyContent:'space-around',alignItems:'center',width:'95%'}}>
          <Text style={{flex:2,paddingVertical:10}}>實收金額</Text>
          <Text style={{flex:1}}>{data.RealReceiveAmt}</Text>
        </View>

    </View>
    );
}

const PastReceive = props => {
  console.log('CHECK CAR?');
  const [data, setdata] = useState({});
  const [box, setbox] = useState({});
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

        var url3 =
          'http://wheathwaapi.vielife.com.tw/api/DriverInfo/GetDriverReceiveList/' +
          obj_value.response.Cars.DriverId + '?nearMonth=3';

        const data2 = await fetch(url3, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log('TASK AJAX', res);
            setbox(res);
          })
          .catch(err => {
            console.log('TASKS ERROR!', err);
          });

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
        <ActivityIndicator animating={true} size='large' />
      </View>
    );
  } else {
    const list = box.response;
    console.log(list);
    return (
      <SafeAreaView style={styles.container}>
        
        <FlatList
        inverted
          data={list}
          renderItem={({item}) => (
            <Item
              data={item}
              navigation={props.navigation}
            />

          )}
          keyExtractor={item => item.Id}
        />
      </SafeAreaView>
    );
  }
};

export default PastReceive;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: '7%',
  },
  container: {
   
  },
});
