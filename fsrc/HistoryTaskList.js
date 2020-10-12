import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
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

import {ThemeProvider, Avatar, ListItem, Icon} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider} from 'react-native-paper';

function Item({data}) {
  var caseName = data.DespatchDetails[0].CaseUser.Name;
  var startTime = data.DespatchDetails[0].Despatch.StartDate;
  var pos = startTime.indexOf('T');
  if (pos != -1) {
    startTime = startTime.substring(pos + 1);
  }
  var canShared = data.DespatchDetails[0].OrderDetails.CanShared
    ? '可以共乘'
    : '不可共乘';
  var FamilyWith = data.DespatchDetails[0].OrderDetails.FamilyWith;
  var ForeignFamilyWith =
    data.DespatchDetails[0].OrderDetails.ForeignFamilyWith;
  var FromAddr = data.DespatchDetails[0].OrderDetails.FromAddr;
  var ToAddr = data.DespatchDetails[0].OrderDetails.ToAddr;
  return (
    <View style={styles.box}>
      <View style={styles.item}>
        <Text style={styles.title}>{startTime}</Text>
        <Text style={styles.title}>{canShared}</Text>
      </View>
      <Divider />
      <View style={styles.item2}>
        <View style={styles.item2_1}>
          <Text style={styles.title}>{caseName}</Text>
          <Text style={styles.title}>{'輪椅讀啥'}</Text>
        </View>
        <View style={styles.item2_1}>
          <Text style={styles.title}>{'陪伴家屬:  ' + FamilyWith}</Text>
          <Text style={styles.title}>{'陪伴外籍:  ' + ForeignFamilyWith}</Text>
        </View>
      </View>
      <View style={styles.item3}>
        <View style={styles.item3_1}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="circle"
              type="font-awesome"
              color="orange"
              size={16}
            />
            <Text style={{flex:1}}>{"  "+FromAddr}</Text>

          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="circle"
              type="font-awesome"
              color="orange"
              size={16}
            />
            <Text >{"  "+ToAddr}</Text>
          </View>
          
        </View>
      </View>
    </View>
  );
}

const HistoryTaskList = props => {
  const [data, setdata] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [url, seturl] = useState();

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        console.log('GET FROM ASYN IS', obj_value);
        var url2 =
          'http://cic.1966.org.tw/api/DriverInfo/GetAllPassGroup/' +
          obj_value.response.Id;
        seturl(
          `http://cic.1966.org.tw/api/DriverInfo/GetAllPassGroup/${
            obj_value.response.Id
          }`,
        );
        //let url = `http://cic.1966.org.tw/api/DriverInfo/GetAllGroup/${obj_value.Id}`;
        const data = await fetch(url2, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log('TASK AJAX', res);
            setdata(res);
            setLoading(false);
          })
          .catch(err => {
            console.log('TASKS ERROR!');
          });
      }
    } catch (error) {
      console.log('cannot get ITEM');
      // Error retrieving data
    }
  }

  async function fetchData_test() {
    const data = await fetch(
      'http://cic.1966.org.tw/api/DriverInfo/GetAllPassGroup/15',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(res => {
        console.log('TASK AJAX', res);
      })
      .catch(err => {
        console.log('TASKS ERROR!');
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    console.log('TASKS screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>TASKS LOADING.............</Text>
      </View>
    );
  } else {
    const list = data.response;
    console.log('TASKS PROPS IS', list);
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={list}
          renderItem={({item}) => (
            <Item title={item.DespatchDetails[0].CaseUser.Name} data={item} />
          )}
          keyExtractor={item => item.DespatchId}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'pink',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'baseline',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  item2: {
    backgroundColor: 'gray',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  item2_1: {
    backgroundColor: 'white',
  
    padding: 10,

    flexDirection: 'column',
  },
  item3: {
    backgroundColor: 'gray',
 

    padding: 0,

    alignItems: 'stretch',
    justifyContent: 'center',
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  item3_1: {
    backgroundColor: 'white',
  
    padding: 10,

    flexDirection: 'column',
  },
  box: {
    backgroundColor: '#f9c2ff',
    padding: 0,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    flex: 0.5,
  },
});

export default HistoryTaskList;
