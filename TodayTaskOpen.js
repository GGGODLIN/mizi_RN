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

import {ThemeProvider, Avatar, ButtonGroup} from 'react-native-elements';
import {Button, Card, Title, Paragraph, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const TodayTaskOpen = props => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCUaMOOcU7-pH99LS6ajo_s1WkDua92H08';
  const [data, setdata] = useState({});
  const [detailIndex, setdetailIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [carChecked, setcarChecked] = useState(false);
  const [bodyChecked, setbodyChecked] = useState(false);
  const taskData = props.route.params.data.DespatchDetails.map(e => e);
  const caseNames = props.route.params.data.DespatchDetails.map(
    e => e.OrderDetails.CaseUserName,
  );
  const [caseStatus, setcaseStatus] = useState(
    props.route.params.data.DespatchDetails.map(e => e.OrderDetails.Status),
  );
  console.log('STATUS', caseStatus);

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

  function handleNextStep() {
    let tempStatus = caseStatus;
    tempStatus[detailIndex] = caseStatus[detailIndex] + 1;
    setcaseStatus(tempStatus);
    setLoading(true);
  }

  if (isLoading) {
    setLoading(false);
    console.log('info screen is loading...');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>LOADING.............</Text>
      </View>
    );
  } else {
    return (
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            margin: '5%',
            paddingBottom:20,
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
                {'個案' +
                  1 +
                  '/' +
                  '陪同' +
                  (taskData[detailIndex].OrderDetails.FamilyWith +
                    taskData[detailIndex].OrderDetails.ForeignFamilyWith)}
              </Text>
            </View>
          </View>
          <View style={styles.predict}>
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
            style={{height: 250, position: 'relative', backgroundColor: 'pink'}}
            contentContainerStyle={StyleSheet.absoluteFillObject}>
            <MapView
              style={styles.map}
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
            buttons={caseNames}
            containerStyle={{
              margin: 0,
              padding: 0,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              alignSelf: 'flex-start',
            }}
            buttonStyle={{margin: 0, padding: 0, alignItems: 'center'}}
            textStyle={{margin: 0, padding: 0}}
          />
          <View style={styles.addr}>
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
          <View style={styles.addr}>
            <Icon
              name="angle-double-down"
              size={30}
              color="orange"
              style={{paddingLeft: 32}}
            />
          </View>
          <View style={styles.addr}>
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
