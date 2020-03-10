import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Signature from 'react-native-signature-canvas';
import FileUtil from './FileUtil';
import RNFS from 'react-native-fs';

import {Platform} from 'react-native';

// 文件路径
const defaultPath =(Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath) ;

export default class SignatureScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        signature: null,
        signpath: null,
        number:0,
        
    };
  }

  handleSignature = async (signature) => {
      console.log('PATH IS',signature);
      await FileUtil.writeFile(signature,`${this.props.name}.png`).then((res)=>{
                                                                        console.log('DONE?',res);
                                                                        this.setState({ signpath: res, });
                                                                        this.props.handleSavePic(res);
                                                                        });
    this.setState({ signature });
      this.setState({ number:this.state.number+1, });
      
  };

  handleEmpty = () => {
    console.log('Empty');
  }

  render() {
    const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;
    return (
      <View style={{ flex: 1 }}>
        
        <Signature
          onOK={this.handleSignature}
          onEmpty={this.handleEmpty}
          descriptionText='請在此簽名'
          clearText="清除"
          confirmText="完成"
          webStyle={style}
          
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10
  }
});
