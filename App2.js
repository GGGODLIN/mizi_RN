import React, {useState, useEffect} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	Platform,
	Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
	LearnMoreLinks,
	Colors,
	DebugInstructions,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Provider as PaperProvider, Appbar} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {Header} from 'react-native-elements';
import RootNavigator from './src/Main';
import LoginScreen from './LoginScreen';
import codePush from 'react-native-code-push';
import BgTracking from './BgTracking';

import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import messaging from '@react-native-firebase/messaging';

async function registerAppWithFCM() {
	await messaging().registerDeviceForRemoteMessages();
}

const customTextProps = {
	allowFontScaling: false,
	style: {
		fontSize: 16,
		fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto',
		color: 'black',
	},
};

const customTextInputProps = {
	allowFontScaling: false,
};

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);

const App = () => {
	const [logged, setlogged] = useState(false);
	const [logindata, setdata] = useState();
	const _goBack = () => console.log('Went back');

	const _handleSearch = () => console.log('Searching');

	const _handleMore = () => console.log('Shown more');

	async function handleLogin(res,ascAcc,ascPwd) {
		try {
			await AsyncStorage.setItem('userLoginInfo', JSON.stringify(res));
			await AsyncStorage.setItem('ascAcc', ascAcc);
			await AsyncStorage.setItem('ascPwd', ascPwd);
			console.log('SAVED ASYNC', res,ascAcc,ascPwd);
			await setdata(res);
			setlogged(res.success);
		} catch (error) {
			console.log('LOCALSTORAGE WRONG');
			// Error saving data
		}
		//console.log("handel",res);
	}

	async function autoLogging() {
		try {
			const value = await AsyncStorage.getItem('userLoginInfo');
			if (value !== null) {
				var obj_value = JSON.parse(value);
				console.log('BEFORE LOGGING', obj_value);
				setlogged(obj_value.success);
			} else {
				console.log('NOTHING HEHEXD');
			}
		} catch (error) {
			console.log('cannot get ITEM BEFORE LOGGING');
			// Error retrieving data
		}
	}

	async function handleLogout(res) {
		try {
			await AsyncStorage.removeItem('userLoginInfo');
			await AsyncStorage.removeItem('ascAcc');
			await AsyncStorage.removeItem('ascPwd');
			setlogged(res);
		} catch (error) {
			console.log('cannot get ITEM BEFORE LOGGING');
			// Error retrieving data
		}
	}

	useEffect(() => {
		console.log('into EFFECT');
		messaging()
      .getToken()
      .then(token => {
        console.log("TOKEN IS",token);
      });
		const unsubscribe = messaging().onMessage(async remoteMessage => {
			Alert.alert(JSON.stringify(remoteMessage.notification.title), JSON.stringify(remoteMessage.notification.body));
		});

		return messaging().onTokenRefresh(token => {
      console.log("FRESH TOKEN IS",token);
    });
	}, []);

	if (logged) {
		console.log('data?', logindata);
		return (
			<PaperProvider>
				<NavigationContainer>
					<BgTracking DriverId={logindata.response.Cars.DriverId} />
					<RootNavigator
						switchOn={logged}
						logindata={logindata}
						handleLogout={handleLogout}
					/>
				</NavigationContainer>
			</PaperProvider>
		);
	} else {
		console.log('OPEN!', logindata);
		return (
			<PaperProvider>
				<LoginScreen handleLogin={handleLogin} switchOn={!logged} />
			</PaperProvider>
		);
	}
};

export default App;
