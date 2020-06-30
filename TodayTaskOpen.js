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
import LaunchNavigator from 'react-native-launch-navigator';
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
import call from 'react-native-phone-call';

const TodayTaskOpen = props => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCUaMOOcU7-pH99LS6ajo_s1WkDua92H08';
  const [data, setdata] = useState({});
  const [finish, setfinish] = useState(false);

  const [ps, setps] = useState(' ');
  const [picPath, setpicPath] = useState(
    '/storage/emulated/0/saved_signature/signature.png',
  );
  const [picPathOnServer, setpicPathOnServer] = useState();
  const [money, setmoney] = useState('0');
  const [realMoney, setrealMoney] = useState('0');
  const [cashSteps, setcashSteps] = useState(0);
  const [foreignPeople, setforeignPeople] = useState(0);
  const [detailIndex, setdetailIndex] = useState(0);
  const [askingMoney, setaskingMoney] = useState(false);
  const [bTemperature, setbTemperature] = useState(36);

  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [delayForMap, setdelayForMap] = useState(false);
  const [fixbottom, setfixbottom] = useState(-1);

  let sortedArray = props.route.params.data.DespatchDetails.map(e => e);
  sortedArray.sort(function(a, b) {
    let nameA = a.OrderDetails.ReservationDate; // ignore upper and lowercase
    let nameB = b.OrderDetails.ReservationDate; // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  const [doneCase, setdoneCase] = useState(
    sortedArray.map((e, index) => {
      return e.OrderDetails.Status >= 6 ? index : null;
    }),
  );

  const taskData = sortedArray;

  const caseNames = sortedArray.map(e => e.OrderDetails.CaseUserName);
  const [caseStatus, setcaseStatus] = useState(
    sortedArray.map(e => e.OrderDetails.Status),
  );
  console.log('STATUS', caseStatus);
  console.log('Done', doneCase);
  console.log('index', detailIndex);
  const [people, setpeople] = useState(
    taskData[detailIndex].OrderDetails.FamilyWith +
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

  const handleNextStep = async (input, index) => {
    setoverlay(false);
    let tempStatus = caseStatus;
    tempStatus[index] = input === 6 ? 6 : caseStatus[index] + 1;
    setcaseStatus(tempStatus);
    setpeople(
      taskData[index].OrderDetails.FamilyWith +
        taskData[index].OrderDetails.ForeignFamilyWith,
    );
    if (tempStatus[index] == 6) {
      updateStatusToSix(index);
      setLoading(true);
    } else {
      updateStatus(index);
      setLoading(true);
      if (tempStatus[index] == 3) {
        Alert.alert(' ', '請與個案核對身分及目的地，若有問題請聯繫行控中心', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]);
      }
    }
  };

  const handleMiss = async (index, status) => {
    let tempStatus = caseStatus;
    tempStatus[index] = status;
    setcaseStatus(tempStatus);

    setdoneCase(index);
    updateStatus(index);
    await checkDone();
    setLoading(true);
  };

  const handleJa = async index => {
    let tempStatus = caseStatus;
    tempStatus[index] = 8;
    setcaseStatus(tempStatus);

    setdoneCase(index);
    updateStatus(index);
    await checkDone();
    setLoading(true);
  };

  const handleChangeIndex = async index => {
    setdetailIndex(index);
    setpeople(
      taskData[index].OrderDetails.FamilyWith +
        taskData[index].OrderDetails.ForeignFamilyWith,
    );
  };

  const handleCashNext = async index => {
    setLoading(true);
    const res = await askCash();
    setmoney(res.response);
    if (cashSteps == 0) {
      setrealMoney(res.response);
    }
    setcashSteps(cashSteps + 1);
  };

  const handleCashPrev = async index => {
    setcashSteps(0);
  };

  const askCash = async index => {
    setaskingMoney(true);
    let url = `http://slllcapi.1966.org.tw/api/OrderDetails/PutDetailRealWith?OrderDetailId=${
      taskData[detailIndex].OrderDetails.Id
    }&RealFamily=${people}`;

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
    let url = `http://slllcapi.1966.org.tw/api/Img/Pic`;

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

  const updateStatus = async index => {
    let url = `http://slllcapi.1966.org.tw/api/OrderDetails/PutDetailStatus?OrderDetailId=${
      taskData[index].OrderDetails.Id
    }&StatusInt=${caseStatus[index]}`;
    if (caseStatus[index] == 4) {
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

  const updateStatusToSix = async index => {
    let url2 = `http://slllcapi.1966.org.tw/api/OrderDetails/PutDetailStatus?OrderDetailId=${
      taskData[index].OrderDetails.Id
    }&StatusInt=5`;

    console.log(`Making Status request to: ${url2}`);

    const data2 = await fetch(url2, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response2 => response2.json())
      .then(res2 => {
        console.log('updateStatus5 AJAX', res2);
      })
      .then(async () => {
        console.log('???????', taskData[index].OrderDetails.SOrderNo);
        let url = `http://slllcapi.1966.org.tw/api/OrderDetails/PutDetailStatus?OrderDetailId=${
          taskData[index].OrderDetails.Id
        }&StatusInt=6&receiveAmt=0&signPic=${
          taskData[index].OrderDetails.SOrderNo
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
            console.log('updateStatus6 AJAX', res);
            setdoneCase(index);
            checkDone();
          })
          .catch(err =>
            Alert.alert('網路異常，請稍後再試...', ' ', [
              {
                text: '確定',
                onPress: () => {
                  console.log(err);
                },
              },
            ]),
          );
      })
      .catch(err2 =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {
              console.log(err2);
            },
          },
        ]),
      );
  };

  const updateStatusToEight = async index => {
    let url2 = `http://slllcapi.1966.org.tw/api/OrderDetails/PutDetailStatus?OrderDetailId=${
      taskData[index].OrderDetails.Id
    }&StatusInt=8`;

    console.log(`Making Status request to: ${url2}`);

    const data2 = await fetch(url2, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response2 => response2.json())
      .then(res2 => {
        console.log('updateStatus5 AJAX', res2);
      })
      .then(async () => {
        console.log('???????', taskData[index].OrderDetails.SOrderNo);
        let url = `http://slllcapi.1966.org.tw/api/OrderDetails/PutDetailStatus?OrderDetailId=${
          taskData[index].OrderDetails.Id
        }&StatusInt=6&receiveAmt=0&signPic=${
          taskData[index].OrderDetails.SOrderNo
        }.png&remark=個案取消`;

        console.log(`Making Status8 request to: ${url}`);

        const data = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log('updateStatus6 AJAX', res);
            setdoneCase(index);
            checkDone();
          })
          .catch(err =>
            Alert.alert('網路異常，請稍後再試...', ' ', [
              {
                text: '確定',
                onPress: () => {
                  console.log(err);
                },
              },
            ]),
          );
      })
      .catch(err2 =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {
              console.log(err2);
            },
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
          console.log(
            'with?????????',
            taskData[index].OrderDetails.FamilyWith +
              taskData[index].OrderDetails.ForeignFamilyWith,
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
      }, 0);

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
    return (
      <ScrollView style={{flex: 1}}>
        <Overlay
          onBackdropPress={() => setoverlay(false)}
          isVisible={overlay && caseStatus[detailIndex] === 3}
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
          </Picker>

          <Button
            onPress={() => {
              handleNextStep(0, detailIndex);
            }}
            color="orange"
            disabled={false}
            mode="contained"
            labelStyle={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            }}
            style={{marginBottom: 10}}>
            確認送出
          </Button>
        </Overlay>
        {taskData.map((item, index, array) => {
          let startTime = item.OrderDetails.ReservationDate;
          let startDate = item.OrderDetails.ReservationDate;
          let pos = startTime.indexOf('T');
          if (pos != -1) {
            startDate = startTime.substring(0, pos);
            startTime = startTime.substring(pos + 1, pos + 6);
          }
          return (
            <View
              style={
                caseStatus[index] >= 6
                  ? {display: 'none'}
                  : {
                      margin: '5%',
                      paddingBottom: 20,
                      width: '95%',
                      alignSelf: 'center',
                      backgroundColor: 'white',
                    }
              }
              elevation={5}>
              <View style={styles.titleBox}>
                <Avatar
                  size={100}
                  rounded
                  containerStyle={{margin: 10, alignSelf: 'center'}}
                  source={{
                    uri: `${item.OrderDetails.CaseUserPic}`,
                  }}
                />

                <View style={{flex: 2, alignSelf: 'center'}}>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        flexDirection: 'column',
                        flex: 2,
                        marginHorizontal: 10,
                      }}>
                      <Text style={styles.titleNameText}>{startTime}</Text>
                      <Text style={styles.titleNameText}>
                        {item.OrderDetails.CaseUserName}
                      </Text>
                    </View>
                    <Button
                      style={
                        caseStatus[index] == 3 || caseStatus[index] == 1
                          ? {
                              alignSelf: 'flex-start',
                              justifyContent: 'center',
                              alignContent: 'center',
                              borderRadius: 50,
                              backgroundColor: 'gray',
                              borderColor: 'white',
                              borderWidth: 1,
                              margin: 10,
                              flex: 1,
                            }
                          : {display: 'none'}
                      }
                      labelStyle={{color: 'white', fontSize: 15}}
                      mode="outlined"
                      onPress={() => {
                        let str =
                          caseStatus[index] == 1 ? '確定請假?' : '確定空趟?';
                        let status = caseStatus[index] == 1 ? 8 : 10;
                        Alert.alert(str, ' ', [
                          {
                            text: '取消',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: '確定',
                            onPress: () => {
                              handleMiss(index, status);
                            },
                          },
                        ]);
                      }}>
                      {caseStatus[index] == 1 ? '請假' : '空趟'}
                    </Button>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Button
                      style={{
                        alignSelf: 'flex-start',
                        justifyContent: 'center',
                        alignContent: 'center',
                        borderRadius: 50,
                        backgroundColor: '#669933',
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 10,
                        flex: 1,
                      }}
                      labelStyle={{color: 'white', fontSize: 20}}
                      containerStyle={{width: '100%'}}
                      mode="solid"
                      loading={caseStatus[index] >= 5 ? true : false}
                      onPress={() => {
                        if (caseStatus[index] >= 4) {
                          Alert.alert('確定客下?', ' ', [
                            {
                              text: '取消',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: '確定',
                              onPress: () => {
                                handleNextStep(6, index);
                              },
                            },
                          ]);
                        } else if (caseStatus[index] === 3) {
                          setoverlay(true);
                          setdetailIndex(index);
                          //handleNextStep(0, index);
                        } else {
                          handleNextStep(0, index);
                        }
                      }}>
                      {caseStatus[index] == 1
                        ? '出發'
                        : caseStatus[index] == 2
                        ? '抵達上車地點'
                        : caseStatus[index] == 3
                        ? '客上'
                        : caseStatus[index] == 4
                        ? '客下'
                        : '讀取中...'}
                    </Button>
                  </View>
                </View>
              </View>

              <View
                style={
                  caseStatus[index] >= 5 ? {display: 'none'} : styles.addr
                }>
                <Button
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    //marginStart: 10,
                  }}
                  contentStyle={{height: 40}}
                  mode="text"
                  onPress={() =>
                    call({
                      number: item.CompanyPhone, // String value with the number to call
                      prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
                    })
                  }>
                  {`聯絡電話: ${item.CompanyPhone}`}
                </Button>
              </View>

              <View
                style={
                  caseStatus[index] >= 4 ? {display: 'none'} : styles.addr
                }>
                <Button
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginStart: 10,
                  }}
                  contentStyle={{height: 60}}
                  mode="contained"
                  onPress={() => {
                    LaunchNavigator.navigate(item.OrderDetails.FromAddr)
                      .then(() => console.log('Launched navigator'))
                      .catch(err =>
                        console.error('Error launching navigator: ' + err),
                      );
                  }}>
                  {'導航'}
                </Button>
                <Text style={styles.addrText}>
                  {`<${item.OrderDetails.FromAddrRemark}>
${item.OrderDetails.FromAddr}`}
                </Text>
              </View>

              <View
                style={caseStatus[index] < 4 ? {display: 'none'} : styles.addr}>
                <Button
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginStart: 10,
                  }}
                  contentStyle={{height: 60}}
                  mode="contained"
                  onPress={() => {
                    LaunchNavigator.navigate(item.OrderDetails.ToAddr)
                      .then(() => console.log('Launched navigator'))
                      .catch(err =>
                        console.error('Error launching navigator: ' + err),
                      );
                  }}>
                  {'導航'}
                </Button>
                <Text style={styles.addrText}>
                  {`<${item.OrderDetails.ToAddrRemark}>
${item.OrderDetails.ToAddr}`}
                </Text>
              </View>

              <View
                style={
                  caseStatus[index] >= 5
                    ? {display: 'none'}
                    : {
                        width: '80%',
                        alignItems: 'flex-start',
                        alignSelf: 'center',
                      }
                }>
                <Text style={{fontSize: 20}}>{`備註:${
                  item.CaseUser.Remark
                }`}</Text>
              </View>

              <View style={{display: 'none'}}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginStart: 30,
                    marginEnd: 60,
                  }}>
                  陪同外籍:
                </Text>
                <Picker
                  enabled={cashSteps == 0 ? true : false}
                  selectedValue={foreignPeople}
                  style={{height: 50, width: 150}}
                  onValueChange={(itemValue, itemIndex) =>
                    setforeignPeople(itemValue)
                  }>
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
              <View style={{display: 'none'}}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    paddingStart: 30,
                    flex: 1,
                  }}>
                  陪同人數:
                </Text>
                <Picker
                  enabled={cashSteps == 0 && !askingMoney ? true : false}
                  selectedValue={people}
                  style={{flex: 1}}
                  onValueChange={(itemValue, itemIndex) =>
                    setpeople(itemValue)
                  }>
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
                <Text
                  style={{fontSize: 30, fontWeight: 'bold', color: 'orange'}}>
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
                style={{display: 'none'}}
                labelStyle={{color: 'white', fontSize: 20}}
                contentStyle={{width: '100%', paddingHorizontal: 50}}
                mode="outlined"
                disabled={askingMoney}
                onPress={() => handleCashNext()}>
                {cashSteps == 0
                  ? askingMoney
                    ? '金額計算中...'
                    : '現金'
                  : '確認收款'}
              </Button>
              <Button
                style={
                  caseStatus[index] == 5 && cashSteps == 1
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
          );
        })}
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
    backgroundColor: 'orange',
    flexDirection: 'row',
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
    alignContent: 'center',
    backgroundColor: 'orange',
    padding: 10,
    flex: 1,
  },
  titleNameText: {
    fontSize: 20,
    lineHeight: 30,
    color: 'white',
    fontWeight: 'bold',

    flex: 1,
  },
  titleNameText2: {
    fontSize: 20,
    lineHeight: 30,
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
