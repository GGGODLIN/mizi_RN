import React, {useState, useEffect, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
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
import {Button, Card, Title, Paragraph, Divider} from 'react-native-paper';

const InfoScreen = props => {
  console.log("Navigation?",props.navigation);
  const [data, setdata] = useState({});
  const [isLoading, setLoading] = useState(true);

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

  

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    console.log('info screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>LOADING.............</Text>
      </View>
    );
  } else {
    const infoData = data.response;
    const sex = infoData.Sex =='1'?"男":"女";
    console.log('INFO PROPS IS', infoData.Sex);
    return (
      <ScrollView style={{flex: 1, flexDirection: 'column'}}>
        <Card>
          <Card.Title
            title={infoData.DriverName}
            subtitle={'車牌號碼:'+infoData.Cars.CarNo}
            left={props => (
              <Avatar rounded size="medium" source={{uri: data.response.Pic}} />
            )}
          />
          <Card.Content>
            <Title>{"司機:"+infoData.StatusChinese}</Title>
            <Title>{"車輛:"+infoData.StatusChinese}</Title>
            <Paragraph>{"車輛:"+infoData.StatusChinese}</Paragraph>
          </Card.Content>
          
          <Card.Actions>
            <Button  mode="contained" compact={false} style={styles.button} >編輯基本資料</Button>
          </Card.Actions>
          <Card.Actions>
            <Button mode="contained" style={styles.button}>修改密碼</Button>
          </Card.Actions>
           <Card.Content>
            <Title>{"性別: "+ sex}</Title>
             <Divider />
            <Title>{"手機: "+infoData.Phone}</Title>
            <Divider />
            <Title>{"身分證字號: "+infoData.UID}</Title>
            <Divider />
            <Title>{"電子郵件: "+infoData.Email}</Title>
            <Divider />
            <Title>{"駕照: "+infoData.DriverLicense[0].CarTypeName + `  (${infoData.DriverLicense[0].ExDate})`}</Title>
            <Divider />
            <Title>{"保險: "+infoData.DriverSecure[0]}</Title>
            <Divider />
            <Title>{"服務單位: "+infoData.CompanyName}</Title>
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
 alignItems: 'center',
  },
});
