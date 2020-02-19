import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
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

import {ThemeProvider, Avatar, CheckBox} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import ToggleSwitch from 'toggle-switch-react-native';

const CarCheckScreen = ({props, route}) => {
  const [data, setdata] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);
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
        setdata(obj_value);
      }
    } catch (error) {
      console.log('cannot get ITEM1');
      // Error retrieving data
    }
  }

  const handleLogin = async () => {
    let url = `http://wheathwaapi.vielife.com.tw/api/CheckItem/GetCheckCarViewModel`;

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
      });
  };

  useEffect(() => {
    handleLogin().then(() => setLoading(false));
  }, []);

  if (isLoading) {
    console.log('CHECKCAR screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>LOADING.............</Text>
      </View>
    );
  } else {
    return (
      <ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 10,
          }}>
          <Icon name="close" size={30} color="#900" style={{flex: 0.2}} />
          <Text>您今日尚未完成檢查</Text>
          <ToggleSwitch
            isOn={false}
            onColor="green"
            offColor="red"
            label="Example label"
            labelStyle={{color: 'black', fontWeight: '900'}}
            size="large"
            onToggle={isOn => console.log('changed to : ', isOn)}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={styles.checkTable} elevation={5}>
            <CheckBox
              title={checkDataModal.response[0].CheckCarName}
              checked={checkDataModal.response[0].HasChange}
              containerStyle={styles.checkElementTop}
              onPress={() => {
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
            <CheckBox
              title={checkDataModal.response[1].CheckCarName}
              checked={checkDataModal.response[1].HasChange}
              containerStyle={styles.checkElementTop}
              onPress={() => {
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
            <CheckBox
              title={checkDataModal.response[2].CheckCarName}
              checked={checkDataModal.response[2].HasChange}
              containerStyle={styles.checkElementTop}
              onPress={() => {
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
            <CheckBox
              title={checkDataModal.response[3].CheckCarName}
              checked={checkDataModal.response[3].HasChange}
              containerStyle={styles.checkElementTop}
              onPress={() => {
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
            <CheckBox
              title={checkDataModal.response[4].CheckCarName}
              checked={checkDataModal.response[4].HasChange}
              containerStyle={styles.checkElementTop}
              onPress={() => {
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
            <CheckBox
              title={checkDataModal.response[5].CheckCarName}
              checked={checkDataModal.response[5].HasChange}
              containerStyle={styles.checkElementTop}
              onPress={() => {
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
            <CheckBox
              title={checkDataModal.response[6].CheckCarName}
              checked={checkDataModal.response[6].HasChange}
              containerStyle={styles.checkElementTop}
              onPress={() => {
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
            <CheckBox
              title={checkDataModal.response[7].CheckCarName}
              checked={checkDataModal.response[7].HasChange}
              containerStyle={styles.checkElementTop}
              onPress={() => {
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
        </View>
      </ScrollView>
    );
  }
};

export default CarCheckScreen;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: '7%',
  },
  checkElement: {
    padding: 10,
    paddingStart: 10,
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
    width: '80%',
  },
  checkTableRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
});
