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
  RefreshControl,
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

import {Button, ThemeProvider, Avatar, ListItem} from 'react-native-elements';
import {
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

function Item({data, navigation}) {
  var caseName = data.DespatchDetails[0].CaseUser.Name;
  var startTime = data.DespatchDetails[0].Despatch.StartDate;
  var startDate = data.DespatchDetails[0].Despatch.StartDate;
  var pos = startTime.indexOf('T');
  if (pos != -1) {
    startDate = startTime.substring(0, pos);
    startTime = startTime.substring(pos + 1, pos + 6);
  }
  var canShared = data.DespatchDetails[0].OrderDetails.CanShared
    ? '可以共乘'
    : '不可共乘';
  var FamilyWith = data.DespatchDetails[0].OrderDetails.FamilyWith;
  var ForeignFamilyWith =
    data.DespatchDetails[0].OrderDetails.ForeignFamilyWith;
  var FromAddr = data.DespatchDetails[0].OrderDetails.FromAddr;
  var ToAddr = data.DespatchDetails[0].OrderDetails.ToAddr;
  var startOrNot = data.DespatchDetails.every(function(item, index, array){
    return item.OrderDetails.Status <= 1;
  });
   console.log("startOrNot",startOrNot);
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        navigation.navigate('TodayTaskOpen', {
          caseName: data.DespatchDetails[0].CaseUser.Name,
          data: data,
          startTime: startTime,
          startDate: startDate,
        })
      }>
      <View
        style={{
          margin: '5%',
          paddingBottom: 20,
          width: '95%',
          alignSelf: 'center',
          backgroundColor: 'white',
        }}
        elevation={5}>
        <View style={styles.titleBox}>
          <View style={styles.titleTime}>
            <View style={styles.titleLeft}>
              <Text
                style={{color: 'white', fontSize: 20}}
                allowFontScaling={false}>
                {startTime}
              </Text>
            </View>
            <View style={styles.titleDate}>
              <Text
                style={{color: 'white', fontSize: 20}}
                allowFontScaling={false}>
                {startDate}
              </Text>
              <Text
                style={{color: 'white', fontSize: 20}}
                allowFontScaling={false}>
                {canShared}
              </Text>
            </View>
          </View>
          <View style={styles.titleName}>
            <View style={{flexDirection: 'row'}}>
              <Avatar
                size="large"
                containerStyle={{margin: 10}}
                rounded
                source={{
                  uri: `${data.DespatchDetails[0].OrderDetails.CaseUserPic}`,
                }}
              />
              <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {data.DespatchDetails[0].OrderDetails.SOrderNo}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 24}}>
                  {'個案' + data.DespatchDetails.length + '/' + '陪同' + 0}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={startOrNot?{display:'none'}:{color: 'red', fontSize: 30,alignSelf:'flex-end',fontWeight:'bold'}}>
                  執行中
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.addr}>
          <Icon
            name="circle-o"
            size={30}
            color="orange"
            style={{paddingLeft: 30}}
          />
          <Text allowFontScaling={false} style={styles.addrText}>
            {data.DespatchDetails[0].OrderDetails.FromAddr}
          </Text>
        </View>
        <View style={styles.addr}>
          <Icon
            name="angle-double-down"
            size={30}
            color="orange"
            style={{paddingLeft: 32}}
          />
        </View>
        <View style={styles.addr}>
          <Icon
            name="circle-o"
            size={30}
            color="orange"
            style={{paddingLeft: 30}}
          />
          <Text allowFontScaling={false} style={styles.addrText}>
            {data.DespatchDetails[0].OrderDetails.ToAddr}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const TodayTaskList = props => {
  const [data, setdata] = useState({});
  const [isRefreshing, setisRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [url, seturl] = useState();
  const [userLoginInfo, setuserLoginInfo] = useState();

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        setuserLoginInfo(obj_value);
        var url2 =
          'https://api.donkeymove.com/api/DriverInfo/GetAllGroupDriverSide/' +
          obj_value.response.Cars.DriverId;
        //let url = `https://api.donkeymove.com/api/DriverInfo/GetAllGroup/${obj_value.Cars.DriverId}`;
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
          .catch(err =>
            Alert.alert('網路異常，請稍後再試...', ' ', [
              {
                text: '確定',
                onPress: () => {},
              },
            ]),
          );
      }
    } catch (error) {
      console.log('cannot get ITEM');
      // Error retrieving data
    }
  }

  async function fetchData_test() {
    const data = await fetch(
      'https://api.donkeymove.com/api/DriverInfo/GetAllPassGroup/15',
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
      .catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
  }

  async function _onRefresh() {
    setisRefreshing(true);
    fetchData().then(() => {
      setLoading(false);
      setisRefreshing(false);
    });
  }

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
    console.log('TASKS screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  } else {
    const list = data.response;
    console.log(list.length);
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ACB3EC',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 24, padding: 10, fontWeight: 'bold'}}>
            {userLoginInfo.response.Cars.CarNo +
              ' | ' +
              userLoginInfo.response.DriverName}
          </Text>

          <Button
            title="打卡"
            titleStyle={{
              fontSize: 20,
              fontWeight: 'bold',
              paddingHorizontal: 20,
              padding: 0,
              margin: 0,
            }}
            buttonStyle={{
              alignSelf: 'center',
              backgroundColor: 'orange',
              borderRadius: 50,
              padding: 5,
              marginEnd: 10,
            }}
            type="solid"
            onPress={() => {
              props.navigation.navigate('HitCard');
            }}
          />
        </View>
        <FlatList
          data={list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={_onRefresh}
              tintColor="#ff0000"
              title="Loading..."
              size="large"
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
          renderItem={({item}) => (
            <Item
              title={item.DespatchDetails[0].CaseUser.Name}
              data={item}
              navigation={props.navigation}
            />
          )}
          keyExtractor={item => item.DespatchId}
        />
        <Text
          style={
            list.length === 0
              ? {
                  flex: 20,
                  alignSelf: 'center',
                  fontSize: 36,
                  fontWeight: 'bold',
                }
              : {display: 'none'}
          }>
          尚無任務
        </Text>
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
  map: {
    ...StyleSheet.absoluteFillObject,
    padding: 0,
    margin: 0,
  },
  addr: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  addrText: {
    fontSize: 20,
    paddingLeft: 20,
    flexWrap: 'wrap',
    width:'80%'
  },
  addr2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addrText2: {
    fontSize: 18,
    paddingLeft: 15,
    flexWrap: 'wrap',
  },
  titleBox: {
    backgroundColor: 'black',
  },
  titleTime: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  titleLeft: {
    margin: 0,
    padding: 0,
    flex: 1,
  },
  titleDate: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
    flex: 1,
  },
  titleName: {
    justifyContent: 'center',
    backgroundColor: 'orange',
    padding: 10,
  },
  titleNameText: {
    fontSize: 30,
    lineHeight: 50,
    color: 'white',
    fontWeight: 'bold',
  },
  titleNameText2: {
    fontSize: 15,
    lineHeight: 15,
    color: 'white',
  },
  titleRight: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 10,
  },
  predict: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default TodayTaskList;