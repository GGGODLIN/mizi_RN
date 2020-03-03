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
  Alert,
} from 'react-native';
import {
  Input,
  SearchBar,
  Icon,
  ThemeProvider,
  Overlay,
  Button,
} from 'react-native-elements';

import {Divider, TextInput} from 'react-native-paper';
import {request, PERMISSIONS} from 'react-native-permissions';
import CountdownCircle from 'react-native-countdown-circle';
import codePush from 'react-native-code-push';



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

    this.state = {
      res: {},
      showOverlay1: false,
      showOverlay2: false,
      showOverlay3: false,
      input1: '0',
      input2: '0',
      input3: '0',
      timeUp: false,
      countDownTime: 5,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSendAcc = this.handleSendAcc.bind(this);
    this.handleSendVCode = this.handleSendVCode.bind(this);
    this.handleSendNewPwd = this.handleSendNewPwd.bind(this);

    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
      .then(result => {
        console.log('PERMISSION?', result);
      })
      .then(() => {
        request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
          .then(result => {
            console.log('PERMISSION2?', result);
          })
          .then(() => {
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
              console.log('PERMISSION3?', result);
            });
          });
      });
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

  handleSendAcc = async () => {
    let url = `http://wheathwaapi.vielife.com.tw/api/DriverInfo/PushPhoneMessage?phoneNum=${
      this.state.input1
    }`;

    console.log(`Making SendAcc request to: ${url}`);

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('SendAcc AJAX', res);
        if (res.success) {
          this.setState((prevState, props) => ({
            showOverlay1: false,
            showOverlay2: true,
            showOverlay3: false,
            timeUp: false,
            countDownTime: prevState.countDownTime + 1,
          }));
        } else {
          Alert.alert(res.msg, ' ', [
            {
              text: '確定',
              onPress: () => {},
            },
          ]);
        }
      })
      .catch(err => console.log('ERROR?0', err));
  };

  handleSendVCode = async () => {
    let url = `http://wheathwaapi.vielife.com.tw/api/DriverInfo/CheckPhoneCode?phoneNum=${
      this.state.input1
    }&vCode=${this.state.input2}`;

    console.log(`Making SendVCode request to: ${url}`);

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('SendAcc AJAX', res);
        if (res.success) {
          this.setState({
            showOverlay1: false,
            showOverlay2: false,
            showOverlay3: true,
          });
        } else {
          Alert.alert(res.msg, '  ', [
            {
              text: '確定',
              onPress: () => {},
            },
          ]);
        }
      })
      .catch(err => console.log('ERROR?1', err));
  };

  handleSendNewPwd = async () => {
    let url = `http://wheathwaapi.vielife.com.tw/api/DriverInfo/PutForgetPassword?cAccount=${
      this.state.input1
    }&cPassword=${this.state.input3}`;

    console.log(`Making SendNewPwd request to: ${url}`);

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('SendAcc AJAX', res);
        if (res.success) {
          this.setState({
            showOverlay1: false,
            showOverlay2: false,
            showOverlay3: false,
          });
          Alert.alert('修改密碼完成！', '請用新密碼重新登入', [
            {
              text: '確定',
              onPress: () => {},
            },
          ]);
        } else {
          Alert.alert(res.msg, '  ', [
            {
              text: '確定',
              onPress: () => {},
            },
          ]);
        }
      })
      .catch(err => console.log('ERROR?2', err));
  };

  render() {
    if (!this.props.switchOn) {
      return null;
    }
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={'height'}
        enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 10}>
        <Overlay
          onBackdropPress={() => {
            this.setState({
              showOverlay1: false,
              showOverlay2: false,
              showOverlay3: false,
              input1: '0',
              input2: '0',
              input3: '0',
              timeUp: false,
              countDownTime: 5,
            });
          }}
          isVisible={this.state.showOverlay1}
          windowBackgroundColor="rgba(255, 255, 255, .8)"
          overlayBackgroundColor="white"
          width="90%"
          height="auto">
          <Text
            style={{
              backgroundColor: 'orange',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              padding: 10,
              marginBottom: 10,
            }}>
            忘記密碼
          </Text>
          <TextInput
            keyboardType="email-address"
            mode="outlined"
            dense={true}
            placeholder="請輸入帳號(預設為手機號碼)"
            style={{width: '100%'}}
            onChangeText={text => {
              this.setState({
                input1: text,
              });
            }}
          />
          <Button
            title="下一步"
            buttonStyle={{
              width: '70%',
              alignSelf: 'center',
              backgroundColor: 'orange',
              borderRadius: 50,
              marginVertical: 20,
            }}
            type="solid"
            onPress={() => {
              this.handleSendAcc();
            }}
          />
        </Overlay>
        <Overlay
          onBackdropPress={() => {
            this.setState({
              showOverlay1: false,
              showOverlay2: false,
              showOverlay3: false,
              input1: '0',
              input2: '0',
              input3: '0',
              timeUp: false,
              countDownTime: 5,
            });
          }}
          isVisible={this.state.showOverlay2}
          windowBackgroundColor="rgba(255, 255, 255, .8)"
          overlayBackgroundColor="white"
          width="90%"
          height="auto">
          <Text
            style={{
              backgroundColor: 'orange',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              padding: 10,
              marginBottom: 10,
            }}>
            已寄驗證碼至您的手機號碼
          </Text>
          <TextInput
            keyboardType="email-address"
            mode="outlined"
            dense={true}
            placeholder="請輸入驗證碼"
            style={{width: '100%'}}
            onChangeText={text => {
              this.setState({
                input2: text,
              });
            }}
          />
          <Button
            icon={
              <CountdownCircle
                seconds={this.state.countDownTime}
                radius={this.state.timeUp ? 0 : 15}
                borderWidth={4}
                color="#ff003f"
                textStyle={{fontSize: 15}}
                onTimeElapsed={() => {
                  this.setState({
                    timeUp: true,
                  });
                }}
              />
            }
            iconRight
            disabled={this.state.timeUp ? false : true}
            title="重寄驗證碼 "
            buttonStyle={{
              width: '70%',
              alignSelf: 'center',
              backgroundColor: 'orange',
              borderRadius: 50,
              marginTop: 20,
            }}
            type="solid"
            onPress={() => {
              this.handleSendAcc();
            }}
          />
          <Button
            title="下一步"
            buttonStyle={{
              width: '70%',
              alignSelf: 'center',
              backgroundColor: 'orange',
              borderRadius: 50,
              marginVertical: 20,
            }}
            type="solid"
            onPress={() => {
              this.handleSendVCode();
            }}
          />
        </Overlay>

        <Overlay
          onBackdropPress={() => {
            this.setState({
              showOverlay1: false,
              showOverlay2: false,
              showOverlay3: false,
              input1: '0',
              input2: '0',
              input3: '0',
              timeUp: false,
              countDownTime: 5,
            });
          }}
          isVisible={this.state.showOverlay3}
          windowBackgroundColor="rgba(255, 255, 255, .8)"
          overlayBackgroundColor="white"
          width="90%"
          height="auto">
          <Text
            style={{
              backgroundColor: 'orange',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              padding: 10,
              marginBottom: 10,
            }}>
            驗證完成，請輸入新密碼:
          </Text>
          <TextInput
            keyboardType="email-address"
            mode="outlined"
            dense={true}
            placeholder="請輸入新密碼"
            style={{width: '100%'}}
            onChangeText={text => {
              this.setState({
                input3: text,
              });
            }}
          />
          <Button
            title="確定修改"
            buttonStyle={{
              width: '70%',
              alignSelf: 'center',
              backgroundColor: 'orange',
              borderRadius: 50,
              marginVertical: 20,
            }}
            type="solid"
            onPress={() => {
              this.handleSendNewPwd();
            }}
          />
        </Overlay>

        <View style={{flex: 0.3, backgroundColor: 'transparent'}}>
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
                borderRadius: 100,
                backgroundColor: 'white',
                width: SCREEN_WIDTH,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 40,
                  marginVertical: 10,
                  fontWeight: 'bold',
                  marginTop: 20,
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

                  color: 'orange',
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
                    width: '85%',
                    backgroundColor: 'white',
                    marginBottom: 10,
                  }}
                  underlineColorAndroid="gray"
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
                    width: '85%',
                    backgroundColor: 'white',
                  }}
                  containerStyle={{paddingHorizontal: 0}}
                  placeholder="請輸入密碼(預設為身分證後4碼)"
                  underlineColorAndroid="gray"
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
                <Button
                  title="忘記密碼?"
                  buttonStyle={{
                    width: '50%',
                    alignSelf: 'flex-end',

                    borderRadius: 50,
                  }}
                  type="outline"
                  onPress={() => {
                    this.setState({
                      showOverlay1: true,
                    });
                  }}
                />
              </View>
            </View>
          </View>

          <Button
            title="司機端登入  LOGIN"
            buttonStyle={{
              width: '70%',
              alignSelf: 'center',
              backgroundColor: 'orange',
              borderRadius: 50,
              marginBottom: 20,
            }}
            type="solid"
            onPress={() => {
              this.handleLogin();
            }}
          />
        </ScrollView>
        <View
          style={{
            flex: 0,
            backgroundColor: 'transparent',
            alignItems: 'center',
          }}>
          <Image
            style={{
              position: 'absolute',
              top: -height * 0.9,
              borderColor: 'white',
              borderRadius: 500,
              borderWidth: 10,
            }}
            source={require('./img/Logo.png')}
          />
        </View>
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
LoginScreen = codePush({
  updateDialog: {
    title: '版本更新!',
    descriptionPrefix: '版本號',
    optionalUpdateMessage: 'APP有新版本，是否更新?',
    optionalIgnoreButtonLabel: '下次再說',
    optionalInstallButtonLabel: '立馬安裝',
  },
  installMode: codePush.InstallMode.IMMEDIATE,
})(LoginScreen);
export default LoginScreen;
