import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/Main';
import LoginScreen from './LoginScreen';

const App = () => {
	const [logged, setlogged] = useState(false);

	

  async function handleLogin  (res){
    try {
      await AsyncStorage.setItem('userLoginInfo', JSON.stringify(res));
      console.log('SAVED ASYNC',res);
      setlogged(res.success);
    } catch (error) {
      console.log('LOCALSTORAGE WRONG');
      // Error saving data
    }
    //console.log("handel",res);
    
  };

  return (
    <PaperProvider>
    <LoginScreen handleLogin={handleLogin} switchOn={!logged} />
      <NavigationContainer>
        <RootNavigator switchOn={logged}/>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;