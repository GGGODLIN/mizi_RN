// file.js
import RNFS from 'react-native-fs';

import {Platform} from 'react-native';

// 文件路径
//const defaultPath =(Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath) ;
const defaultPath ='file:///storage/emulated/0/Android/data/com.nantou/files/Pictures/saved_signature/';
//const destPath = defaultPath + '/Pictures/saved_signature';
const destPath = 'file:///storage/emulated/0/Android/data/com.nantou/files/Pictures/saved_signature/';
const testPath =
  'file:///storage/emulated/0/Android/data/com.nantou/files/Pictures/saved_signature/';

class FileUtil {
  // 向文件中添加内容
  async appendFile(data, path) {
    const jsonStr = JSON.stringify(data);
    return await RNFS.appendFile(path, splitStr + jsonStr, 'utf8')
      .then(success => {
        console.log('FILE APPEND SUCCESS');
        return success;
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  // 判断文件是否存在
  isExistFile = async (filePath, cb) => {
    return await RNFS.exists(filePath).then(res => {
      console.log('isExists, ' + res);
      cb && cb(res);
      return res;
    });
  };

  // 读取文件
  async readFile(filePath, name, successCallback, failCallback) {
    const isExists = await this.isExistFile(filePath);
    if (!isExists) return;

    return await RNFS.readFile(filePath, 'utf8')
      .then(result => {
        // Alert.alert(result)
        // console.log('=================file read start===================')
        const res =
          result.indexOf(splitStr) > -1 ? result.split(splitStr) : [result];

        // console.log(res)
        // console.log('=================file read end===================')
        // console.log(res.length, JSON.parse(res[0], 'ppppp'))
        for (let i = 0, len = res.length; i < len; i++) {
          res[i] = JSON.parse(res[i]);
        }
        // console.log(res[2])

        successCallback && successCallback(result);
        return {
          name,
          content: res,
        };
      })
      .catch(err => {
        failCallback && failCallback(err.message);
      });
  }

  // 读取目录
  async readDir() {
    // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    const res = await RNFS.readDir(defaultPath)
      .then(result => {
        const resP = [];
        if (result && result.length > 0) {
          result = result.filter(item => item.isFile());
          for (let i = 0, len = result.length; i < len; i++) {
            resP[i] = result[i].path;
            //resP[i] = this.readFile(result[i].path, result[i].name);
          }
        }
        console.log("resP",resP);
        return Promise.all(resP);
      })
      .then(statResult => {
        console.log("statResult?",statResult);
        return statResult;
      })
      .catch(err => {
        console.log(err.message, err.code);
      });

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(res, 'end of read');
    return res;
  }

  // 读取目录
  readDir1() {
    console.log('PATH???????????????', testPath);
    RNFS.readDir(testPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        console.log('GOT RESULT', result);
        console.log('++++++++++++++++++++++++++++++++++++++++');
        console.log(result.length);
        console.log('================================================');

        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then(statResult => {
        console.log(statResult);
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }

        return 'no file';
      })
      .then(contents => {
        // log the file contents
        console.log('=======================================================');
        console.log(contents, 'content');
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  }
  // 删除文件
  async deleteFile(filePath) {
    const path = filePath || defaultPath;
    const res = await RNFS.unlink(path)
      .then(() => {
        console.log('FILE DELETED');
      })
      .catch(err => {
        console.log(err.message);
      });
    return res;
  }
  getPath() {
    return 'file://'.concat(destPath);
  }
  // 判断文件路径是否存在
  isFilePathExists(successCallback) {
    RNFS.exists(destPath)
      .then(value => {
        successCallback(value);
      })
      .catch(err => {
        console.log(err.message);
      });
  }
  // 复制文件
  copyFile() {
    RNFS.copyFile(defaultPath, destPath)
      .then(() => {
        console.log('COPY FILE SUCCESSED');
      })
      .catch(err => {
        console.log('copyFile Failed', err.message);
      });
  }
  // 移动文件
  moveFile() {
    RNFS.moveFile(defaultPath, destPath)
      .then(() => {
        console.log('moveFIle Success');
      })
      .catch(err => {
        console.log('moveFile failed', err);
      });
  }
  /*创建目录*/
  async mkDir() {
    const options = {
      NSURLIsExcludedFromBackupKey: true, // iOS only
    };

    return await RNFS.mkdir(defaultPath, options)
      .then(res => {
        console.log('MKDIR success', res);
        return true;
      })
      .catch(err => {
        console.log('err', err);
      });
  }
}

const instance = new FileUtil();

export default instance;
