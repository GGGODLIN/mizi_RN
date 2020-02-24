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

import {ThemeProvider, Avatar} from 'react-native-elements';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  Switch,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const BodyCheckScreen = props => {
  console.log('CHECK CAR?');
  const [data, setdata] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);
  const [checkDataModal, setcheckDataModal] = useState({});
  const [checkedItem, setcheckedItem] = useState([4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4]);

  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem('userLoginInfo');
      if (value !== null) {
        var obj_value = JSON.parse(value);
        let url = `http://wheathwaapi.vielife.com.tw/api/DriverInfo/GetDriverCheck/${
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
              props.navigation.navigate('CheckMainScreen');
            }
          });
        setdata(obj_value);
      }
    } catch (error) {
      console.log('cannot get ITEM1');
      // Error retrieving data
    }
  }

  const fetchDataModal = async () => {
    let url = `http://wheathwaapi.vielife.com.tw/api/CheckItem/GetCheckDriver`;

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

  const handleSwitch = (index,change) =>{
    let tempData = {...checkedItem};
    tempData[index] = change;
    setcheckedItem(tempData);
  }

  useEffect(() => {
    fetchData();
    fetchDataModal().then(() => setLoading(false));
  }, []);

  if (isLoading) {
    console.log('info screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>LOADING.............</Text>
      </View>
    );
  } else {
    return (
      <ScrollView >

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[0].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[0]==1?true:false} onValueChange={() => {handleSwitch(0,1)}} />
            <Text style={styles.chooseText}>通過</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[0]==2?true:false} onValueChange={() => {handleSwitch(0,2)}} />
            <Text style={styles.chooseText}>不通過</Text>
          </View>
        </View>
        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[1].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[1]==1?true:false} onValueChange={() => {handleSwitch(1,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[1]==2?true:false} onValueChange={() => {handleSwitch(1,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[1]==3?true:false} onValueChange={() => {handleSwitch(1,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[2].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[2]==1?true:false} onValueChange={() => {handleSwitch(2,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[2]==2?true:false} onValueChange={() => {handleSwitch(2,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[2]==3?true:false} onValueChange={() => {handleSwitch(2,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[3].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[3]==1?true:false} onValueChange={() => {handleSwitch(3,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[3]==2?true:false} onValueChange={() => {handleSwitch(3,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[3]==3?true:false} onValueChange={() => {handleSwitch(3,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[4].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[4]==1?true:false} onValueChange={() => {handleSwitch(4,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[4]==2?true:false} onValueChange={() => {handleSwitch(4,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[4]==3?true:false} onValueChange={() => {handleSwitch(4,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[5].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[5]==1?true:false} onValueChange={() => {handleSwitch(5,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[5]==2?true:false} onValueChange={() => {handleSwitch(5,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[5]==3?true:false} onValueChange={() => {handleSwitch(5,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[6].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[6]==1?true:false} onValueChange={() => {handleSwitch(6,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[6]==2?true:false} onValueChange={() => {handleSwitch(6,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[6]==3?true:false} onValueChange={() => {handleSwitch(6,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[7].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[7]==1?true:false} onValueChange={() => {handleSwitch(7,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[7]==2?true:false} onValueChange={() => {handleSwitch(7,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[7]==3?true:false} onValueChange={() => {handleSwitch(7,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[8].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[8]==1?true:false} onValueChange={() => {handleSwitch(8,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[8]==2?true:false} onValueChange={() => {handleSwitch(8,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[8]==3?true:false} onValueChange={() => {handleSwitch(8,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[9].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[9]==1?true:false} onValueChange={() => {handleSwitch(9,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[9]==2?true:false} onValueChange={() => {handleSwitch(9,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[9]==3?true:false} onValueChange={() => {handleSwitch(9,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[10].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[10]==1?true:false} onValueChange={() => {handleSwitch(10,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[10]==2?true:false} onValueChange={() => {handleSwitch(10,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[10]==3?true:false} onValueChange={() => {handleSwitch(10,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[11].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[11]==1?true:false} onValueChange={() => {handleSwitch(11,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[11]==2?true:false} onValueChange={() => {handleSwitch(11,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[11]==3?true:false} onValueChange={() => {handleSwitch(11,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[12].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[12]==1?true:false} onValueChange={() => {handleSwitch(12,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[12]==2?true:false} onValueChange={() => {handleSwitch(12,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[12]==3?true:false} onValueChange={() => {handleSwitch(12,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[13].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[13]==1?true:false} onValueChange={() => {handleSwitch(13,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[13]==2?true:false} onValueChange={() => {handleSwitch(13,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[13]==3?true:false} onValueChange={() => {handleSwitch(13,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[14].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[14]==1?true:false} onValueChange={() => {handleSwitch(14,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[14]==2?true:false} onValueChange={() => {handleSwitch(14,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[14]==3?true:false} onValueChange={() => {handleSwitch(14,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[15].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[15]==1?true:false} onValueChange={() => {handleSwitch(15,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[15]==2?true:false} onValueChange={() => {handleSwitch(15,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[15]==3?true:false} onValueChange={() => {handleSwitch(15,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[16].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[16]==1?true:false} onValueChange={() => {handleSwitch(16,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[16]==2?true:false} onValueChange={() => {handleSwitch(16,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[16]==3?true:false} onValueChange={() => {handleSwitch(16,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[17].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[17]==1?true:false} onValueChange={() => {handleSwitch(17,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[17]==2?true:false} onValueChange={() => {handleSwitch(17,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[17]==3?true:false} onValueChange={() => {handleSwitch(17,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[18].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[18]==1?true:false} onValueChange={() => {handleSwitch(18,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[18]==2?true:false} onValueChange={() => {handleSwitch(18,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[18]==3?true:false} onValueChange={() => {handleSwitch(18,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.chooseTitle}>{checkDataModal.response.data[19].DriverCheckName}</Text>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[19]==1?true:false} onValueChange={() => {handleSwitch(19,1)}} />
            <Text style={styles.chooseText}>沒有</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[19]==2?true:false} onValueChange={() => {handleSwitch(19,2)}} />
            <Text style={styles.chooseText}>有，但沒去看醫生</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch style={styles.switchSize} value={checkedItem[19]==3?true:false} onValueChange={() => {handleSwitch(19,3)}} />
            <Text style={styles.chooseText}>有，已經看過醫生</Text>
          </View>
        </View>
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
    alignSelf:'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginTop:'2%',
    width:'90%',
  },
  switchRow: {
    alignItems: 'flex-start',
    justifyContent:'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding:'2%',
  },
  divider: {
    color: 'black',
    backgroundColor: '#B4B3B3',
    padding: 0.3,
    width: '95%',
  },
  switchSize:{
    padding:'1%',
    marginStart:10,
    marginEnd:10
  },
  chooseText:{
    padding:'1%',
    fontSize:18,
  },
  chooseTitle:{
    padding:'5%',
    fontSize:15,
    color:'orange',
    fontWeight:'bold'
  },
});
