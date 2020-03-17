import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
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

import {ThemeProvider, Avatar, Overlay} from 'react-native-elements';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';

const InfoScreen = props => {
  console.log('Navigation?', props.navigation);
  const [data, setdata] = useState({});
  const [showOverlay, setshowOverlay] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [input1, setinput1] = useState('');
  const [input2, setinput2] = useState('');

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        console.log(obj_value);
        setdata(obj_value);
        setLoading(false);
      }
    } catch (error) {
      console.log('cannot get ITEM');
      // Error retrieving data
    }
  }

  const handleSubmit = async () => {
    var url3 =
      'http://tccapi.1966.org.tw/api/DriverInfo/PutDriverPwd?DriverId=' +
      data.response.Id +
      '&oldPwd=' +
      input1 +
      '&newPwd=' +
      input2;
    console.log(`Making PWD request to: ${url3}`);
    const data2 = await fetch(url3, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('TASK AJAX', res);
        if (res.success) {
          Alert.alert('修改密碼成功', ' ', [
            {
              text: '確定',
              onPress: () => {
                setshowOverlay(false);
              },
            },
          ]);
        } else {
          Alert.alert(res.msg, ' ', [
            {
              text: '確定',
              onPress: () => {
                setshowOverlay(false);
              },
            },
          ]);
        }
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
    const infoData = data.response;
    const sex = infoData.Sex == '1' ? '男' : '女';
    const pi= infoData.Cars.Status===1?'可派發':'不可派發';
    console.log('INFO PROPS IS', infoData.Sex);
    const licenceNum = infoData.DriverLicense.length;
    var licence = [];
    for (var i=0;i<licenceNum;i++){
      licence[i]  =  '駕照: ' +
                infoData.DriverLicense[i].CarTypeName +
                `  (${infoData.DriverLicense[i].ExDate})`;
    }
    

    return (
      <ScrollView style={{flex: 1, flexDirection: 'column'}}>
        <Overlay
          onBackdropPress={() => setshowOverlay(false)}
          isVisible={showOverlay}
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
            修改密碼
          </Text>
          <TextInput
            mode="outlined"
            dense={true}
            error={input1 === 0 ? true : false}
            placeholder="請輸入舊密碼"
            style={{width: '100%'}}
            onChangeText={text => {
              setinput1(text);
            }}
          />
          <TextInput
            mode="outlined"
            dense={true}
            error={input1 === 0 ? true : false}
            placeholder="請輸入新密碼"
            style={{width: '100%', marginBottom: 10}}
            onChangeText={text => {
              setinput2(text);
            }}
          />
          <Button
            onPress={() => handleSubmit()}
            color="orange"
            disabled={false}
            mode="contained"
            labelStyle={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
            style={{marginBottom: 10}}>
            確定修改
          </Button>
        </Overlay>
        <Card>
          <Card.Title
            title={infoData.DriverName}
            subtitle={'車牌號碼:' + infoData.Cars.CarNo}
            left={props => (
              <Avatar rounded size="medium" source={{uri: data.response.Pic}} />
            )}
          />
          <Card.Content>
            <Title>{'司機:' + infoData.StatusChinese}</Title>
            <Title>{'車輛:' + pi}</Title>
          </Card.Content>

          <Card.Actions>
            <Button
              mode="contained"
              compact={false}
              style={styles.button}
              onPress={() => {
                setshowOverlay(true);
              }}>
              修改密碼
            </Button>
          </Card.Actions>

          <Card.Content>
            <Title>{'性別: ' + sex}</Title>
            <Divider />
            <Title>{'手機: ' + infoData.Phone}</Title>
            <Divider />
            <Title>{'身分證字號: ' + infoData.UID}</Title>
            <Divider />
            <Title>{'電子郵件: ' + infoData.Email}</Title>
            <Divider />
            <Title style={licenceNum>=1?{}:{display:'none'}}>
              {licenceNum>=1 &&licence[0]}
            </Title>
            <Title style={licenceNum>=2?{}:{display:'none'}}>
              {licenceNum>=2 &&licence[1]}
            </Title>
            <Title style={licenceNum>=3?{}:{display:'none'}}>
              {licenceNum>=3 &&licence[2]}
            </Title>
            <Title style={licenceNum>=4?{}:{display:'none'}}>
              {licenceNum>=4 &&licence[3]}
            </Title>
            <Divider />
            <Title>
              {'保險: ' +
                (infoData.DriverSecure[0] === undefined
                  ? ' '
                  : infoData.DriverSecure[0])}
            </Title>
            <Divider />
            <Title>{'服務單位: ' + infoData.CompanyName}</Title>
            <Divider />
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }
};

export default InfoScreen;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
  },
});
