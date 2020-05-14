import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
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
import MapView, {PROVIDER_GOOGLE, Marker, Polyline,Callout,
  CalloutSubview,} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Picker} from '@react-native-community/picker';
import Signature from 'react-native-signature-canvas';
import SignatureCapture from 'react-native-signature-capture';
import RNSignatureExample from './Sign';

import {
  ThemeProvider,
  Avatar,
  ButtonGroup,
  Overlay,
  Input,
} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider,ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const HistoryTaskOpen = props => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM';
  const [data, setdata] = useState({});
  const [doneCase, setdoneCase] = useState(
    props.route.params.data.DespatchDetails.map((e, index) => {
      return e.OrderDetails.Status >= 6 ? index : null;
    }),
  );
  const [ps, setps] = useState(null);
  const [picPath, setpicPath] = useState(
    '/storage/emulated/0/saved_signature/signature.png',
  );
  const [money, setmoney] = useState('0');
  const [realMoney, setrealMoney] = useState('0');
  const [cashSteps, setcashSteps] = useState(0);
  const [foreignPeople, setforeignPeople] = useState(0);
  const [people, setpeople] = useState(0);
  const [detailIndex, setdetailIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);
  const [overlay, setoverlay] = useState(true);
  const taskData = props.route.params.data.DespatchDetails.map(e => e);
  const caseNames = props.route.params.data.DespatchDetails.map(
    e => e.OrderDetails.CaseUserName,
  );
  const [caseStatus, setcaseStatus] = useState(
    props.route.params.data.DespatchDetails.map(e => e.OrderDetails.Status),
  );
  console.log('STATUS', caseStatus);
  console.log('Done', doneCase);

  const origin = {
    latitude: taskData[detailIndex].OrderDetails.FromLat,
    longitude: taskData[detailIndex].OrderDetails.FromLon,
  };
  const destination = {
    latitude: taskData[detailIndex].OrderDetails.ToLat,
    longitude: taskData[detailIndex].OrderDetails.ToLon,
  };
  const region = {
    latitude: taskData[detailIndex].OrderDetails.FromLat,
    longitude: taskData[detailIndex].OrderDetails.FromLon,
    latitudeDelta:
      Math.abs(
        taskData[detailIndex].OrderDetails.FromLat -
          taskData[detailIndex].OrderDetails.ToLat,
      ) * 2.2,
    longitudeDelta:
      Math.abs(
        taskData[detailIndex].OrderDetails.FromLon -
          taskData[detailIndex].OrderDetails.ToLon,
      ) * 2.2,
  };

  const handleNextStep = async () => {
    let tempStatus = caseStatus;
    tempStatus[detailIndex] = caseStatus[detailIndex] + 1;
    setcaseStatus(tempStatus);
    updateStatus();
    setoverlay(true);
    setLoading(true);
  };

  const handleCashNext = async () => {
    const res = await askCash();
    setmoney(res.response);
    setrealMoney(res.response);
    setcashSteps(cashSteps + 1);
  };

  const handleCashPrev = async () => {
    setcashSteps(0);
  };

  const askCash = async () => {
    let url = `https://api.donkeymove.com/api/OrderDetails/PutDetailRealWith?OrderDetailId=${
      taskData[detailIndex].OrderDetails.Id
    }&RealFamily=${people}&RealForeign=${foreignPeople}`;

    console.log(`Making Cash request to: ${url}`);

    const data = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('updateStatus AJAX', res);
        return res;
      }).catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
    return data;
  };

  const postPic = async () => {
    let urii = `file://${picPath}`;
    console.log('PICPATH?????????', urii);
    let form = new FormData();
    form.append('image', {
      uri: 'file://${picPath}',
      type: 'image/jpg',
      name: 'signature.jpg',
      filename: 'signature.jpg',
    });
    let url = `https://api.donkeymove.com/api/Img/Pic`;

    console.log(`Making POST PIC request to: ${url}`);

    const data = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    })
      .then(response => response.json())
      .then(res => {
        console.log('postPic AJAX', res);
        return res;
      })
      .catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
    return data;
  };

  const updateStatus = async () => {
    let url = `https://api.donkeymove.com/api/OrderDetails/PutDetailStatus?OrderDetailId=${
      taskData[detailIndex].OrderDetails.Id
    }&StatusInt=${caseStatus[detailIndex]}`;

    console.log(`Making Status request to: ${url}`);

    const data = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('updateStatus AJAX', res);
      }).catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
  };

  const handleSavePic = async res => {
    console.log('RES????????????', res.pathName);
    setcashSteps(0);
    await setpicPath(res.pathName);
    console.log('SETPATH?????????', picPath);
    await postPic();
    setdoneCase(detailIndex);
    handleNextStep();
    checkDone();
  };

  const checkDone = async () => {
    caseStatus.forEach(async (item, index, array) => {
      if (item < 6) {
        console.log('INDEX???????????', index);
        console.log('DONE????????', doneCase);
        setdetailIndex(index);
      } else {
        let temp = doneCase;
        temp[index] = index;
        await setdoneCase(temp);
        console.log('done!!!!!!', doneCase);
      }
    });
  };

  useEffect(() => {
    checkDone();
  }, []);

  if (isLoading) {
    setLoading(false);
    console.log('info screen is loading...');
    
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} size='large' />
      </View>
    );
  } else {
    let withPeople = caseStatus[detailIndex]<6?taskData[detailIndex].OrderDetails.FamilyWith:taskData[detailIndex].OrderDetails.RealFamilyWith;
    return (
      <ScrollView style={{flex: 1}}>
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
                <Text style={{color: 'white', fontSize: 20}}>
                  {props.route.params.startTime}
                </Text>
              </View>
              <View style={styles.titleDate}>
                <Text style={{color: 'white', fontSize: 20}}>
                  {props.route.params.startDate}
                </Text>
                <Text style={{color: 'white', fontSize: 20}}>
                  {props.route.params.canShared}
                </Text>
              </View>
            </View>
            <View style={styles.titleName}>
              <Text style={styles.titleNameText}>
                {taskData[detailIndex].OrderDetails.CaseUserName}
              </Text>
              <Text style={styles.titleNameText2}>
                {taskData[detailIndex].OrderDetails.SOrderNo}
              </Text>
            </View>
            <View style={styles.titleRight}>
              <Text style={{color: 'white', fontSize: 20}}>
                {'個案' + 1 + '/' + '陪同' + withPeople}
              </Text>
            </View>
          </View>
          <View style={styles.predict}>
            <Text>預估里程</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              {taskData[detailIndex].OrderDetails.TotalMileage / 1000 + 'km'}
            </Text>
            <Divider />
            <Text>預估時間</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              {taskData[detailIndex].OrderDetails.ExpectedMinute + '分鐘'}
            </Text>
          </View>
          <View
            style={{height: 250, position: 'relative', backgroundColor: 'pink'}}
            contentContainerStyle={StyleSheet.absoluteFillObject}>
            <MapView
            provider="google"
              style={styles.map}
              onKmlReady={e => console.log('HAHA', e.nativeEvent)}
              initialRegion={{
                latitude: taskData[detailIndex].OrderDetails.FromLat,
                longitude: taskData[detailIndex].OrderDetails.FromLon,
                latitudeDelta:
                  Math.abs(
                    taskData[detailIndex].OrderDetails.FromLat -
                      taskData[detailIndex].OrderDetails.ToLat,
                  ) * 2.2,
                longitudeDelta:
                  Math.abs(
                    taskData[detailIndex].OrderDetails.FromLon -
                      taskData[detailIndex].OrderDetails.ToLon,
                  ) * 2.2,
              }}>
              <Marker
                coordinate={origin}
                icon="write"
                pinColor="blue"
                title={taskData[detailIndex].OrderDetails.FromAddr}
              />
              <Marker
                coordinate={destination}
                icon="write"
                title={taskData[detailIndex].OrderDetails.ToAddr}
              />

              <MapViewDirections
                origin={{
                  latitude: taskData[detailIndex].OrderDetails.FromLat,
                  longitude: taskData[detailIndex].OrderDetails.FromLon,
                }}
                destination={{
                  latitude: taskData[detailIndex].OrderDetails.ToLat,
                  longitude: taskData[detailIndex].OrderDetails.ToLon,
                }}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="#6495ED"
                lineCap="round"
                lineJoin="bevel"
              />
            </MapView>
          </View>
          <ButtonGroup
            onPress={setdetailIndex}
            selectedIndex={detailIndex}
            buttons={caseNames}
            containerStyle={{
              margin: 0,
              padding: 0,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              alignSelf: 'flex-start',
            }}
            buttonStyle={{margin: 0, padding: 0, alignItems: 'center'}}
            textStyle={{margin: 0, padding: 0}}
          />
          <View style={styles.addr}>
            <Icon
              name="circle-o"
              size={30}
              color="orange"
              style={{paddingLeft: 30}}
            />
            <Text style={styles.addrText}>
              {taskData[detailIndex].OrderDetails.FromAddr}
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
            <Text style={styles.addrText}>
              {taskData[detailIndex].OrderDetails.ToAddr}
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginStart: 30,
                marginEnd: 100,
              }}>
              應收車資:
            </Text>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: 'orange'}}>
              {caseStatus[detailIndex]===6? taskData[detailIndex].OrderDetails.RealTotalAmt : (taskData[detailIndex].OrderDetails.SelfPayAmt+taskData[detailIndex].OrderDetails.OtherAmt)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginStart: 30,
                marginEnd: 99,
              }}>
              實收車資:
            </Text>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: 'orange'}}>
              {taskData[detailIndex].OrderDetails.ReceivedAmt}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginStart: 30,
                marginEnd: 40,
              }}>
              備註:
            </Text>
            <Text style={{fontSize: 20, color: 'black', width: '50%'}}>
              {taskData[detailIndex].DespatchDetail.Remark==='null'?' ':taskData[detailIndex].DespatchDetail.Remark}
            </Text>
          </View>

          <Button
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              borderRadius: 50,
              backgroundColor: 'orange',
              margin: 10,
            }}
            labelStyle={{color: 'white', fontSize: 20}}
            contentStyle={{width: '100%', paddingHorizontal: 50}}
            mode="outlined"
            onPress={() => {
              props.navigation.navigate('HistoryTaskList');
            }}>
            {'返回任務列表'}
          </Button>
        </View>
      </ScrollView>
    );
  }
};

export default HistoryTaskOpen;

const styles = StyleSheet.create({
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
    fontSize: 20,
    paddingLeft: 20,
    flexWrap: 'wrap',
    marginEnd: 80,
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