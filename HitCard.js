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
import {Picker} from '@react-native-community/picker';

import {ThemeProvider, Avatar, Button, Overlay} from 'react-native-elements';
import {Button as RPButton} from 'react-native-paper';
import {
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import FileUtil from './FileUtil';
import SignatureScreen from './SignatureScreen';

const HitCard = props => {
  console.log('HitCard?');
  const [data, setdata] = useState({});
  const [user, setuser] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isOn, setOn] = useState(false);
  const [isOff, setOff] = useState(false);
  const [shouldReceiveAmt, setshouldReceiveAmt] = useState(' 讀取中...');
  const [realReceiveAmt, setrealReceiveAmt] = useState(' 讀取中...');
  const [status, setstatus] = useState(1);
  const [overlay, setoverlay] = useState(false);
  const [bTemperature, setbTemperature] = useState(0);
  const [showOverlay, setshowOverlay] = useState(false);
  const [myIcon1, setmyIcon1] = useState();
  const [myIcon2, setmyIcon2] = useState();
  const [date, setDate] = useState(new Date());
  const [picPathOnServer, setpicPathOnServer] = useState();
  const [picPath, setpicPath] = useState(
    '/storage/emulated/0/saved_signature/signature.png',
  );

  async function fetchData() {
    const resFs = FileUtil.readDir1();
    console.log('FS???????????????????', resFs);
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        let obj_value = JSON.parse(value);
        setuser(obj_value);
        console.log('GET FROM ASYN IS', obj_value);
        let url2 =
          'http://tccapi.1966.org.tw/api/DriverInfo/GetAllPunchByDriver/' +
          obj_value.response.Id;

        const data = await fetch(url2, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log('TASK AJAX', res.response.OnTime !== null);
            setdata(res);
            setOn(res.response.OnTime !== null);
            setOff(res.response.OffTime !== null);

            if (res.response.OnTime === null){
              setstatus(1);
            } else if (res.response.OffTime === null){
              setstatus(2);
            } else if (res.response.DriverSign === null){
              setstatus(3);
            }else{
              setstatus(3);
            }

            /*if (res.response.DriverSign !== null) {
              setstatus(4);
            } else if (
              res.response.OnTime !== null &&
              res.response.OffTime !== null
            ) {
              setstatus(3);
            } else if (res.response.OnTime !== null) {
              setstatus(2);
            } else {
              setstatus(1);
            }*/


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

        let url3 =
          'http://tccapi.1966.org.tw/api/DriverInfo/GetDriverReceive/' +
          obj_value.response.Id;

        const data2 = await fetch(url3, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log('TASK AJAX', res);
            setshouldReceiveAmt(res.response.ShouldReceiveAmt);
            setrealReceiveAmt(res.response.RealReceiveAmt);
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

  async function handleSubmitHitCard() {
    let url2 = `http://tccapi.1966.org.tw/api/DriverInfo/SetPunchTime/${
      user.response.Id
    }?status=${status}`;
    if(bTemperature !== 0){
      url2 += `&bodyTemperature=${bTemperature}`;
    }
    console.log("Making hit request to ",url2);

    const data = await fetch(url2, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('TASK AJAX', res.response.OnTime !== null);
        setOn(res.response.OnTime !== null);
        setOff(res.response.OffTime !== null);
        fetchData();

        //1:上班 2:下班 3:已下班&簽名 4:簽完名
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

  const handleSavePic = async res => {

    if(shouldReceiveAmt===' 讀取中...'){
      Alert.alert('網路讀取中，請稍後再試...', ' ', [
            {
              text: '確定',
              onPress: () => {handleSavePic(res)},
            },
          ]);
    }
    else{
      console.log('RES????????????', res.pathName);
    //setcashSteps(0);
    await setpicPath(res);
    console.log('SETPATH?????????', picPath);

    const res2 = await FileUtil.readDir();
    res2.forEach(async function(item, index, array) {
      await postPic(item)
        .then(() => FileUtil.deleteFile(`file://${item}`))
        .catch(err => {
          Alert.alert('網路異常，請稍後再試...', ' ', [
            {
              text: '確定',
              onPress: () => {},
            },
          ]);
        });
      // forEach 就如同 for，不過寫法更容易
    });

    //setdoneCase(detailIndex);
    //handleNextStep();
    setshowOverlay(false);
    setstatus(status + 1);
    //await checkDone();
    }


  };

  const postPic = async picPath2 => {
    let indexTS = picPath2.indexOf('TS');

    let fname = picPath2.substr(indexTS);
    let isDriverSign = false;
    if (fname == 'g') {
      fname = 'sign.png';
      isDriverSign = true;
    }
    console.log('isDriverSign?', isDriverSign);
    let urii = `file://${picPath2}`;
    console.log('PICPATH?????????', urii);
    let form = new FormData();
    form.append('image', {
      uri: urii,
      type: 'image/png',
      name: fname,
      filename: fname,
    });
    let url = `http://tccapi.1966.org.tw/api/Img/Pic`;

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
      .then(async res => {
        console.log('postPic AJAX', res);
        setpicPathOnServer(res.response);

        if (isDriverSign){
          let url2 =
          'http://tccapi.1966.org.tw/api/DriverInfo/PutDriverReceiveSign';
        const data2 = await fetch(url2, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            DriverId: user.response.Id,
            ShouldReceiveAmt: shouldReceiveAmt,
            RealReceiveAmt: realReceiveAmt,
            DriverSign: res.response,
          }),
        })
          .then(response2 => response2.json())
          .then(res2 => {
            console.log('PUTSIGN AJAX', res2);
          })
          .catch(err2 =>
            Alert.alert('網路異常，請稍後再試...', ' ', [
              {
                text: '確定',
                onPress: () => {},
              },
            ]),
          );
        }
        

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
    console.log('STATUS?', status);
    return (
      <View
        style={{
          width: '95%',
          alignItems: 'center',
          backgroundColor: 'white',
          alignSelf: 'center',
          marginTop: 10,
        }}>
        <Overlay

          isVisible={overlay}
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
            {`請選擇您的體溫`}
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
            <Picker.Item label="37.5" value={37.5} color="red"/>
            <Picker.Item label="37.6" value={37.6} color="red"/>
            <Picker.Item label="37.7" value={37.7} color="red"/>
            <Picker.Item label="37.8" value={37.8} color="red"/>
            <Picker.Item label="37.9" value={37.9} color="red"/>
            <Picker.Item label="38.0" value={38.0} color="red"/>
            <Picker.Item label="略過" value={0} />
          </Picker>

          <RPButton
            onPress={() => {
              handleSubmitHitCard();
              setoverlay(false);
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
          </RPButton>
        </Overlay>
        <Overlay
          isVisible={status == 3 && showOverlay ? true : false}
          //isVisible={showOverlay ? true : false}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="white"
          width="90%"
          height="80%">
          <SignatureScreen handleSavePic={handleSavePic} name={'sign'} />
        </Overlay>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image style={{}} source={require('./img/icons8-clock_8.png')} />
          <View style={{flexDirection: 'column', margin: 15}}>
            <Text>上班時間</Text>
            <Text
              style={
                status === 1
                  ? {fontSize: 35, fontWeight: 'bold', color: 'white'}
                  : {fontSize: 35, fontWeight: 'bold'}
              }>
              {status === 1 ? '77:77' : data.response.OnTime.slice(11, 16)}
            </Text>
          </View>
          <Button
            disabled={!isOn}
            title={isOn ? '已打卡' : '未打卡'}
            containerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              height: 80,
              width: 80,
            }}
            buttonStyle={{
              height: 80,
              width: 80,
              borderRadius: 160,
              borderWidth: 5,
              borderColor: 'orange',
            }}
            titleStyle={{
              color: 'orange',
              fontWeight: 'bold',
            }}
            type="outline"
            onPress={() => {}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderTopColor: 'gray',
            borderTopWidth: 0.5,
          }}>
          <Image style={{}} source={require('./img/icons8-watch.png')} />
          <View style={{flexDirection: 'column', margin: 15}}>
            <Text>下班時間</Text>
            <Text
              style={
                status >= 3
                  ? {fontSize: 35, fontWeight: 'bold'}
                  : {fontSize: 35, fontWeight: 'bold', color: 'white'}
              }>
              {status >= 3 ? data.response.OffTime.slice(11, 16) : '88:88'}
            </Text>
          </View>
          <Button
            disabled={!isOff}
            title={isOff ? '已打卡' : '未打卡'}
            containerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              height: 80,
              width: 80,
            }}
            buttonStyle={{
              height: 80,
              width: 80,
              borderRadius: 160,
              borderWidth: 5,
              borderColor: 'orange',
            }}
            titleStyle={{
              color: 'orange',
              fontWeight: 'bold',
            }}
            type="outline"
            onPress={() => {}}
          />
        </View>

        <Button
          disabled={status >= 3 ? true : false}
          title={
            status === 1 ? '上班打卡' : status === 2 ? '下班打卡' : '已下班'
          }
          containerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            width: '100%',
          }}
          buttonStyle={{
            width: '100%',
            alignSelf: 'center',
            alignItems:'center',
            justifyContent:'flex-start',
            backgroundColor: 'orange',
            borderRadius: 50,
            marginBottom: 20,
            marginTop: 20,
          }}
          type="solid"
          onPress={() => {
            Alert.alert('確定打卡?', ' ', [
              {
                text: '取消',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: '確定',
                onPress: () => {
                  handleSubmitHitCard();
                },
              },
            ]);
          }}
        />
        <View style={{alignSelf: 'center', width: '90%', paddingBottom: 10}}>
          <Text
            style={{
              borderBottomWidth: 1,
              fontSize: 20,
              color: 'orange',
              fontWeight: 'bold',
            }}>
            本日收入
          </Text>
          <Text style={{fontSize: 20}}>
            {'應收金額:                       $' + shouldReceiveAmt}
          </Text>
          <Text style={{fontSize: 20}}>
            {'實收金額:                       $' + realReceiveAmt}
          </Text>
        </View>
        <Button
          disabled={status >= 4 ? true : false}
          title={status >= 4 ? '已簽名' : '司機簽名'}
          containerStyle={
            status >= 3
              ? {
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  width: '70%',
                }
              : {
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  width: '70%',
                  display: 'none',
                }
          }
          buttonStyle={{
            width: '90%',
            alignSelf: 'center',
            backgroundColor: 'orange',
            borderRadius: 50,
            marginBottom: 20,
            marginTop: 10,
            justifyContent:'flex-start',
          }}
          type="solid"
          onPress={() => {
            setshowOverlay(true);
          }}
        />
      </View>
    );
  }
};

export default HitCard;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: '7%',
  },
});
