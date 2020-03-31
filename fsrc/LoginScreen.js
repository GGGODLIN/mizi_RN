import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
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
    let url = `http://slllcapi.1966.org.tw/api/DriverInfo/DriverLogin?`;
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
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={'height'}
        enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 84}>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled">
          {/*<View style={styles.headerContainer}>
          <Icon color="white" name="search" size={62} />
          <Text style={styles.heading}>Search Bars</Text>
        </View>*/}
          {/*<SearchBar
          placeholder="iOS searchbar"
          platform="ios"
          {...dummySearchBarProps}
        />
        <SearchBar
          placeholder="Android searchbar"
          platform="android"
          {...dummySearchBarProps}
        />
        <SearchBar placeholder="Default searchbar" {...dummySearchBarProps} />*/}
          {/*<View
          style={[
            styles.headerContainer,
            { backgroundColor: '#616389', marginTop: 20 },
          ]}
        >
          <Icon color="white" name="input" size={62} />
          <Text style={styles.heading}>Inputs</Text>
        </View>*/}
          {/*<View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Input
            containerStyle={{ width: '90%' }}
            placeholder="Input with label"
            label="LABEL"
            labelStyle={{ marginTop: 16 }}
          />
          <Input
            containerStyle={styles.inputContainerStyle}
            placeholder="Simple input"
          />
          <Input
            leftIcon={
              <Icon
                name="map-marker"
                type="font-awesome"
                color="#86939e"
                size={25}
              />
            }
            leftIconContainerStyle={{ marginLeft: 0, marginRight: 10 }}
            containerStyle={styles.inputContainerStyle}
            placeholder="Input with left icon"
          />
          <Input
            rightIcon={
              <Icon
                name="chevron-right"
                type="entypo"
                color="#86939e"
                size={25}
              />
            }
            containerStyle={styles.inputContainerStyle}
            placeholder="Input with right icon"
          />
          <Input
            containerStyle={styles.inputContainerStyle}
            placeholder="Input with error message"
            errorMessage="Invalid input"
          />
          <Input
            containerStyle={[styles.inputContainerStyle]}
            placeholder="Shake input"
            ref={ref => (this.shakeInput = ref)}
            rightIcon={
              <Button
                title="Shake"
                onPress={() => this.shakeInput && this.shakeInput.shake()}
              />
            }
            errorMessage="Shake me on error !"
          />
        </View>*/}
          <View style={styles.contentView}>
            <View
              style={{
                backgroundColor: '#F11212',
                width: SCREEN_WIDTH,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 30,
                  marginVertical: 10,
                  fontWeight: '300',
                  marginTop: 10,
                  color: 'white',
                }}>
                Login
              </Text>

              <View style={styles.overlay}>
                <View style={styles.triangleLeft} />
                <Input
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderLeftWidth: 0,
                    height: 50,
                    width: SCREEN_WIDTH - 80,
                    backgroundColor: 'white',
                  }}
                  containerStyle={{paddingHorizontal: 0}}
                  placeholder="請輸入帳號 (預設為手機號碼)"
                  placeholderTextColor="gray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance="light"
                  keyboardType="email-address"
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

            <ThemeProvider
              theme={{
                Input: {
                  containerStyle: {
                    width: SCREEN_WIDTH - 50,
                  },
                  inputContainerStyle: {
                    borderRadius: 40,
                    borderWidth: 1,
                    borderColor: 'rgba(110, 120, 170, 1)',
                    height: 50,
                    marginVertical: 10,
                  },
                  placeholderTextColor: 'rgba(110, 120, 170, 1)',
                  inputStyle: {
                    marginLeft: 10,
                    color: 'white',
                  },
                  keyboardAppearance: 'light',
                  blurOnSubmit: false,
                },
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(46, 50, 72, 1)',
                  width: SCREEN_WIDTH,
                  alignItems: 'center',
                  paddingBottom: 30,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 30,
                    marginVertical: 10,
                    fontWeight: '300',
                  }}>
                  Sign up
                </Text>
                <Input
                  leftIcon={
                    <Icon
                      name="user"
                      type="simple-line-icon"
                      color="rgba(110, 120, 170, 1)"
                      size={25}
                    />
                  }
                  placeholder="Username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  ref={input => (this.usernameInput = input)}
                  onSubmitEditing={() => {
                    this.email2Input.focus();
                  }}
                />
                <Input
                  leftIcon={
                    <Icon
                      name="email-outline"
                      type="material-community"
                      color="rgba(110, 120, 170, 1)"
                      size={25}
                    />
                  }
                  placeholder="Email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  ref={input => (this.email2Input = input)}
                  onSubmitEditing={() => {
                    this.password2Input.focus();
                  }}
                />
                <Input
                  leftIcon={
                    <Icon
                      name="lock"
                      type="simple-line-icon"
                      color="rgba(110, 120, 170, 1)"
                      size={25}
                    />
                  }
                  placeholder="Password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  ref={input => (this.password2Input = input)}
                  onSubmitEditing={() => {
                    this.confirmPassword2Input.focus();
                  }}
                />
                <Input
                  leftIcon={
                    <Icon
                      name="lock"
                      type="simple-line-icon"
                      color="rgba(110, 120, 170, 1)"
                      size={25}
                    />
                  }
                  placeholder="Confirm Password"
                  autoCapitalize="none"
                  keyboardAppearance="light"
                  secureTextEntry={true}
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="done"
                  ref={input => (this.confirmPassword2Input = input)}
                  blurOnSubmit
                />
              </View>
            </ThemeProvider>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#B46486',
  },
  heading: {
    color: 'white',
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentView: {
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
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default LoginScreen;
