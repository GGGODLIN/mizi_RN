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
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
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
import {
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const TodayTaskOpen = props => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM';
  const [data, setdata] = useState({});
  const [finish, setfinish] = useState(false);
  const [doneCase, setdoneCase] = useState(
    props.route.params.data.DespatchDetails.map((e, index) => {
      return e.OrderDetails.Status >= 6 ? index : null;
    }),
  );
  const [ps, setps] = useState(' ');
  const [picPath, setpicPath] = useState(
    '/storage/emulated/0/saved_signature/signature.png',
  );
  const [picPathOnServer, setpicPathOnServer] = useState();
  const [money, setmoney] = useState('0');
  const [realMoney, setrealMoney] = useState('0');
  const [cashSteps, setcashSteps] = useState(0);
  const [detailIndex, setdetailIndex] = useState(0);
  const [askingMoney, setaskingMoney] = useState(false);
  const [bTemperature, setbTemperature] = useState(0);

  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);
  const [overlay, setoverlay] = useState(true);
  const [BToverlay, setBToverlay] = useState(false);
  const [delayForMap, setdelayForMap] = useState(false);
  const [fixbottom, setfixbottom] = useState(-1);

  const taskData = props.route.params.data.DespatchDetails.map(e => e);
  const caseNames = props.route.params.data.DespatchDetails.map(
    e => e.OrderDetails.CaseUserName,
  );
  const [caseStatus, setcaseStatus] = useState(
    props.route.params.data.DespatchDetails.map(e => e.OrderDetails.Status),
  );
  console.log('STATUS', caseStatus);
  console.log('Done', doneCase);
  console.log('index', detailIndex);
  const [people, setpeople] = useState(
    taskData[detailIndex].OrderDetails.FamilyWith +
      taskData[detailIndex].OrderDetails.ForeignFamilyWith,
  );
  const [familyPeople, setfamilyPeople] = useState(
    taskData[detailIndex].OrderDetails.FamilyWith,
  );
  const [foreignPeople, setforeignPeople] = useState(
    taskData[detailIndex].OrderDetails.ForeignFamilyWith,
  );
  console.log(
    '陪同',
    taskData[detailIndex].OrderDetails.FamilyWith +
      taskData[detailIndex].OrderDetails.ForeignFamilyWith,
  );

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

  const [latitudeDelta, setlatitudeDelta] = useState(
    Math.abs(
      taskData[detailIndex].OrderDetails.FromLat -
        taskData[detailIndex].OrderDetails.ToLat,
    ) * 2.2,
  );
  const [longitudeDelta, setlongitudeDelta] = useState(
    Math.abs(
      taskData[detailIndex].OrderDetails.FromLon -
        taskData[detailIndex].OrderDetails.ToLon,
    ) * 2.2,
  );

  const handleNextStep = async () => {
    let tempStatus = caseStatus;
    tempStatus[detailIndex] = caseStatus[detailIndex] + 1;
    setcaseStatus(tempStatus);
    setpeople(
      taskData[detailIndex].OrderDetails.FamilyWith +
        taskData[detailIndex].OrderDetails.ForeignFamilyWith,
    );
    setfamilyPeople(taskData[detailIndex].OrderDetails.FamilyWith);
    setforeignPeople(taskData[detailIndex].OrderDetails.ForeignFamilyWith);
    if (tempStatus[detailIndex] == 6) {
      updateStatusToSix();
      setoverlay(true);
      setLoading(true);
      setdelayForMap(true);
    } else {
      updateStatus();
      setoverlay(true);
      setLoading(true);
      if (tempStatus[detailIndex] == 3) {
        Alert.alert(' ', '請與個案核對身分及目的地，若有問題請聯繫行控中心', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]);
      }
    }
  };

  const handleMiss = async () => {
    let tempStatus = caseStatus;
    tempStatus[detailIndex] = 10;
    setcaseStatus(tempStatus);

    setcashSteps(0);
    setdoneCase(detailIndex);
    updateStatus();
    await checkDone();
    setoverlay(true);
    setLoading(true);
  };

  const handleChangeIndex = async index => {
    setdetailIndex(index);
    setpeople(
      taskData[index].OrderDetails.FamilyWith +
        taskData[index].OrderDetails.ForeignFamilyWith,
    );
    setfamilyPeople(taskData[index].OrderDetails.FamilyWith);
    setforeignPeople(taskData[index].OrderDetails.ForeignFamilyWith);
  };

  const handleCashNext = async () => {
    setLoading(true);
    const res = await askCash();
    setmoney(res.response);
    if (cashSteps == 0) {
      setrealMoney(res.response);
    }
    setcashSteps(cashSteps + 1);
  };

  const handleCashPrev = async () => {
    setcashSteps(0);
  };

  const askCash = async () => {
    setaskingMoney(true);
    let url = `http://www.e9life.com/api/OrderDetails/PutDetailRealWith?OrderDetailId=${
      taskData[detailIndex].OrderDetails.Id
    }&RealFamily=${familyPeople}&RealForeign=${foreignPeople}`;

    console.log(`Making Cash request to: ${url}`);
    const data = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        setmoney(res.response);
        if (cashSteps == 0) {
          setrealMoney(res.response);
          setLoading(false);
        }
        console.log('updateStatus AJAX', res);
        setaskingMoney(false);
        return res;
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
    return data;
  };

  const postPic = async props => {
    let urii = `file://${props}`;
    console.log('SETPATH?????????', urii);
    console.log('PICPATH?????????', props);
    let form = new FormData();
    form.append('image', {
      uri: urii,
      type: 'image/jpg',
      name: `${taskData[detailIndex].OrderDetails.SOrderNo}.jpg`,
      filename: `${taskData[detailIndex].OrderDetails.SOrderNo}.jpg`,
    });
    let url = `http://www.e9life.com/api/Img/Pic`;

    console.log(`Making POST PIC request to: ${url}`);
    console.log(form);

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
        setpicPathOnServer(res.response);
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
    let url = `http://www.e9life.com/api/OrderDetails/PutDetailStatus?OrderDetailId=${
      taskData[detailIndex].OrderDetails.Id
    }&StatusInt=${caseStatus[detailIndex]}`;

    if (caseStatus[detailIndex] == 4) {
      url += `&bTemperature=${bTemperature}`;
    }

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
        setbTemperature(0);
      })
      .catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
  };

  const updateStatusToSix = async () => {
    console.log('???????', taskData[detailIndex].OrderDetails.SOrderNo);
    let url = `http://www.e9life.com/api/OrderDetails/PutDetailStatus?OrderDetailId=${
      taskData[detailIndex].OrderDetails.Id
    }&StatusInt=${caseStatus[detailIndex]}&receiveAmt=${realMoney}&signPic=${
      taskData[detailIndex].OrderDetails.SOrderNo
    }.png&remark=${ps}`;

    console.log(`Making Status6 request to: ${url}`);

    const data = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('updateStatus AJAX', res);
      })
      .catch(err =>
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
    //await postPic(res.pathName);
    setdoneCase(detailIndex);
    handleNextStep();
    await checkDone();
  };

  const checkDone = async () => {
    setLoading(true);
    setdetailIndex(0);
    await caseStatus.forEach(async (item, index, array) => {
      if (item < 6) {
        console.log('INDEX????', index);
        console.log('DONE????????', doneCase, doneCase.length);

        if (caseStatus[0] >= 6) {
          setdetailIndex(index);
          setpeople(
            taskData[index].OrderDetails.FamilyWith +
              taskData[index].OrderDetails.ForeignFamilyWith,
          );
          setfamilyPeople(
            taskData[index].OrderDetails.FamilyWith 
          );
          setforeignPeople(taskData[index].OrderDetails.ForeignFamilyWith);
          setlongitudeDelta(
            Math.abs(
              taskData[index].OrderDetails.FromLon -
                taskData[index].OrderDetails.ToLon,
            ) * 2.2,
          );
          setlatitudeDelta(
            Math.abs(
              taskData[index].OrderDetails.FromLat -
                taskData[index].OrderDetails.ToLat,
            ) * 2.2,
          );
        }
      } else {
        let temp = doneCase;
        temp[index] = index;
        await setdoneCase(temp);
        console.log('done!!!!!!', doneCase, doneCase.length);
      }
    });
    setfinish(
      doneCase.every((item, index, array) => {
        return item != null;
      }),
    );
    console.log('FINISHED???????????????????', finish);
    setLoading(true);
  };

  useEffect(() => {
    checkDone();
    console.log('CHECKDONE????!?!?!?!?!?');
  }, []);

  if (isLoading || finish) {
    if (finish) {
      console.log('info screen is FINISH...');
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            resizeMode="center"
            style={{flex: 1}}
            source={require('./img/Frame_1.png')}
          />
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
            onPress={() => props.navigation.navigate('TodayTaskList')}>
            {'開啟下一趟任務'}
          </Button>
        </View>
      );
    } else if (delayForMap) {
      setTimeout(() => {
        setLoading(false);
        setdelayForMap(false);
      }, 1);

      console.log('info screen is loading...');
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      );
    } else {
      setLoading(false);
      setdelayForMap(false);

      console.log('info screen is loading...22222222');
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      );
    }
  } else {
    console.log('DELTA', latitudeDelta, longitudeDelta);
    return (
      <ScrollView style={{flex: 1}}>
        <Overlay
          isVisible={caseStatus[detailIndex] == 3 && overlay ? false : false}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="white"
          width="auto"
          height="auto">
          <View style={{margin: 0, padding: 0}}>
            <Text
              style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 20}}>
              核對身分
            </Text>
            <Divider />
            <View
              style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <Avatar
                size="large"
                rounded
                source={{
                  uri: `${taskData[detailIndex].OrderDetails.CaseUserPic}`,
                }}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  marginStart: 20,
                  fontSize: 25,
                  fontWeight: 'bold',
                }}>
                {taskData[detailIndex].OrderDetails.CaseUserName}
              </Text>
            </View>
            <View style={styles.addr2}>
              <Icon
                name="circle-o"
                size={30}
                color="orange"
                style={{paddingLeft: 10}}
              />
              <Text style={styles.addrText2}>
                {`<${taskData[detailIndex].OrderDetails.FromAddrRemark}>
${taskData[detailIndex].OrderDetails.FromAddr}`}
              </Text>
            </View>
            <View style={styles.addr2}>
              <Icon
                name="angle-double-down"
                size={30}
                color="orange"
                style={{paddingLeft: 12}}
              />
            </View>
            <View style={styles.addr2}>
              <Icon
                name="circle-o"
                size={30}
                color="orange"
                style={{paddingLeft: 10}}
              />
              <Text style={styles.addrText2}>
                {`<${taskData[detailIndex].OrderDetails.ToAddrRemark}>
${taskData[detailIndex].OrderDetails.ToAddr}`}
              </Text>
            </View>
          </View>
          <Button
            onPress={() => setoverlay(false)}
            color="orange"
            mode="contained"
            labelStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
            style={{marginBottom: 10}}>
            確認身分及目的地無誤
          </Button>
          <Button
            onPress={() => setoverlay(false)}
            color="black"
            mode="contained"
            labelStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
            style={{marginBottom: 10}}>
            身分不符
          </Button>
          <Button
            onPress={() => setoverlay(false)}
            color="black"
            mode="contained"
            labelStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
            style={{marginBottom: 10}}>
            更換地點
          </Button>
        </Overlay>

        <Overlay
          isVisible={cashSteps == 2 ? true : false}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="white"
          width="90%"
          height="80%">
          <RNSignatureExample
            handleSavePic={handleSavePic}
            name={taskData[detailIndex].OrderDetails.SOrderNo}
          />
        </Overlay>

        <Overlay
          onBackdropPress={() => setBToverlay(false)}
          isVisible={BToverlay && caseStatus[detailIndex] === 3}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="white"
          width="90%"
          height="auto">
          <Text
            style={{
              backgroundColor: 'orange',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              padding: 10,
              marginBottom: 10,
            }}>
            {`請選擇 ${taskData[detailIndex].OrderDetails.CaseUserName} 的體溫`}
          </Text>

          <Picker
            enabled={true}
            selectedValue={bTemperature}
            onValueChange={(itemValue, itemIndex) =>
              setbTemperature(itemValue)
            }>
            <Picker.Item label="未量測" value={0} />
            <Picker.Item label="35.0" value={35.0} />
            <Picker.Item label="35.1" value={35.1} />
            <Picker.Item label="35.2" value={35.2} />
            <Picker.Item label="35.3" value={35.3} />
            <Picker.Item label="35.4" value={35.4} />
            <Picker.Item label="35.5" value={35.5} />
            <Picker.Item label="35.6" value={35.6} />
            <Picker.Item label="35.7" value={35.7} />
            <Picker.Item label="35.8" value={35.8} />
            <Picker.Item label="35.9" value={35.9} />
            <Picker.Item label="36.0" value={36.0} />
            <Picker.Item label="36.1" value={36.1} />
            <Picker.Item label="36.2" value={36.2} />
            <Picker.Item label="36.3" value={36.3} />
            <Picker.Item label="36.4" value={36.4} />
            <Picker.Item label="36.5" value={36.5} />
            <Picker.Item label="36.6" value={36.6} />
            <Picker.Item label="36.7" value={36.7} />
            <Picker.Item label="36.8" value={36.8} />
            <Picker.Item label="36.9" value={36.9} />
            <Picker.Item label="37.0" value={37.0} />
            <Picker.Item label="37.1" value={37.1} />
            <Picker.Item label="37.2" value={37.2} />
            <Picker.Item label="37.3" value={37.3} />
            <Picker.Item label="37.4" value={37.4} />
            <Picker.Item label="37.5" value={37.5} />
            <Picker.Item label="37.6" value={37.6} />
            <Picker.Item label="37.7" value={37.7} />
            <Picker.Item label="37.8" value={37.8} />
            <Picker.Item label="37.9" value={37.9} />
            <Picker.Item label="38.0" value={38.0} />
          </Picker>

          <Button
            onPress={() => {
              handleNextStep();
              setBToverlay(false);
            }}
            color="orange"
            disabled={false}
            mode="contained"
            labelStyle={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            }}
            style={{marginBottom: 10,marginTop:60}}>
            確認送出
          </Button>
        </Overlay>

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
                {'個案' +
                  1 +
                  '/' +
                  '陪同' +
                  (taskData[detailIndex].OrderDetails.FamilyWith +
                    taskData[detailIndex].OrderDetails.ForeignFamilyWith)}
              </Text>
            </View>
          </View>
          <View
            style={
              caseStatus[detailIndex] >= 5 ? {display: 'none'} : styles.predict
            }>
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
            style={
              caseStatus[detailIndex] >= 5
                ? {height: 0.1, position: 'relative'}
                : {height: 250, position: 'relative', backgroundColor: 'pink'}
            }
            contentContainerStyle={StyleSheet.absoluteFillObject}>
            <MapView
              style={[styles.map, {bottom: fixbottom}]}
              onKmlReady={e => console.log('HAHA', e.nativeEvent)}
              region={{
                latitude: taskData[detailIndex].OrderDetails.FromLat,
                longitude: taskData[detailIndex].OrderDetails.FromLon,
                latitudeDelta: latitudeDelta * 1.1,
                longitudeDelta: longitudeDelta * 1.1,
              }}>
              <Marker
                coordinate={{
                  latitude: taskData[detailIndex].OrderDetails.FromLat,
                  longitude: taskData[detailIndex].OrderDetails.FromLon,
                }}
                icon="write"
                pinColor="blue"
                onPress={() => setfixbottom(0)}
                title={taskData[detailIndex].OrderDetails.FromAddr}
              />
              <Marker
                coordinate={{
                  latitude: taskData[detailIndex].OrderDetails.ToLat,
                  longitude: taskData[detailIndex].OrderDetails.ToLon,
                }}
                icon="write"
                onPress={() => setfixbottom(0)}
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
                strokeWidth={5}
                strokeColor="#6495ED"
                lineCap="round"
                lineJoin="bevel"
              />
            </MapView>
          </View>
          <ButtonGroup
            onPress={handleChangeIndex}
            selectedIndex={detailIndex}
            disabled={doneCase}
            buttons={caseNames}
            containerStyle={
              caseStatus[detailIndex] >= 5
                ? {display: 'none'}
                : {
                    margin: 0,
                    padding: 0,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    alignSelf: 'flex-start',
                  }
            }
            buttonStyle={{margin: 0, padding: 0, alignItems: 'center'}}
            textStyle={{margin: 0, padding: 0}}
          />
          <View
            style={
              caseStatus[detailIndex] >= 5 ? {display: 'none'} : styles.addr
            }>
            <Icon
              name="circle-o"
              size={30}
              color="orange"
              style={{paddingLeft: 30}}
            />
            <Text style={styles.addrText}>
              {`<${taskData[detailIndex].OrderDetails.FromAddrRemark}>
${taskData[detailIndex].OrderDetails.FromAddr}`}
            </Text>
          </View>
          <View
            style={
              caseStatus[detailIndex] >= 5 ? {display: 'none'} : styles.addr
            }>
            <Icon
              name="angle-double-down"
              size={30}
              color="orange"
              style={{paddingLeft: 32}}
            />
          </View>
          <View
            style={
              caseStatus[detailIndex] >= 5 ? {display: 'none'} : styles.addr
            }>
            <Icon
              name="circle-o"
              size={30}
              color="orange"
              style={{paddingLeft: 30}}
            />
            <Text style={styles.addrText}>
              {`<${taskData[detailIndex].OrderDetails.ToAddrRemark}>
${taskData[detailIndex].OrderDetails.ToAddr}`}
            </Text>
          </View>
          <Button
            style={
              caseStatus[detailIndex] < 5
                ? {
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 50,
                    backgroundColor: 'orange',
                    margin: 10,
                  }
                : {display: 'none'}
            }
            labelStyle={{color: 'white', fontSize: 20}}
            contentStyle={{width: '100%', paddingHorizontal: 50}}
            mode="outlined"
            onPress={() => {
              if (caseStatus[detailIndex] >= 4) {
                Alert.alert('確定客下?', ' ', [
                  {
                    text: '取消',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: '確定',
                    onPress: () => {
                      handleNextStep();
                    },
                  },
                ]);
              } else if (caseStatus[detailIndex] === 3) {
                setBToverlay(true);
                console.log("NOOOOOOO~~~~~~");

                //handleNextStep(0, index);
              } else {
                handleNextStep();
              }
            }}>
            {caseStatus[detailIndex] == 1
              ? '出發前往'
              : caseStatus[detailIndex] == 2
              ? '抵達上車地點'
              : caseStatus[detailIndex] == 3
              ? '客上'
              : '客下'}
          </Button>
          <View
            style={
              caseStatus[detailIndex] >= 5
                ? {display: 'none'}
                : {width: '80%', alignItems: 'flex-start', alignSelf: 'center'}
            }>
            <Text style={{fontSize: 20}}>{`備註:${
              taskData[detailIndex].CaseUser.Remark
            }`}</Text>
          </View>
          <Button
            style={
              caseStatus[detailIndex] == 3
                ? {
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 50,
                    backgroundColor: 'gray',
                    margin: 10,
                  }
                : {display: 'none'}
            }
            labelStyle={{color: 'white', fontSize: 20}}
            contentStyle={{width: '100%', paddingHorizontal: 50}}
            mode="outlined"
            onPress={() => {
              Alert.alert('確定空趟?', ' ', [
                {
                  text: '取消',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: '確定',
                  onPress: () => {
                    handleMiss();
                  },
                },
              ]);
            }}>
            {'空趟'}
          </Button>
          <View
            style={
              caseStatus[detailIndex] == 5
                ? {flexDirection: 'row', alignItems: 'center'}
                : {display: 'none'}
            }>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                paddingStart: 30,
                flex: 1,
              }}>
              陪同外籍:
            </Text>
            <Picker
              enabled={cashSteps == 0 && !askingMoney ? true : false}
              selectedValue={foreignPeople}
              style={{flex: 1}}
              onValueChange={(itemValue, itemIndex) => setforeignPeople(itemValue)}>
              <Picker.Item label="0人" value={0} />
              <Picker.Item label="1人" value={1} />
              <Picker.Item label="2人" value={2} />
              <Picker.Item label="3人" value={3} />
              <Picker.Item label="4人" value={4} />
              <Picker.Item label="5人" value={5} />
              <Picker.Item label="6人" value={6} />
              <Picker.Item label="7人" value={7} />
            </Picker>
          </View>
          <View
            style={
              caseStatus[detailIndex] == 5
                ? {flexDirection: 'row', alignItems: 'center'}
                : {display: 'none'}
            }>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                paddingStart: 30,
                flex: 1,
              }}>
              陪同家屬:
            </Text>
            <Picker
              enabled={cashSteps == 0 && !askingMoney ? true : false}
              selectedValue={familyPeople}
              style={{flex: 1}}
              onValueChange={(itemValue, itemIndex) => setfamilyPeople(itemValue)}>
              <Picker.Item label="0人" value={0} />
              <Picker.Item label="1人" value={1} />
              <Picker.Item label="2人" value={2} />
              <Picker.Item label="3人" value={3} />
              <Picker.Item label="4人" value={4} />
              <Picker.Item label="5人" value={5} />
              <Picker.Item label="6人" value={6} />
              <Picker.Item label="7人" value={7} />
            </Picker>
          </View>
          <View
            style={
              cashSteps == 1
                ? {flexDirection: 'row', alignItems: 'center'}
                : {display: 'none'}
            }>
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
              {money}
            </Text>
          </View>
          <View
            style={
              cashSteps == 1
                ? {flexDirection: 'row', alignItems: 'center'}
                : {display: 'none'}
            }>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginStart: 30,
                marginEnd: 99,
              }}>
              實收車資:
            </Text>
            <TextInput
              keyboardType="number-pad"
              defaultValue={realMoney}
              underlineColorAndroid="white"
              placeholderTextColor="orange"
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                width: '100%',
                color: 'orange',
              }}
              onEndEditing={input => {
                input.nativeEvent.text == ''
                  ? setrealMoney(money)
                  : setrealMoney(input.nativeEvent.text);
              }}
              clearTextOnFocus={true}
            />
          </View>
          <View style={cashSteps == 1 ? {} : {display: 'none'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginStart: 30,
                marginEnd: 99,
              }}>
              備註:
            </Text>
            <TextInput
              placeholder={'請輸入備註'}
              underlineColorAndroid="white"
              placeholderTextColor="gray"
              style={{fontSize: 20, width: '80%', alignSelf: 'center'}}
              onEndEditing={input => {
                setps(input.nativeEvent.text);
              }}
              clearTextOnFocus={true}
            />
          </View>
          <Button
            style={
              caseStatus[detailIndex] == 5
                ? {
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 50,
                    backgroundColor: 'orange',
                    margin: 10,
                  }
                : {display: 'none'}
            }
            labelStyle={{color: 'white', fontSize: 20}}
            contentStyle={{width: '100%', paddingHorizontal: 50}}
            mode="outlined"
            disabled={askingMoney}
            onPress={() => {
              if (cashSteps === 1) {
                Alert.alert('確定金額正確並送出?', ' ', [
                  {
                    text: '取消',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: '確定',
                    onPress: () => {
                      handleCashNext();
                    },
                  },
                ]);
              } else {
                handleCashNext();
              }
            }}>
            {cashSteps == 0
              ? askingMoney
                ? '金額計算中...'
                : '現金'
              : '確認收款'}
          </Button>
          <Button
            style={
              caseStatus[detailIndex] == 5 && cashSteps == 1
                ? {
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 50,
                    backgroundColor: 'orange',
                    margin: 10,
                  }
                : {display: 'none'}
            }
            labelStyle={{color: 'white', fontSize: 20}}
            contentStyle={{width: '100%', paddingHorizontal: 50}}
            mode="outlined"
            onPress={() => handleCashPrev()}>
            {'回上一步'}
          </Button>
        </View>
      </ScrollView>
    );
  }
};

export default TodayTaskOpen;

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
