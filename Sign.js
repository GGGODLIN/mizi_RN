/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

var React = require('react');
var ReactNative = require('react-native');

var {Component} = React;

var {AppRegistry, StyleSheet, Text, View, TouchableHighlight,Alert} = ReactNative;

import SignatureCapture from 'react-native-signature-capture';

class RNSignatureExample extends Component {
    constructor(props) {
    super(props);
    this.state = {isDragged: false};
    console.log(this.props.handleSavePic);
    this._onSaveEvent = this._onSaveEvent.bind(this);
    this._onDragEvent = this._onDragEvent.bind(this);
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log(result);
    this.setState({isDragged: false});
    this.props.handleSavePic(result);
  }
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{alignItems: 'center', justifyContent: 'center'}}>
          請在此處簽名
        </Text>
        <SignatureCapture
          style={[{flex: 1}, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={'portrait'}
          fileName={`${this.props.name}.png`}
        />

        <View style={{flex: 1, flexDirection: 'row'}}>
          

          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.resetSign();
            }}>
            <Text>清除</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.saveSign();
            }}>
            <Text>完成</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  saveSign() {
    if (this.state.isDragged){
      this.refs['sign'].saveImage();
    }
    else{
      Alert.alert('請在簽完名後再按完成', ' ', [
              {
                text: '確定',
                onPress: () => {},
              },
            ]);
    }
  }

  resetSign() {
    this.refs['sign'].resetImage();
    this.setState({isDragged: false});
    console.log('resetSign');
  }

  _onDragEvent() {
    // This callback will be called when the user enters signature
    this.setState({isDragged: true});
    console.log('dragged');
  }
}

const styles = StyleSheet.create({
  signature: {
    flex: 5,
    borderColor: '#000033',
    borderWidth: 1,
    width:'100%'
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#eeeeee',
    margin: 10,
  },
});

export default RNSignatureExample;
