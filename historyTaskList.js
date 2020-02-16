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
import {Button, Card, Title, Paragraph} from 'react-native-paper';

const HistoryTaskList = props => {
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
    console.log('INFO PROPS IS', data);
    return (
      <ScrollView style={{flex: 1, flexDirection: 'column'}}>
        <Card>
          <Card.Title
            title={infoData.DriverName}
            subtitle={'Card Subtitle'}
            left={props => (
              <Avatar rounded size="medium" source={{uri: data.response.Pic}} />
            )}
          />
          <Card.Content>
            <Title>Card title</Title>
            <Paragraph>Card content</Paragraph>
          </Card.Content>
          <Card.Cover source={{uri: 'https://picsum.photos/700'}} />
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    );
  }
};

export default HistoryTaskList;
