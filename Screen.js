/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect, Component } from 'react';
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

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ThemeProvider, Avatar } from 'react-native-elements';
import { Button, Card, Title, Paragraph } from 'react-native-paper';

export default class Screen extends Component {

    constructor(props) {
        super(props);
        console.log("PROPS IS", props);


        this.state = {
            data: props.data,
            loading: props.loading

        };
        this.checkTodayScreen = this.checkTodayScreen.bind(this);
        this.infoScreen = this.infoScreen.bind(this);
        this.LoadingScreen = this.LoadingScreen.bind(this);
        this.taskTodayScreen = this.taskTodayScreen.bind(this);
    }

    infoScreen({ route, navigation }) {
        const infoData = this.props.data.response;
        console.log("PIC IS", infoData.Pic);
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
    <Card>
    <Card.Title title={infoData.DriverName} subtitle={"Card Subtitle" }left={(props) => <Avatar
  rounded
  size = "medium"
  source={{uri: this.props.data.response.Pic}}
/>} />
    <Card.Content>
      <Title>Card title</Title>
      <Paragraph>Card content</Paragraph>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
   </ScrollView>


        );
    }

    LoadingScreen({ route, navigation }) {
        console.log("LOADING PAGE");

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>LOADING.............</Text>
    </View>
        );
    }

    checkTodayScreen({ route, navigation, props }) {
        console.log("CHECK", navigation);
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
        );
    }
    taskTodayScreen({ route, navigation, props }) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>taskToday!</Text>
    </View>
        );
    }


    render() {
        const Tab = createBottomTabNavigator();
        var isload = this.props.loading.lodingOrNot;
        console.log("ARE U LOADING?", isload);
        if (!isload) {
            return (
                <NavigationContainer>
      <Tab.Navigator initialRouteName="今日任務" activeColor="#f0edf6" inactiveColor="black" barStyle={{ backgroundColor: '#694fad' }}>
        <Tab.Screen name="基本資料" component={this.infoScreen} />
        <Tab.Screen name="每日檢查" component={this.checkTodayScreen} />
        <Tab.Screen name="今日任務" component={this.taskTodayScreen} />
        <Tab.Screen name="聯繫行控" component={this.infoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
            );
        } else {
            return (
                <NavigationContainer>
      <Tab.Navigator initialRouteName="今日任務" activeColor="#f0edf6" inactiveColor="black" barStyle={{ backgroundColor: '#694fad' }}>
        <Tab.Screen name="Loading" component={this.LoadingScreen} />
      </Tab.Navigator>
    </NavigationContainer>

            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000'
    }
});