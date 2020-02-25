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
import {Button, Card, Title, Paragraph, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const TodayTaskOpen = props => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCUaMOOcU7-pH99LS6ajo_s1WkDua92H08';
  const [data, setdata] = useState({});
  const [doneCase, setdoneCase] = useState(
    props.route.params.data.DespatchDetails.map((e, index) => {
      return e.OrderDetails.Status >= 6 ? index : null;
    }),
  );
  const [ps, setps] = useState(null);
  const [picPath, setpicPath] = useState("/storage/emulated/0/saved_signature/signature.png");
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
    let url = `http://wheathwaapi.vielife.com.tw/api/OrderDetails/PutDetailRealWith?OrderDetailId=${
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
      });
    return data;
  };

  const postPic = async () => {
    let urii= `file://${picPath}`
    console.log("PICPATH?????????",urii);
    let form = new FormData();
    form.append('image', {
      uri:urii,
      type:'image/jpg',
      name:'signature.jpg',
      filename:'signature.jpg',
    });
    let url = `http://wheathwaapi.vielife.com.tw/api/Img/Pic`;

    console.log(`Making POST PIC request to: ${url}`);
    console.log(form);

    const data = await fetch(url, {
      method: 'POST',
      headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
      body:form,
    })
      .then(response => response.json())
      .then(res => {
        console.log('postPic AJAX', res);
        return res;
      }).catch(err=>console.log("WTF",err));
    return data;
  };

  const updateStatus = async () => {
    let url = `http://wheathwaapi.vielife.com.tw/api/OrderDetails/PutDetailStatus?OrderDetailId=${
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
      });
  };

  const handleSavePic = async res => {
    console.log('RES????????????',res.pathName);
    setcashSteps(0);
    await setpicPath(res.pathName);
    console.log("SETPATH?????????",picPath);
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
        temp[index] = index ;
        await setdoneCase(temp);
        console.log("done!!!!!!",doneCase);
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
        <Text>LOADING.............</Text>
      </View>
    );
  } else {
    console.log('DONE????????', doneCase);
    return (
      <ScrollView style={{flex: 1}}>
      <Image source={{uri: 'file:///storage/emulated/0/saved_signature/signature.png',cache: 'only-if-cached',}} style={{height:100,width:100}} ></Image>
        <Overlay
          isVisible={caseStatus[detailIndex] == 3 && overlay ? true : false}
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
                {taskData[detailIndex].OrderDetails.FromAddr}
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
                {taskData[detailIndex].OrderDetails.ToAddr}
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
            disabled={true}
            mode="contained"
            labelStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
            style={{marginBottom: 10}}>
            身分不符
          </Button>
          <Button
            onPress={() => setoverlay(false)}
            color="black"
            disabled={true}
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
          <Text>HAHA</Text>
          <RNSignatureExample handleSavePic={handleSavePic} />
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
                  {taskData[detailIndex].OrderDetails.CanShared
                    ? ' 可共乘'
                    : ' 不可共乘'}
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
                {'個案' + 1 + '/' + '陪同' + (foreignPeople + people)}
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
                ? {height: 1, position: 'relative'}
                : {height: 250, position: 'relative', backgroundColor: 'pink'}
            }
            contentContainerStyle={StyleSheet.absoluteFillObject}>
            <MapView
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
              {taskData[detailIndex].OrderDetails.FromAddr}
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
              {taskData[detailIndex].OrderDetails.ToAddr}
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
            onPress={() => handleNextStep()}>
            {caseStatus[detailIndex] == 1
              ? '出發前往'
              : caseStatus[detailIndex] == 2
              ? '抵達上車地點'
              : caseStatus[detailIndex] == 3
              ? '客上'
              : '客下'}
          </Button>
          <Button
            style={
              caseStatus[detailIndex] == 3
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
            onPress={() => handleNextStep()}>
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
                marginStart: 30,
                marginEnd: 60,
              }}>
              陪同外籍:
            </Text>
            <Picker
              enabled={cashSteps == 0 ? true : false}
              selectedValue={foreignPeople}
              style={{height: 50, width: 100}}
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
                marginStart: 30,
                marginEnd: 60,
              }}>
              陪同家屬:
            </Text>
            <Picker
              enabled={cashSteps == 0 ? true : false}
              selectedValue={people}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue, itemIndex) => setpeople(itemValue)}>
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
              placeholder={realMoney}
              underlineColorAndroid="white"
              placeholderTextColor="orange"
              style={{fontSize: 30, fontWeight: 'bold', width: '100%'}}
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
              placeholder={'...'}
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
            onPress={() => handleCashNext()}>
            {cashSteps == 0 ? '現金' : '確認收款'}
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
