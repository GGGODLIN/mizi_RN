import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
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

import {ThemeProvider, Avatar, CheckBox} from 'react-native-elements';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import ToggleSwitch from 'toggle-switch-react-native';

const CarCheckScreen = props => {
  const [data, setdata] = useState({});
  const [date, setDate] = useState(new Date());
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);
  const [allChecked, setallChecked] = useState(false);
  const [checkData, setcheckData] = useState({
    allChecked: false,
    a: {
      AallChecked: false,
      汽油: false,
      機油: false,
      變速箱油: true,
      方向盤動力油: false,
      副水箱: false,
      雨刷水箱: false,
      電瓶水: false,
      水箱: false,
    },
  });
  const [checkDataModal, setcheckDataModal] = useState({});

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        let url = `http://wheat-tainan.1966.org.tw:20021/api/DriverInfo/GetDriverCheck/${
          obj_value.response.Id
        }`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log('FETCH CHECKED?', res.response.CarCheck);
            if (res.response.CarCheck) {
              var nowDate = `${date.getFullYear()}-${date.getMonth() +
                1}-${date.getDate()}`;
              let url = `http://wheat-tainan.1966.org.tw:20021/api/CheckResult/GetCheckCarMapping?CarId=${
                obj_value.response.Cars.Id
              }&date=${nowDate}`;

              fetchDataChecked(url);
            }
          });
        setdata(obj_value);
      }
    } catch (error) {
      console.log('cannot get ITEM1');
      // Error retrieving data
    }
  }

  const fetchDataChecked = async url => {
    console.log(`Making CheckedList request to: ${url}`);

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('CheckedList AJAX', res);
        Alert.alert(
          '今日車況已檢查完畢',
          `合格項目:
          ${res?.response?.data[0]?.HasChecked}

不合格項目:
          ${res?.response?.data[0]?.NoChecked}`,
          [
            {
              text: '確定',
              onPress: () => {
                props.navigation.navigate('CheckMainScreen');
              },
            },
          ],
        );
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

  const fetchDataModal = async () => {
    let url = `http://wheat-tainan.1966.org.tw:20021/api/CheckItem/GetCheckCarViewModel`;

    console.log(`Making Modal request to: ${url}`);

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('Modal AJAX', res);
        setcheckDataModal(res);
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

  const handleCheckAll = async () => {
    let tempData = {...checkDataModal};

    if (tempData?.response !== undefined) {
      const nameList = Object.values(tempData?.response).map(
        item => (item.HasChange = !allChecked),
      );
      const nameList2 = Object.values(tempData?.response).map(item =>
        item.CheckCarChildViewModel.map(
          item2 => (item2.HasChange = !allChecked),
        ),
      );
      setallChecked(!allChecked);
      setcheckDataModal(tempData);
    }
  };

  const checkCarChecked = async () => {
    let url = `http://wheat-tainan.1966.org.tw:20021/api/DriverInfo/GetDriverCheck/${
      data.response.Id
    }`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('FETCH CHECKED?', res.response.CarCheck);
      });
  };

  const handleSubmit = async () => {
    let tempData = {...checkDataModal};
    let queryHasChecked = '';
    let queryNoChecked = '';

    if (tempData?.response !== undefined) {
      const nameList2 = Object.values(tempData?.response).map(item =>
        item.CheckCarChildViewModel.map(item2 =>
          item2.HasChange
            ? (queryHasChecked += `${item2.CheckCarName}` + ',')
            : (queryNoChecked += `${item2.CheckCarName},`),
        ),
      );

      console.log('queryHasChecked', queryHasChecked);
      console.log('queryNoChecked', queryNoChecked);

      let url =
        'http://wheat-tainan.1966.org.tw:20021/api/CheckResult/PostCheckCarMapping';
      const driverId = data.response.Id;
      const carId = data.response.Cars.Id;
      const postRes = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CarId: carId,
          DriverId: driverId,
          HasChecked: queryHasChecked,
          NoChecked: queryNoChecked,
        }),
      }).catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
      console.log('POST RES', postRes);
      console.log('SUBMIT', data.response.Cars.Id);
      props.navigation.navigate('CheckMainScreen');
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataModal().then(() => setLoading(false));
  }, []);

  const pushAction = StackActions.push('CheckMainScreen');
  useFocusEffect(
    React.useCallback(() => {
      //alert('Screen was focused');
      fetchData().then(() => setLoading(false));

      return () => {
        setLoading(true);
        props.navigation.dispatch(pushAction);
        //alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  if (isLoading) {
    console.log('CHECKCAR screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  } else if (checkDataModal?.response !== undefined) {

    const nameList = Object.values(checkDataModal?.response).map(
      item => item.HasChange,
    );
    const nameList2 = Object.values(checkDataModal?.response).map(item =>
      item.CheckCarChildViewModel.map(item2 => item2.HasChange),
    );
    console.log('GET OBJ', nameList);
    console.log('GET OBJ2', nameList2);
    return (
      <ScrollView>
        <View
          style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 15,
            backgroundColor: '#3C4856',
          }}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
            每日車輛檢查
          </Text>
          <ToggleSwitch
            isOn={allChecked}
            onColor="#F8A91E"
            offColor="#CACACA"
            label="全部檢查完畢"
            labelStyle={{color: 'white'}}
            size="medium"
            onToggle={isOn => handleCheckAll()}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={styles.checkTable} elevation={5}>
            <View style={styles.toggleBar}>
              <ToggleSwitch
                onColor="#F8A91E"
                offColor="#CACACA"
                size="medium"
                label={' '}
                isOn={checkDataModal.response[0].HasChange}
                labelStyle={{
                  color: 'black',
                  padding: 10,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onToggle={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].HasChange = newData.response[0].HasChange
                    ? false
                    : true;
                  newData.response[0].CheckCarChildViewModel[0].HasChange = !newData
                    .response[0].HasChange
                    ? false
                    : true;
                  newData.response[0].CheckCarChildViewModel[1].HasChange = !newData
                    .response[0].HasChange
                    ? false
                    : true;
                  newData.response[0].CheckCarChildViewModel[2].HasChange = !newData
                    .response[0].HasChange
                    ? false
                    : true;
                  newData.response[0].CheckCarChildViewModel[3].HasChange = !newData
                    .response[0].HasChange
                    ? false
                    : true;
                  newData.response[0].CheckCarChildViewModel[4].HasChange = !newData
                    .response[0].HasChange
                    ? false
                    : true;
                  newData.response[0].CheckCarChildViewModel[5].HasChange = !newData
                    .response[0].HasChange
                    ? false
                    : true;
                  newData.response[0].CheckCarChildViewModel[6].HasChange = !newData
                    .response[0].HasChange
                    ? false
                    : true;
                  newData.response[0].CheckCarChildViewModel[7].HasChange = !newData
                    .response[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
              <Text style={styles.toggleBarText}>
                {checkDataModal.response[0].CheckCarName}
              </Text>
            </View>
            <View
              style={{
                color: 'black',
                backgroundColor: '#B4B3B3',
                padding: 0.3,
                width: '95%',
              }}
            />
            <View style={styles.checkTableRow}>
              <CheckBox
                title={
                  '1.' +
                  checkDataModal.response[0].CheckCarChildViewModel[0]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[0].CheckCarChildViewModel[0].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].CheckCarChildViewModel[0].HasChange = checkDataModal
                    .response[0].CheckCarChildViewModel[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '2.' +
                  checkDataModal.response[0].CheckCarChildViewModel[1]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[0].CheckCarChildViewModel[1].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].CheckCarChildViewModel[1].HasChange = checkDataModal
                    .response[0].CheckCarChildViewModel[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '3.' +
                  checkDataModal.response[0].CheckCarChildViewModel[2]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[0].CheckCarChildViewModel[2].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].CheckCarChildViewModel[2].HasChange = checkDataModal
                    .response[0].CheckCarChildViewModel[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '4.' +
                  checkDataModal.response[0].CheckCarChildViewModel[3]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[0].CheckCarChildViewModel[3].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].CheckCarChildViewModel[3].HasChange = checkDataModal
                    .response[0].CheckCarChildViewModel[3].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '5.' +
                  checkDataModal.response[0].CheckCarChildViewModel[4]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[0].CheckCarChildViewModel[4].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].CheckCarChildViewModel[4].HasChange = checkDataModal
                    .response[0].CheckCarChildViewModel[4].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '6.' +
                  checkDataModal.response[0].CheckCarChildViewModel[5]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[0].CheckCarChildViewModel[5].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].CheckCarChildViewModel[5].HasChange = checkDataModal
                    .response[0].CheckCarChildViewModel[5].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '7.' +
                  checkDataModal.response[0].CheckCarChildViewModel[6]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[0].CheckCarChildViewModel[6].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].CheckCarChildViewModel[6].HasChange = checkDataModal
                    .response[0].CheckCarChildViewModel[6].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '8.' +
                  checkDataModal.response[0].CheckCarChildViewModel[7]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[0].CheckCarChildViewModel[7].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[0].CheckCarChildViewModel[7].HasChange = checkDataModal
                    .response[0].CheckCarChildViewModel[7].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
            </View>
          </View>

          <View style={styles.checkTable} elevation={5}>
            <View style={styles.toggleBar}>
              <ToggleSwitch
                onColor="#F8A91E"
                offColor="#CACACA"
                size="medium"
                label={' '}
                isOn={checkDataModal.response[1].HasChange}
                labelStyle={{
                  color: 'black',
                  padding: 10,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onToggle={() => {
                  let newData = {...checkDataModal};
                  newData.response[1].HasChange = newData.response[1].HasChange
                    ? false
                    : true;
                  newData.response[1].CheckCarChildViewModel[0].HasChange = !newData
                    .response[1].HasChange
                    ? false
                    : true;
                  newData.response[1].CheckCarChildViewModel[1].HasChange = !newData
                    .response[1].HasChange
                    ? false
                    : true;
                  newData.response[1].CheckCarChildViewModel[2].HasChange = !newData
                    .response[1].HasChange
                    ? false
                    : true;
                  newData.response[1].CheckCarChildViewModel[3].HasChange = !newData
                    .response[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
              <Text style={styles.toggleBarText}>
                {checkDataModal.response[1].CheckCarName}
              </Text>
            </View>
            <View
              style={{
                color: 'black',
                backgroundColor: '#B4B3B3',
                padding: 0.3,
                width: '95%',
              }}
            />
            <View style={styles.checkTableRow}>
              <CheckBox
                title={
                  '1.' +
                  checkDataModal.response[1].CheckCarChildViewModel[0]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[1].CheckCarChildViewModel[0].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[1].CheckCarChildViewModel[0].HasChange = checkDataModal
                    .response[1].CheckCarChildViewModel[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '2.' +
                  checkDataModal.response[1].CheckCarChildViewModel[1]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[1].CheckCarChildViewModel[1].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[1].CheckCarChildViewModel[1].HasChange = checkDataModal
                    .response[1].CheckCarChildViewModel[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '3.' +
                  checkDataModal.response[1].CheckCarChildViewModel[2]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[1].CheckCarChildViewModel[2].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[1].CheckCarChildViewModel[2].HasChange = checkDataModal
                    .response[1].CheckCarChildViewModel[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '4.' +
                  checkDataModal.response[1].CheckCarChildViewModel[3]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[1].CheckCarChildViewModel[3].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[1].CheckCarChildViewModel[3].HasChange = checkDataModal
                    .response[1].CheckCarChildViewModel[3].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
            </View>
          </View>

          <View style={styles.checkTable} elevation={5}>
            <View style={styles.toggleBar}>
              <ToggleSwitch
                onColor="#F8A91E"
                offColor="#CACACA"
                size="medium"
                label={' '}
                isOn={checkDataModal.response[2].HasChange}
                labelStyle={{
                  color: 'black',
                  padding: 10,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onToggle={() => {
                  let newData = {...checkDataModal};
                  newData.response[2].HasChange = newData.response[2].HasChange
                    ? false
                    : true;
                  newData.response[2].CheckCarChildViewModel[0].HasChange = !newData
                    .response[2].HasChange
                    ? false
                    : true;
                  newData.response[2].CheckCarChildViewModel[1].HasChange = !newData
                    .response[2].HasChange
                    ? false
                    : true;
                  newData.response[2].CheckCarChildViewModel[2].HasChange = !newData
                    .response[2].HasChange
                    ? false
                    : true;
                  newData.response[2].CheckCarChildViewModel[3].HasChange = !newData
                    .response[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
              <Text style={styles.toggleBarText}>
                {checkDataModal.response[2].CheckCarName}
              </Text>
            </View>
            <View
              style={{
                color: 'black',
                backgroundColor: '#B4B3B3',
                padding: 0.3,
                width: '95%',
              }}
            />
            <View style={styles.checkTableRow}>
              <CheckBox
                title={
                  '1.' +
                  checkDataModal.response[2].CheckCarChildViewModel[0]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[2].CheckCarChildViewModel[0].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[2].CheckCarChildViewModel[0].HasChange = checkDataModal
                    .response[2].CheckCarChildViewModel[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '2.' +
                  checkDataModal.response[2].CheckCarChildViewModel[1]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[2].CheckCarChildViewModel[1].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[2].CheckCarChildViewModel[1].HasChange = checkDataModal
                    .response[2].CheckCarChildViewModel[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '3.' +
                  checkDataModal.response[2].CheckCarChildViewModel[2]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[2].CheckCarChildViewModel[2].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[2].CheckCarChildViewModel[2].HasChange = checkDataModal
                    .response[2].CheckCarChildViewModel[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '4.' +
                  checkDataModal.response[2].CheckCarChildViewModel[3]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[2].CheckCarChildViewModel[3].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[2].CheckCarChildViewModel[3].HasChange = checkDataModal
                    .response[2].CheckCarChildViewModel[3].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
            </View>
          </View>

          <View style={styles.checkTable} elevation={5}>
            <View style={styles.toggleBar}>
              <ToggleSwitch
                onColor="#F8A91E"
                offColor="#CACACA"
                size="medium"
                label={' '}
                isOn={checkDataModal.response[3].HasChange}
                labelStyle={{
                  color: 'black',
                  padding: 10,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onToggle={() => {
                  let newData = {...checkDataModal};
                  newData.response[3].HasChange = newData.response[3].HasChange
                    ? false
                    : true;
                  newData.response[3].CheckCarChildViewModel[0].HasChange = !newData
                    .response[3].HasChange
                    ? false
                    : true;
                  newData.response[3].CheckCarChildViewModel[1].HasChange = !newData
                    .response[3].HasChange
                    ? false
                    : true;
                  newData.response[3].CheckCarChildViewModel[2].HasChange = !newData
                    .response[3].HasChange
                    ? false
                    : true;
                  newData.response[3].CheckCarChildViewModel[3].HasChange = !newData
                    .response[3].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
              <Text style={styles.toggleBarText}>
                {checkDataModal.response[3].CheckCarName}
              </Text>
            </View>
            <View
              style={{
                color: 'black',
                backgroundColor: '#B4B3B3',
                padding: 0.3,
                width: '95%',
              }}
            />
            <View style={styles.checkTableRow}>
              <CheckBox
                title={
                  '1.' +
                  checkDataModal.response[3].CheckCarChildViewModel[0]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[3].CheckCarChildViewModel[0].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[3].CheckCarChildViewModel[0].HasChange = checkDataModal
                    .response[3].CheckCarChildViewModel[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '2.' +
                  checkDataModal.response[3].CheckCarChildViewModel[1]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[3].CheckCarChildViewModel[1].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[3].CheckCarChildViewModel[1].HasChange = checkDataModal
                    .response[3].CheckCarChildViewModel[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '3.' +
                  checkDataModal.response[3].CheckCarChildViewModel[2]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[3].CheckCarChildViewModel[2].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[3].CheckCarChildViewModel[2].HasChange = checkDataModal
                    .response[3].CheckCarChildViewModel[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '4.' +
                  checkDataModal.response[3].CheckCarChildViewModel[3]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[3].CheckCarChildViewModel[3].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[3].CheckCarChildViewModel[3].HasChange = checkDataModal
                    .response[3].CheckCarChildViewModel[3].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
            </View>
          </View>

          <View style={styles.checkTable} elevation={5}>
            <View style={styles.toggleBar}>
              <ToggleSwitch
                onColor="#F8A91E"
                offColor="#CACACA"
                size="medium"
                label={' '}
                isOn={checkDataModal.response[4].HasChange}
                labelStyle={{
                  color: 'black',
                  padding: 10,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onToggle={() => {
                  let newData = {...checkDataModal};
                  newData.response[4].HasChange = newData.response[4].HasChange
                    ? false
                    : true;
                  newData.response[4].CheckCarChildViewModel[0].HasChange = !newData
                    .response[4].HasChange
                    ? false
                    : true;
                  newData.response[4].CheckCarChildViewModel[1].HasChange = !newData
                    .response[4].HasChange
                    ? false
                    : true;
                  newData.response[4].CheckCarChildViewModel[2].HasChange = !newData
                    .response[4].HasChange
                    ? false
                    : true;
                  newData.response[4].CheckCarChildViewModel[3].HasChange = !newData
                    .response[4].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
              <Text style={styles.toggleBarText}>
                {checkDataModal.response[4].CheckCarName}
              </Text>
            </View>
            <View
              style={{
                color: 'black',
                backgroundColor: '#B4B3B3',
                padding: 0.3,
                width: '95%',
              }}
            />
            <View style={styles.checkTableRow}>
              <CheckBox
                title={
                  '1.' +
                  checkDataModal.response[4].CheckCarChildViewModel[0]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[4].CheckCarChildViewModel[0].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[4].CheckCarChildViewModel[0].HasChange = checkDataModal
                    .response[4].CheckCarChildViewModel[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '2.' +
                  checkDataModal.response[4].CheckCarChildViewModel[1]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[4].CheckCarChildViewModel[1].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[4].CheckCarChildViewModel[1].HasChange = checkDataModal
                    .response[4].CheckCarChildViewModel[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '3.' +
                  checkDataModal.response[4].CheckCarChildViewModel[2]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[4].CheckCarChildViewModel[2].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[4].CheckCarChildViewModel[2].HasChange = checkDataModal
                    .response[4].CheckCarChildViewModel[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '4.' +
                  checkDataModal.response[4].CheckCarChildViewModel[3]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[4].CheckCarChildViewModel[3].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[4].CheckCarChildViewModel[3].HasChange = checkDataModal
                    .response[4].CheckCarChildViewModel[3].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
            </View>
          </View>

          <View style={styles.checkTable} elevation={5}>
            <View style={styles.toggleBar}>
              <ToggleSwitch
                onColor="#F8A91E"
                offColor="#CACACA"
                size="medium"
                label={' '}
                isOn={checkDataModal.response[5].HasChange}
                labelStyle={{
                  color: 'black',
                  padding: 10,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onToggle={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].HasChange = newData.response[5].HasChange
                    ? false
                    : true;
                  newData.response[5].CheckCarChildViewModel[0].HasChange = !newData
                    .response[5].HasChange
                    ? false
                    : true;
                  newData.response[5].CheckCarChildViewModel[1].HasChange = !newData
                    .response[5].HasChange
                    ? false
                    : true;
                  newData.response[5].CheckCarChildViewModel[2].HasChange = !newData
                    .response[5].HasChange
                    ? false
                    : true;
                  newData.response[5].CheckCarChildViewModel[3].HasChange = !newData
                    .response[5].HasChange
                    ? false
                    : true;
                  newData.response[5].CheckCarChildViewModel[4].HasChange = !newData
                    .response[5].HasChange
                    ? false
                    : true;
                  newData.response[5].CheckCarChildViewModel[5].HasChange = !newData
                    .response[5].HasChange
                    ? false
                    : true;
                  newData.response[5].CheckCarChildViewModel[6].HasChange = !newData
                    .response[5].HasChange
                    ? false
                    : true;
                  newData.response[5].CheckCarChildViewModel[7].HasChange = !newData
                    .response[5].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
              <Text style={styles.toggleBarText}>
                {checkDataModal.response[5].CheckCarName}
              </Text>
            </View>
            <View
              style={{
                color: 'black',
                backgroundColor: '#B4B3B3',
                padding: 0.3,
                width: '95%',
              }}
            />
            <View style={styles.checkTableRow}>
              <CheckBox
                title={
                  '1.' +
                  checkDataModal.response[5].CheckCarChildViewModel[0]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[5].CheckCarChildViewModel[0].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].CheckCarChildViewModel[0].HasChange = checkDataModal
                    .response[5].CheckCarChildViewModel[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '2.' +
                  checkDataModal.response[5].CheckCarChildViewModel[1]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[5].CheckCarChildViewModel[1].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].CheckCarChildViewModel[1].HasChange = checkDataModal
                    .response[5].CheckCarChildViewModel[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '3.' +
                  checkDataModal.response[5].CheckCarChildViewModel[2]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[5].CheckCarChildViewModel[2].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].CheckCarChildViewModel[2].HasChange = checkDataModal
                    .response[5].CheckCarChildViewModel[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '4.' +
                  checkDataModal.response[5].CheckCarChildViewModel[3]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[5].CheckCarChildViewModel[3].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].CheckCarChildViewModel[3].HasChange = checkDataModal
                    .response[5].CheckCarChildViewModel[3].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '5.' +
                  checkDataModal.response[5].CheckCarChildViewModel[4]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[5].CheckCarChildViewModel[4].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].CheckCarChildViewModel[4].HasChange = checkDataModal
                    .response[5].CheckCarChildViewModel[4].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '6.' +
                  checkDataModal.response[5].CheckCarChildViewModel[5]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[5].CheckCarChildViewModel[5].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].CheckCarChildViewModel[5].HasChange = checkDataModal
                    .response[5].CheckCarChildViewModel[5].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '7.' +
                  checkDataModal.response[5].CheckCarChildViewModel[6]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[5].CheckCarChildViewModel[6].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].CheckCarChildViewModel[6].HasChange = checkDataModal
                    .response[5].CheckCarChildViewModel[6].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '8.' +
                  checkDataModal.response[5].CheckCarChildViewModel[7]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[5].CheckCarChildViewModel[7].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[5].CheckCarChildViewModel[7].HasChange = checkDataModal
                    .response[5].CheckCarChildViewModel[7].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
            </View>
          </View>

          <View style={styles.checkTable} elevation={5}>
            <View style={styles.toggleBar}>
              <ToggleSwitch
                onColor="#F8A91E"
                offColor="#CACACA"
                size="medium"
                label={' '}
                isOn={checkDataModal.response[6].HasChange}
                labelStyle={{
                  color: 'black',
                  padding: 10,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onToggle={() => {
                  let newData = {...checkDataModal};
                  newData.response[6].HasChange = newData.response[6].HasChange
                    ? false
                    : true;
                  newData.response[6].CheckCarChildViewModel[0].HasChange = !newData
                    .response[6].HasChange
                    ? false
                    : true;
                  newData.response[6].CheckCarChildViewModel[1].HasChange = !newData
                    .response[6].HasChange
                    ? false
                    : true;
                  newData.response[6].CheckCarChildViewModel[2].HasChange = !newData
                    .response[6].HasChange
                    ? false
                    : true;
                  newData.response[6].CheckCarChildViewModel[3].HasChange = !newData
                    .response[6].HasChange
                    ? false
                    : true;
                  newData.response[6].CheckCarChildViewModel[4].HasChange = !newData
                    .response[6].HasChange
                    ? false
                    : true;
                  newData.response[6].CheckCarChildViewModel[5].HasChange = !newData
                    .response[6].HasChange
                    ? false
                    : true;
                  newData.response[6].CheckCarChildViewModel[6].HasChange = !newData
                    .response[6].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
              <Text style={styles.toggleBarText}>
                {checkDataModal.response[6].CheckCarName}
              </Text>
            </View>
            <View
              style={{
                color: 'black',
                backgroundColor: '#B4B3B3',
                padding: 0.3,
                width: '95%',
              }}
            />
            <View style={styles.checkTableRow}>
              <CheckBox
                title={
                  '1.' +
                  checkDataModal.response[6].CheckCarChildViewModel[0]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[6].CheckCarChildViewModel[0].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[6].CheckCarChildViewModel[0].HasChange = checkDataModal
                    .response[6].CheckCarChildViewModel[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '2.' +
                  checkDataModal.response[6].CheckCarChildViewModel[1]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[6].CheckCarChildViewModel[1].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[6].CheckCarChildViewModel[1].HasChange = checkDataModal
                    .response[6].CheckCarChildViewModel[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '3.' +
                  checkDataModal.response[6].CheckCarChildViewModel[2]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[6].CheckCarChildViewModel[2].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[6].CheckCarChildViewModel[2].HasChange = checkDataModal
                    .response[6].CheckCarChildViewModel[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '4.' +
                  checkDataModal.response[6].CheckCarChildViewModel[3]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[6].CheckCarChildViewModel[3].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[6].CheckCarChildViewModel[3].HasChange = checkDataModal
                    .response[6].CheckCarChildViewModel[3].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '5.' +
                  checkDataModal.response[6].CheckCarChildViewModel[4]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[6].CheckCarChildViewModel[4].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[6].CheckCarChildViewModel[4].HasChange = checkDataModal
                    .response[6].CheckCarChildViewModel[4].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '6.' +
                  checkDataModal.response[6].CheckCarChildViewModel[5]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[6].CheckCarChildViewModel[5].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[6].CheckCarChildViewModel[5].HasChange = checkDataModal
                    .response[6].CheckCarChildViewModel[5].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '7.' +
                  checkDataModal.response[6].CheckCarChildViewModel[6]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[6].CheckCarChildViewModel[6].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[6].CheckCarChildViewModel[6].HasChange = checkDataModal
                    .response[6].CheckCarChildViewModel[6].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
            </View>
          </View>

          <View style={styles.checkTable} elevation={5}>
            <View style={styles.toggleBar}>
              <ToggleSwitch
                onColor="#F8A91E"
                offColor="#CACACA"
                size="medium"
                label={' '}
                isOn={checkDataModal.response[7].HasChange}
                labelStyle={{
                  color: 'black',
                  padding: 10,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onToggle={() => {
                  let newData = {...checkDataModal};
                  newData.response[7].HasChange = newData.response[7].HasChange
                    ? false
                    : true;
                  newData.response[7].CheckCarChildViewModel[0].HasChange = !newData
                    .response[7].HasChange
                    ? false
                    : true;
                  newData.response[7].CheckCarChildViewModel[1].HasChange = !newData
                    .response[7].HasChange
                    ? false
                    : true;
                  newData.response[7].CheckCarChildViewModel[2].HasChange = !newData
                    .response[7].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
              <Text style={styles.toggleBarText}>
                {checkDataModal.response[7].CheckCarName}
              </Text>
            </View>
            <View
              style={{
                color: 'black',
                backgroundColor: '#B4B3B3',
                padding: 0.3,
                width: '95%',
              }}
            />
            <View style={styles.checkTableRow}>
              <CheckBox
                title={
                  '1.' +
                  checkDataModal.response[7].CheckCarChildViewModel[0]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[7].CheckCarChildViewModel[0].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[7].CheckCarChildViewModel[0].HasChange = checkDataModal
                    .response[7].CheckCarChildViewModel[0].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '2.' +
                  checkDataModal.response[7].CheckCarChildViewModel[1]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[7].CheckCarChildViewModel[1].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[7].CheckCarChildViewModel[1].HasChange = checkDataModal
                    .response[7].CheckCarChildViewModel[1].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />

              <CheckBox
                title={
                  '3.' +
                  checkDataModal.response[7].CheckCarChildViewModel[2]
                    .CheckCarName
                }
                checked={
                  checkDataModal.response[7].CheckCarChildViewModel[2].HasChange
                }
                containerStyle={styles.checkElement}
                onPress={() => {
                  let newData = {...checkDataModal};
                  newData.response[7].CheckCarChildViewModel[2].HasChange = checkDataModal
                    .response[7].CheckCarChildViewModel[2].HasChange
                    ? false
                    : true;
                  setcheckDataModal(newData);
                }}
              />
            </View>
          </View>
          <Button
            style={{
              marginVertical: 8,

              borderRadius: 50,
              backgroundColor: 'orange',
            }}
            labelStyle={{color: 'black'}}
            contentStyle={{width: '100%'}}
            mode="outlined"
            onPress={() => handleSubmit()}>
            提交
          </Button>
        </View>
      </ScrollView>
    );
  }else {
    console.log('GG');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize:32}}>網路出錯了！請重開APP試試</Text>
      </View>
    );
  }
};

export default CarCheckScreen;

const styles = StyleSheet.create({
  checkElement: {
    padding: 10,
    paddingStart: 10,
    paddingEnd: 0,
    margin: 0,
    width: '40%',

    backgroundColor: 'rgba(255, 0, 0, 0)',
    borderWidth: 0,
  },
  checkElementTop: {
    width: '100%',
    padding: 10,
    margin: 0,

    backgroundColor: 'rgba(255, 0, 0, 0)',
    borderWidth: 0,
  },
  checkTable: {
    marginVertical: 5,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255, 0, 0, 0)',
    width: '90%',
  },
  checkTableRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  toggleBar: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '110%',
    flexWrap: 'wrap',
  },
  toggleBarText: {
    padding: 10,
    color: '#F67E01',
    fontWeight: '100',
    fontSize: 25,
  },
});
