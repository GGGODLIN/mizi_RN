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

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {ThemeProvider, Avatar, ListItem} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider,ActivityIndicator} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

function Item({data, navigation}) {
  var caseName = data.DespatchDetails[0].CaseUser.Name;
  var startTime = data.DespatchDetails[0].Despatch.StartDate;
  var startDate = data.DespatchDetails[0].Despatch.StartDate;
  var pos = startTime.indexOf('T');
  if (pos != -1) {
    startDate = startTime.substring(0, pos);
    startTime = startTime.substring(pos + 1,pos+6);
  }
 var canShared = data.DespatchDetails.length>=2?'有共乘':'無共乘';
  var statusString =
    data.DespatchDetails[0].OrderDetails.Status == 0
      ? '新訂單'
      : data.DespatchDetails[0].OrderDetails.Status == 1
      ? '已排班'
      : data.DespatchDetails[0].OrderDetails.Status == 2
      ? '已出發'
      : data.DespatchDetails[0].OrderDetails.Status == 3
      ? '已抵達'
      : data.DespatchDetails[0].OrderDetails.Status == 4
      ? '客上'
      : data.DespatchDetails[0].OrderDetails.Status == 5
      ? '客下'
      : data.DespatchDetails[0].OrderDetails.Status == 6
      ? '已完成'
      : data.DespatchDetails[0].OrderDetails.Status == 7
      ? '未執行'
      : data.DespatchDetails[0].OrderDetails.Status == 8
      ? '個案取消'
      : data.DespatchDetails[0].OrderDetails.Status == 9
      ? '服務單位取消'
      : data.DespatchDetails[0].OrderDetails.Status == 10
      ? '空趟'
      : data.DespatchDetails[0].OrderDetails.Status == 11
      ? '無派車'
      : data.DespatchDetails[0].OrderDetails.Status == 12
      ? '服務單位取消-變更時間'
      : '可撥的Bug';
  var FamilyWith = data.DespatchDetails[0].OrderDetails.FamilyWith;
  var ForeignFamilyWith =
    data.DespatchDetails[0].OrderDetails.ForeignFamilyWith;
  var FromAddr = data.DespatchDetails[0].OrderDetails.FromAddr;
  var ToAddr = data.DespatchDetails[0].OrderDetails.ToAddr;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('HistoryTaskOpen', {
          caseName: data.DespatchDetails[0].CaseUser.Name,
          data: data,
          startTime: startTime,
          startDate: startDate,
          canShared:canShared,
        })
      }>
      <View
        style={{
          margin: '2%',
          width: '95%',
          alignSelf: 'center',
          backgroundColor: 'orange',
        }}>
        <View style={styles.titleBox}>
          <View style={styles.titleTime}>
            <View style={styles.titleLeft}>
              <Text style={{color: 'white', fontSize: 20}}>{startTime}</Text>
            </View>
            <View style={styles.titleDate}>
              <Text style={{color: 'white', fontSize: 20}}>{startDate}</Text>
              <Text
                style={{color: 'white', fontSize: 20,marginStart:20}}
                allowFontScaling={false}>
                {data.DespatchDetails.length>=2?'有共乘':'無共乘'}
              </Text>
            </View>
          </View>
          <View style={styles.titleName}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column', justifyContent: 'center',flex:1.2}}>
             
              {data.DespatchDetails.map((val, index)=>{
                return (
                  <Text
                style={{
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 'bold',
                  paddingEnd:10,
                }}>
                {val.CaseUser.Name}
              </Text>
                  );
              })}
              
              </View>
              <View style={{flexDirection: 'column', justifyContent: 'center',flex:2}}>
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  {data.DespatchDetails[0].OrderDetails.SOrderNo}
                </Text>
                <Divider
                  style={{width: 220, backgroundColor: 'white', height: 1}}
                />
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  {statusString}
                </Text>
                <Text style={styles.addrText}>
                  {data.DespatchDetails[0].OrderDetails.FromAddr}
                </Text>
                <Text style={styles.addrText}>
                  {data.DespatchDetails[0].OrderDetails.ToAddr}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const HistoryTaskList = props => {
  const [data, setdata] = useState({});
  const [user, setuser] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [url, seturl] = useState();

  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [goPicked, setgoPicked] = useState(false);
  const [goPicked2, setgoPicked2] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    if(event.type === 'neutralButtonPressed'){
      setDate(new Date());
      setgoPicked(false);
    }
    else{
      setDate(currentDate);
      setgoPicked(true);
    }
   
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setShow2(false);
    if(event.type === 'neutralButtonPressed'){
      setDate2(new Date());
      setgoPicked2(false);
    }
    else{
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

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        setuser(obj_value);
        console.log('GET FROM ASYN IS', obj_value);
        var url2 =
          'http://www.e9life.com/api/DriverInfo/GetAllPassGroup/' +
          obj_value.response.Id;
        seturl(
          `http://www.e9life.com/api/DriverInfo/GetAllPassGroup/${
            obj_value.response.Id
          }`,
        );
        //let url = `http://www.e9life.com/api/DriverInfo/GetAllGroup/${obj_value.Cars.DriverId}`;

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

  async function fetchDataDate(sDate,eDate) {
    await setLoading(true);
    var url2 =
      'http://www.e9life.com/api/DriverInfo/GetAllPassGroup/' +
      user.response.Id + '?sDate=' + sDate + '&eDate=' + eDate;

    const data = await fetch(
      url2,
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

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    console.log('TASKS screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} size='large' />
      </View>
    );
  } else {
    const list = data.response;
    var nowDate = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`;
    var nowDate2 = `${date2.getFullYear()}-${date2.getMonth() +
      1}-${date2.getDate()}`;
    console.log('DATE??????', nowDate);

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
              onPress={()=>fetchDataDate(nowDate,nowDate2)}
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
          data={list}
          renderItem={({item}) => (
            <Item
              title={item.DespatchDetails[0].CaseUser.Name}
              data={item}
              navigation={props.navigation}
            />
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
  map: {
    ...StyleSheet.absoluteFillObject,
    padding: 0,
    margin: 0,
  },
  addr: {
    flexDirection: 'row',

    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addrText: {
    width:'80%',
    fontSize: 15,
    color: 'white',
    paddingLeft: 0,
    marginTop:5,
    flexWrap: 'wrap',
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
  },
  predict: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default HistoryTaskList;
