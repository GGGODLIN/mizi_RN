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

import {ThemeProvider, Avatar} from 'react-native-elements';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  Switch,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import ToggleSwitch from 'toggle-switch-react-native';

const BodyCheckScreen = props => {
  console.log('CHECK BODY?');
  const pushAction = StackActions.push('CheckMainScreen');
  const [data, setdata] = useState({});
  const [date, setDate] = useState(new Date());

  const [input1, setinput1] = useState(0);
  const [input2, setinput2] = useState(0);
  const [input3, setinput3] = useState(0);
  const [input4, setinput4] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);
  const [allChecked, setallChecked] = useState(false);
  const [checkDataModal, setcheckDataModal] = useState({});
  const [checkedItem, setcheckedItem] = useState([
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
  ]);

  const handleSubmit = async () => {
    console.log(checkedItem);
    let tempData = checkDataModal;
    let queryNoSituation = '';
    let queryHasSituationAndChecked = '';
    let queryHasSituationNoChecked = '';
    let pleaseBack = false;
    let WineMeasurement = checkedItem[0]===1?0:1;

    checkedItem.forEach(function(item, index, array) {
      console.log(
        item,
        index,
        array,
        checkDataModal.response.data[index].DriverCheckName,
      );
      if (item === 1) {
        queryNoSituation +=
          `${checkDataModal.response.data[index].DriverCheckName}` + ',';
      } else if (item === 3) {
        queryHasSituationAndChecked +=
          `${checkDataModal.response.data[index].DriverCheckName}` + ',';
      } else if (item === 2) {
        queryHasSituationNoChecked +=
          `${checkDataModal.response.data[index].DriverCheckName}` + ',';
      } else {
        pleaseBack = true;
        console.log(`PLEASE CHECK ${index}`);
      }
    });

    console.log('queryNoSituation', queryNoSituation);
    console.log('queryHasSituationAndChecked', queryHasSituationAndChecked);
    console.log('queryHasSituationNoChecked', queryHasSituationNoChecked);

    if (pleaseBack) {
      Alert.alert('請回答所有問題', '', [
        {text: '確定', onPress: () => {}},
      ]);
      return;
    }
    let url =
      'http://wheat-tainan.1966.org.tw:20021/api/CheckResult/PostCheckDriverMapping';
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
        WineMeasurement: WineMeasurement,
        SystolicBlood: input1,
        DiastolicBlood: input2,
        TemperatureValue: input3,
        HeartRate: input4,
        NoSituation: queryNoSituation,
        HasSituationAndChecked: queryHasSituationAndChecked,
        HasSituationNoChecked: queryHasSituationNoChecked,
      }),
    }).then(res => {
      console.log('POST RES', res.json());
      console.log('SUBMIT', data.response.Cars.Id);
      props.navigation.navigate('CheckMainScreen');
    }).catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
  };

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
            console.log('FETCH BODY CHECKED?', res.response.DriverCheck);
            if (res.response.DriverCheck) {
              var nowDate = `${date.getFullYear()}-${date.getMonth() +
                1}-${date.getDate()}`;
              let url = `http://wheat-tainan.1966.org.tw:20021/api/CheckResult/GetCheckDriverMappingSingle?DriverId=${
                obj_value.response.Id
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
          '今日身心已檢查完畢',
          `收縮壓:${res.response.SystolicBlood}
舒張壓:${res.response.DiastolicBlood}
額溫值:${res.response.TemperatureValue}
心率值:${res.response.HeartRate}

沒有:
          ${res.response.NoSituation}
          
有、但沒去看醫生:
          ${res.response.HasSituationNoChecked}

有、已經看過醫生:
          ${res.response.HasSituationAndChecked}`,
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
        {console.log(err);
                Alert.alert('網路異常，請稍後再試...', ' ', [
                  {
                    text: '確定',
                    onPress: () => {},
                  },
                ]);}
      );
  };

  const fetchDataModal = async () => {
    let url = `http://wheat-tainan.1966.org.tw:20021/api/CheckItem/GetCheckDriver`;

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
      }).catch(err =>
        Alert.alert('網路異常，請稍後再試...', ' ', [
          {
            text: '確定',
            onPress: () => {},
          },
        ]),
      );
  };

  const handleSwitch = (index, change) => {
    let tempData = checkedItem;
    tempData[index] = change;
    console.log(tempData);
    setcheckedItem([...tempData]);
  };

  const handleCheckAll = async () => {
    let tempData = checkedItem;
    if (allChecked) {
      tempData = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
      setcheckedItem(tempData);
      setallChecked(false);
    } else {
      tempData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      setcheckedItem(tempData);
      setallChecked(true);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataModal().then(() => setLoading(false));
  }, []);

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
    console.log('info screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} size='large' />
      </View>
    );
  } else {
    console.log('RENDER', checkedItem);
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
            每日身心檢查
          </Text>
          <ToggleSwitch
            isOn={allChecked}
            onColor="#F8A91E"
            offColor="#CACACA"
            label="全部檢查完畢"
            labelStyle={{color: 'white'}}
            size="medium"
            onToggle={isOn => {
              handleCheckAll();
            }}
          />
        </View>
        <View style={{backgroundColor: 'white'}}>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              paddingStart: 20,
              paddingTop: 15,
            }}>
            根據自己的感受和體會
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              paddingStart: 20,
              paddingVertical: 15,
            }}>
            對您現在的身心狀況進行評估並點選適當欄位
          </Text>
        </View>
        <View style={{backgroundColor: 'white'}}>
          <View />
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: 'black',
                fontSize: 24,
                paddingStart: 20,
                paddingTop: 15,
                alignSelf: 'center',
              }}>
              血壓值:
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              mode="outlined"
              dense={true}
              error={input1 === 0 ? true : false}
              placeholder="收縮壓－單位:mmHg"
              style={{paddingStart: '10%', width: '65%'}}
              onChangeText={text => {
                setinput1(text);
              }}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: 'white',
                fontSize: 24,
                paddingStart: 20,
                paddingTop: 15,
                alignSelf: 'center',
              }}>
              血壓值:
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              mode="outlined"
              dense={true}
              error={input2 === 0 ? true : false}
              placeholder="舒張壓－單位:mmHg"
              style={{paddingStart: '10%', width: '65%'}}
              onChangeText={text => {
                setinput2(text);
              }}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: 'black',
                fontSize: 24,
                paddingStart: 20,
                paddingTop: 15,
                alignSelf: 'center',
              }}>
              額溫值:
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              mode="outlined"
              dense={true}
              error={input3 === 0 ? true : false}
              placeholder="單位:°C"
              style={{paddingStart: '10%', width: '65%'}}
              onChangeText={text => {
                setinput3(text);
              }}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: 'black',
                fontSize: 24,
                paddingStart: 20,
                paddingTop: 15,
                alignSelf: 'center',
              }}>
              心率值:
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              mode="outlined"
              dense={true}
              error={input4 === 0 ? true : false}
              placeholder="單位:次/分"
              style={{paddingStart: '10%', width: '65%'}}
              onChangeText={text => {
                setinput4(text);
              }}
            />
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[0].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[0] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(0, 1);
              }}
            />
            <Text style={styles.chooseText}>通過</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[0] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(0, 2);
              }}
            />
            <Text style={styles.chooseText}>不通過</Text>
          </View>
        </View>
        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[1].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[1] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(1, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[1] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(1, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[1] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(1, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[2].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[2] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(2, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[2] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(2, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[2] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(2, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[3].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[3] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(3, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[3] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(3, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[3] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(3, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[4].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[4] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(4, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[4] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(4, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[4] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(4, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[5].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[5] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(5, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[5] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(5, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[5] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(5, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[6].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[6] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(6, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[6] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(6, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[6] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(6, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[7].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[7] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(7, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[7] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(7, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[7] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(7, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[8].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[8] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(8, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[8] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(8, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[8] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(8, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[9].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[9] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(9, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[9] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(9, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[9] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(9, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[10].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[10] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(10, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[10] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(10, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[10] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(10, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[11].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[11] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(11, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[11] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(11, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[11] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(11, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[12].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[12] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(12, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[12] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(12, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[12] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(12, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[13].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[13] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(13, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[13] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(13, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[13] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(13, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[14].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[14] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(14, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[14] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(14, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[14] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(14, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[15].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[15] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(15, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[15] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(15, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[15] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(15, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[16].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[16] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(16, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[16] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(16, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[16] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(16, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[17].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[17] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(17, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[17] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(17, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[17] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(17, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[18].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[18] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(18, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[18] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(18, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[18] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(18, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>
            {checkDataModal.response.data[19].DriverCheckName}
          </Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[19] == 1 ? true : false}
              onValueChange={() => {
                handleSwitch(19, 1);
              }}
            />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[19] == 2 ? true : false}
              onValueChange={() => {
                handleSwitch(19, 2);
              }}
            />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              style={styles.switchSize}
              value={checkedItem[19] == 3 ? true : false}
              onValueChange={() => {
                handleSwitch(19, 3);
              }}
            />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
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
          onPress={() => {
            handleSubmit();
          }}>
          提交
        </Button>
      </ScrollView>
    );
  }
};

export default BodyCheckScreen;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: '7%',
  },
  switchBox: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginTop: '2%',
    width: '90%',
  },
  switchRow: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: '2%',
  },
  divider: {
    color: 'black',
    backgroundColor: '#B4B3B3',
    padding: 0.3,
    width: '95%',
  },
  switchSize: {
    padding: '1%',
    marginStart: 10,
    marginEnd: 10,
  },
  chooseText: {
    padding: '1%',
    fontSize: 18,
  },
  chooseTitle: {
    padding: '5%',
    fontSize: 15,
    color: 'orange',
    fontWeight: 'bold',
  },
});
