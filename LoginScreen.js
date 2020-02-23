import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  Input,
  SearchBar,
  Icon,
  Button,
  ThemeProvider,
} from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;

const dummySearchBarProps = {
  showLoading: true,
  onFocus: () => console.log('focus'),
  onBlur: () => console.log('blur'),
  onCancel: () => console.log('cancel'),
  onClear: () => console.log('cleared'),
  onChangeText: text => console.log('text:', text),
};

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {res: {}};
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin = async () => {
    let url = `http://wheathwaapi.vielife.com.tw/api/DriverInfo/DriverLogin?`;
    let query = `acc=${this.emailInput.input._lastNativeText}`;
    let query2 = `pwd=${this.passwordInput.input._lastNativeText}`;
    url += query + '&' + query2;

    console.log(`Making LOGGING request to: ${url}`);

    const data = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('LOGGING AJAX', res.success);
        this.props.handleLogin(res);
      });
  };

  render() {
    if (!this.props.switchOn) {
      return null;
    }
    let width = Dimensions.get('window').width;
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={'height'}
        enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 10}>
        <View style={{flex: 0.2, backgroundColor: 'transparent'}}>
          <Image
            style={{
              height: width * 1.2,
              width: width * 1.2,
              position: 'absolute',
              top: -width * 0.3,
              left: -width * 0.1,
              borderRadius: 500,
            }}
            source={require('./img/dweffcopy1.png')}
          />
        </View>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled">
          <View style={styles.contentView}>
            <View
              style={{
                borderRadius: 20,
                backgroundColor: 'white',
                width: SCREEN_WIDTH,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 40,
                  marginVertical: 10,
                  fontWeight: 'bold',
                  marginTop: 10,
                  color: '#F57A00',
                  borderRadius: 20,
                }}>
                Login
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 10,
                  fontWeight: 'bold',

                  color: '#F57A00',
                  borderRadius: 20,
                }}>
                司機登入
              </Text>

              <View style={styles.overlay}>
                <View style={styles.triangleLeft} />
                <Input
                  label="User"
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderLeftWidth: 0,
                    height: 50,
                    width: SCREEN_WIDTH - 80,
                    backgroundColor: 'white',
                    marginBottom: 10,
                  }}
                  underlineColorAndroid='gray'
                  containerStyle={{paddingHorizontal: 0}}
                  placeholder="請輸入帳號 (預設為手機號碼)"
                  placeholderTextColor="gray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance="light"
                  keyboardType="default"
                  returnKeyType="next"
                  ref={input => (this.emailInput = input)}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                    console.log(
                      'ACC INPUT',
                      this.emailInput.input._lastNativeText,
                    );
                  }}
                  blurOnSubmit={false}
                />
                <View style={styles.triangleRight} />
              </View>

              <View style={[styles.overlay, {marginBottom: 30, marginTop: 1}]}>
                <View style={styles.triangleLeft} />
                <Input
                  label="Password"
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderLeftWidth: 0,
                    height: 50,
                    width: SCREEN_WIDTH - 80,
                    backgroundColor: 'white',
                  }}
                  containerStyle={{paddingHorizontal: 0}}
                  placeholder="請輸入密碼 (預設為身分證後4碼)"
                  underlineColorAndroid='gray'
                  placeholderTextColor="gray"
                  autoCapitalize="none"
                  keyboardAppearance="light"
                  secureTextEntry={true}
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="done"
                  ref={input => (this.passwordInput = input)}
                  onSubmitEditing={() => {
                    console.log(
                      'PWD INPUT',
                      this.passwordInput.input._lastNativeText,
                    );
                    this.handleLogin();
                  }}
                  blurOnSubmit={true}
                />
                <View style={styles.triangleRight} />
              </View>
            </View>
          </View>
          <Button
            title="司機端登入  LOGIN"
            buttonStyle={{
              width: '70%',
              alignSelf: 'center',
              backgroundColor: 'orange',
              borderRadius:50,
            }}
            type="solid"
            onPress={() => {this.handleLogin()}}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 0.5,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: '10%',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    backgroundColor: '#B46486',
  },
  heading: {
    color: 'white',
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    borderRadius: 20,
  },
  contentView: {
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangleLeft: {
    position: 'absolute',
    left: -20,
    bottom: 0,
    width: 0,
    height: 0,
    borderRightWidth: 20,
    borderRightColor: 'white',
    borderBottomWidth: 25,
    borderBottomColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: 'transparent',
  },
  triangleRight: {
    position: 'absolute',
    right: -20,
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderLeftColor: 'white',
    borderBottomWidth: 25,
    borderBottomColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: 'transparent',
  },
  inputContainerStyle: {
    marginTop: 16,
    width: '90%',
    borderRadius: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#E5E5E5',
  },
});

export default LoginScreen;
