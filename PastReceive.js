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

import {
  NavigationContainer,
  useFocusEffect,
  StackActions,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {ThemeProvider, Avatar} from 'react-native-elements';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

function Item({data, navigation}) {
  return (
    <View
      elevation={5}
      style={{
        width: '95%',
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderBottomWidth: 1,
          width: '95%',
        }}>
        <Text style={{flex: 2, paddingVertical: 10}}>日期</Text>
        <Text style={{flex: 1}}>{data.CreateDate.slice(0, 10)}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderBottomWidth: 1,
          width: '95%',
        }}>
        <Text style={{flex: 2, paddingVertical: 10}}>應收金額</Text>
        <Text style={{flex: 1}}>{data.ShouldReceiveAmt}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '95%',
        }}>
        <Text style={{flex: 2, paddingVertical: 10}}>實收金額</Text>
        <Text style={{flex: 1}}>{data.RealReceiveAmt}</Text>
      </View>
    </View>
  );
}

const PastReceive = props => {
  console.log('CHECK CAR?');
  const [user, setuser] = useState({});
  const [box, setbox] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);

  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [goPicked, setgoPicked] = useState(false);
  const [goPicked2, setgoPicked2] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    if (event.type === 'neutralButtonPressed') {
      setDate(new Date());
      setgoPicked(false);
    } else {
      setDate(currentDate);
      setgoPicked(true);
    }
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setShow2(false);
    if (event.type === 'neutralButtonPressed') {
      setDate2(new Date());
      setgoPicked2(false);
    } else {
      setDate2(currentDate);
      setgoPicked2(true);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };
  const showDatepicker2 = () => {
    setShow2(true);
  };
  async function fetchDataDate(sDate, eDate) {
    await setLoading(true);
    var url2 =
      'http://tccapi.1966.org.tw/api/DriverInfo/GetDriverReceiveListDate/' +
      user.response.Cars.DriverId +
      '?StartDate=' +
      sDate +
      '&EndDate=' +
      eDate;
    const data = await fetch(url2, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('TASK AJAX', res);
        setbox(res);
        setLoading(false);
      })
      .catch(err =>
        {console.log("????",err);
                Alert.alert('網路異常，請稍後再試...', ' ', [
                  {
                    text: '確定',
                    onPress: () => {},
                  },
                ]);}
              );
  }

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        console.log(obj_value);
        setuser(obj_value);

        var url3 =
          'http://tccapi.1966.org.tw/api/DriverInfo/GetDriverReceiveListDate/' +
          obj_value.response.Cars.DriverId +
          '?StartDate=' +
          '&EndDate=';

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
          .catch(err =>
            Alert.alert('網路異常，請稍後再試...', ' ', [
              {
                text: '確定',
                onPress: () => {
                  setLoading(false);
                },
              },
            ]),
          );

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
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  } else {
    const list = box.response;
    var nowDate = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`;
    var nowDate2 = `${date2.getFullYear()}-${date2.getMonth() +
      1}-${date2.getDate()}`;
    console.log(list);
    return (
      <SafeAreaView style={styles.container}>
        <View style={{width: '70%'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column'}}>
              <View>
                <Button
                  contentStyle={{width: '100%'}}
                  onPress={showDatepicker}
                  color="white"
                  mode="contained">
                  {goPicked ? nowDate : '選擇日期區間(起)'}
                </Button>
              </View>

              <View>
                <Button
                  onPress={showDatepicker2}
                  color="white"
                  mode="contained">
                  {goPicked2 ? nowDate2 : '選擇日期區間(迄)'}
                </Button>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => fetchDataDate(nowDate, nowDate2)}
              style={{
                marginStart: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              搜尋
            </Button>
          </View>
          {show ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
              neutralButtonLabel="清除"
            />
          ) : show2 ? (
            <DateTimePicker
              value={date2}
              mode="date"
              display="default"
              onChange={onChange2}
              neutralButtonLabel="清除"
            />
          ) : null}
        </View>
        <FlatList
          inverted
          data={list}
          renderItem={({item}) => (
            <Item data={item} navigation={props.navigation} />
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
  container: {},
});
