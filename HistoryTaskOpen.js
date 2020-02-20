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
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {ThemeProvider, Avatar} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const HistoryTaskOpen = props => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCUaMOOcU7-pH99LS6ajo_s1WkDua92H08';
  const taskData = props.route.params.data.DespatchDetails[0];
  const [data, setdata] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);

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

  const origin = {
    latitude: taskData.OrderDetails.FromLat,
    longitude: taskData.OrderDetails.FromLon,
  };
  const destination = {
    latitude: taskData.OrderDetails.ToLat,
    longitude: taskData.OrderDetails.ToLon,
  };
  const region = {
    latitude: taskData.OrderDetails.FromLat,
    longitude: taskData.OrderDetails.FromLon,
    latitudeDelta:
      Math.abs(taskData.OrderDetails.FromLat - taskData.OrderDetails.ToLat) *
      2.2,
    longitudeDelta:
      Math.abs(taskData.OrderDetails.FromLon - taskData.OrderDetails.ToLon) *
      2.2,
  };

  if (isLoading) {
    console.log('info screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>LOADING.............</Text>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: taskData.OrderDetails.FromLat,
            longitude: taskData.OrderDetails.FromLon,
            latitudeDelta:
              Math.abs(
                taskData.OrderDetails.FromLat - taskData.OrderDetails.ToLat,
              ) * 2.2,
            longitudeDelta:
              Math.abs(
                taskData.OrderDetails.FromLon - taskData.OrderDetails.ToLon,
              ) * 2.2,
          }}>
          <Marker coordinate={origin} icon='write' pinColor='blue' title = {taskData.OrderDetails.FromAddr} />
          <Marker coordinate={destination} icon='write' title = {taskData.OrderDetails.ToAddr} />
          
          <MapViewDirections
            origin={{
              latitude: taskData.OrderDetails.FromLat,
              longitude: taskData.OrderDetails.FromLon,
            }}
            destination={{
              latitude: taskData.OrderDetails.ToLat,
              longitude: taskData.OrderDetails.ToLon,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="#6495ED"
            lineCap="round"
            lineJoin="bevel"
          />
        </MapView>
      </View>
    );
  }
};

export default HistoryTaskOpen;

const styles = StyleSheet.create({
  map: {
    flex: 0.5,

  },
});
