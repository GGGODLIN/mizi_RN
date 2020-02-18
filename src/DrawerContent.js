import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DrawerContent(props) {
  const data =props.logindata;
  console.log("DRAW LOGOUT",props.handleLogout);

  if (0) {
    return null;
  } else {
    return (
      <View style={styles.drawerContent}>
        <View style={styles.infoContent}>
          <View style={styles.userInfoSection}>
            <Avatar.Image
              source={{
                uri: data.response.Pic,
              }}
              size={64}
            />
            <View style={styles.userInfoText}>
              <View style={styles.row}>
                <Title style={styles.title}>{data.response.DriverName}</Title>
                <Button
                  color="red"
                  labelStyle={{color: 'orange'}}
                  mode="text"
                  onPress={() => console.log('Pressed')}>
                  編輯
                </Button>
              </View>
              <Title style={styles.title}>{data.response.Cars.CarNo}</Title>
              <Title style={styles.subtitle}>{data.response.CompanyName}</Title>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSectionRow}>
            <Button
              color="white"
              style={{
                marginVertical: 8,
                marginHorizontal: 16,
                paddingHorizontal: 8,
                borderRadius: 50,
                borderColor: 'white',
              }}
              labelStyle={{color: 'white'}}
              mode="outlined"
              onPress={() => {props.handleLogout()}}>
              登出
            </Button>
            <Button
              style={{
                marginVertical: 8,
                marginHorizontal: 16,
                paddingHorizontal: 8,
                borderRadius: 50,
                backgroundColor: 'orange',
              }}
              labelStyle={{color: 'black'}}
              mode="outlined"
              onPress={() =>
                props.navigation.navigate('Home', {
                  screen: '基本資料',
                })
              }>
              基本資料
            </Button>
          </Drawer.Section>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <Button
            color="red"
            labelStyle={{color: 'black'}}
            contentStyle={{width: '100%', padding: 10}}
            mode="text"
            onPress={() => console.log('Pressed')}>
            接送任務清單
          </Button>
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <Button
            color="red"
            labelStyle={{color: 'black'}}
            contentStyle={{width: '100%', padding: 10}}
            mode="text"
            onPress={() => console.log('Pressed')}>
            司機教育學院
          </Button>
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <Button
            color="red"
            labelStyle={{color: 'black'}}
            contentStyle={{width: '100%', padding: 10}}
            mode="text"
            onPress={() =>
              props.navigation.navigate('Home', {
                screen: '每日檢查',
                params: {
                  screen: 'CarCheckScreen',
                },
              })
            }>
            每日車況檢查
          </Button>
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <Button
            color="red"
            labelStyle={{color: 'black'}}
            contentStyle={{width: '100%', padding: 10}}
            mode="text"
            onPress={() =>
              props.navigation.navigate('Home', {
                screen: '每日檢查',
                params: {
                  screen: 'BodyCheckScreen',
                },
              })
            }>
            身心狀況檢查
          </Button>
        </Drawer.Section>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    alignItems: 'stretch',

    margin: 0,
    padding: 0,
    borderWidth: 0,
    top: 0,
  },
  infoContent: {
    backgroundColor: '#3C4856',
    margin: 0,
    padding: 0,
    borderWidth: 0,
    top: 0,
    alignItems: 'stretch',
  },
  userInfoSection: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',

    margin: 0,
    padding: 0,
    borderWidth: 0,
    top: 0,
  },
  userInfoText: {
    paddingLeft: 10,
    padding: 20,

    flexShrink: 1,
  },
  title: {
    marginTop: 0,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    paddingRight: 0,
    fontSize: 14,
    lineHeight: 16,
    color: 'white',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    justifyContent: 'center',
    alignItems: 'stretch',

    margin: 0,
    padding: 0,
    borderWidth: 0,
    top: 0,
  },
  drawerSectionRow: {
    flexShrink: 1,
    margin: 0,
    paddingBottom: 10,
    borderWidth: 0,
    top: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
