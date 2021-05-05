/* eslint-disable no-underscore-dangle */
import { ActionSheet, ActivityIndicator, Modal, Slider } from '@ant-design/react-native';
import * as Base64 from 'Base64';
import { connect, routerRedux } from 'dva';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import * as Speech from 'expo-speech';
import iconv from 'iconv-lite';
import { detect } from 'jschardet';
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import CallDetectorManager from 'react-native-call-detection';
import Device from '../../constants/Device';
import Links from '../../constants/Links';
import themes from '../../themes';

@connect(({ home, loading, setting }) => ({
  setting,
  currentBook: home.currentBook,
  booksLoading: loading.effects['home/openBook'],
}))

export default class BookViewer extends React.Component {
  state = {
    speechPage: null,
    currentPage: '',
    nextPage: '',
    position: -1,
    nextPosition: -1,
    isSpeaking: false,
    modalVisible: false,
    loading: true,
    cacheLoading: false,
    encoding: null,
  };

  componentDidMount() {
    activateKeepAwake();
    // MusicControl.enableBackgroundMode(true);
    const { params } = this.props.match;
    if (params?.id) {
      this.props.dispatch({
        type: 'home/openBook',
        id: params.id,
      });
    } else {
      this.props.dispatch(routerRedux.push(Links.HOME));
    }
    this.callDetector = new CallDetectorManager(
      (event, phoneNumber) => {
        // For iOS event will be either "Connected",
        // "Disconnected","Dialing" and "Incoming"

        // For Android event will be either "Offhook",
        // "Disconnected", "Incoming" or "Missed"
        // phoneNumber should store caller/called number
        if (event === 'Disconnected') {
          // Do something call got disconnected
        } else if (event === 'Connected') {
          // Do something call got connected
          // This clause will only be executed for iOS
          // 来电话时暂停朗读
          this.stopSpeak();
        } else if (event === 'Incoming') {
          // Do something call got incoming
        } else if (event === 'Dialing') {
          // Do something call got dialing
          // This clause will only be executed for iOS
          // 来电话时暂停朗读
          this.stopSpeak();
        } else if (event === 'Offhook') {
          // Device call state: Off-hook.
          // At least one call exists that is dialing,
          // active, or on hold,
          // and no calls are ringing or waiting.
          // This clause will only be executed for Android
          // 来电话时暂停朗读
          this.stopSpeak();
        } else if (event === 'Missed') {
          // Do something call got missed
          // This clause will only be executed for Android
        }
      },
      false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    );
  }

  componentWillUnmount() {
    deactivateKeepAwake();
    Speech.stop();
    this.props.dispatch({
      type: 'home/clearCurrentBook',
    });
    this.callDetector && this.callDetector.dispose();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.currentPage !== this.state.currentPage && !this.state.loading) {
      this.startSpeak();
    }
  }

  async UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const { currentBook } = nextProps;
    if (currentBook?.uri && currentBook?.position !== this.state.position) {
      this.setState({
        position: currentBook?.position ?? 0,
        nextPosition: currentBook?.position ?? 0,
        loading: true,
        currentPage: await this.loadBook(currentBook?.position ?? 0),
      });
    }
  }

  loadBook = async (position = 0) => {
    const { currentBook } = this.props;
    if (currentBook?.uri) {
      const base64Context = await FileSystem.readAsStringAsync(currentBook.uri, {
        encoding: FileSystem.EncodingType.Base64,
        position,
        length: 2048,
      });
      const context = Base64.atob(base64Context);
      iconv.skipDecodeWarning = true;
      let txtEncoding = this.state.encoding;
      if (!txtEncoding) {
        const { encoding } = detect(context);
        this.setState({
          encoding,
        });
        txtEncoding = encoding ?? 'utf-8';
      }

      const utf8Context = iconv.decode(context, txtEncoding);

      return utf8Context;
    }
    return null;
  };

  showActionSheet = async () => {
    const { position } = this.state;
    const { currentBook } = this.props;
    const percent = Math.round((position / currentBook.size) * 10000) / 100;
    let BUTTONS = [];
    const isSpeaking = await Speech.isSpeakingAsync();
    if (!isSpeaking) {
      BUTTONS = [
        '播放',
        '跳转',
        '取消',
      ];
    } else {
      BUTTONS = [
        '停止',
        '跳转',
        '取消',
      ];
    }
    ActionSheet.showActionSheetWithOptions(
      {
        title: `当前进度${percent}%`,
        options: BUTTONS,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          if (isSpeaking) {
            this._speak = false;
            Speech.stop();
          } else {
            this._speak = true;
            this.startSpeak();
          }
        } else if (buttonIndex === 1) {
          this.setState({ modalVisible: true });
        }
      },
    );
  };

  checkPosition = async (position) => {
    const { currentBook } = this.props;
    if (currentBook?.uri) {
      const base64Context = await FileSystem.readAsStringAsync(currentBook.uri, {
        encoding: FileSystem.EncodingType.Base64,
        position,
        length: 32,
      });
      const context = Base64.atob(base64Context);
      iconv.skipDecodeWarning = true;
      const { encoding } = detect(context);
      return encoding !== null;
    }
    return false;
  };

  touchScreen = ({ nativeEvent: { locationY } }) => {
    Speech.stop();
    if (locationY > (Device.height / 2)) {
      this.goNextPage();
    } else {
      this.goPreviousPage().then();
    }
  };

  goPreviousPage = async () => {
    const { position, nextPosition } = this.state;
    if (position > 0) {
      const length = nextPosition - position;
      let newPosition = position > length ? position - length : 0;
      // eslint-disable-next-line no-await-in-loop
      while (newPosition > 0 && await this.checkPosition(newPosition) !== true) {
        newPosition -= 1;
      }
      this.loadBook(newPosition).then((currentPage) => {
        this.setState({
          loading: true,
          currentPage,
          position: newPosition,
        });
        this.props.dispatch({
          type: 'home/changeBookPosition',
          position: newPosition,
        });
      });
    }
  };

  goNextPage = () => {
    const { nextPosition, nextPage } = this.state;
    if (nextPosition < this.props.currentBook?.size) {
      this.setState({
        loading: true,
        currentPage: nextPage,
        position: nextPosition,
      });
      this.props.dispatch({
        type: 'home/changeBookPosition',
        position: nextPosition,
      });
    }
  };

  onSpeakComplete = () => {
    const { currentPage, speechPage, nextPage } = this.state;
    if (this._speak && speechPage === currentPage && speechPage !== nextPage) {
      console.log('BookViewer-onSpeakComplete-253:', '使用缓存');
      this.startSpeak(true);
    }
    this.goNextPage();
  };

  startSpeak = (usingCache) => {
    const { currentPage, nextPage, speechPage } = this.state;
    const { speakPitch, speakRate } = this.props.setting;

    if (this._speak) {
      let speechText = currentPage;

      if (usingCache && nextPage !== speechPage) {
        speechText = nextPage;
      }

      Speech.speak(speechText, {
        pitch: speakPitch,
        rate: speakRate,
        onDone: this.onSpeakComplete,
      });
      this.setState({
        speechPage: speechText,
      });
    }
  };

  stopSpeak = () => {
    if (this._speak) {
      Speech.stop();
      this._speak = false;
    }
  };

  changePercent = (percent) => {
    const newPosition = Math.floor(percent / 100 * this.props.currentBook.size);
    this.loadBook(newPosition).then((currentPage) => {
      this.setState({
        loading: true,
        currentPage,
        position: newPosition,
      });
      this.props.dispatch({
        type: 'home/changeBookPosition',
        position: newPosition,
      });
    });
  };

  onTextLayout = async ({ nativeEvent: { lines } }) => {
    if (this.state.loading && lines.length > 1) {
      const maxHeight = Device.height - Constants.statusBarHeight;
      let pageContent = '';
      lines.map(({ baseline, text }) => {
        if (baseline < maxHeight) {
          pageContent += text;
        }
      });
      const originContext = iconv.encode(pageContent, this.state.encoding ?? 'utf-8');
      const nextPosition = this.state.position + originContext.length;
      const nextPage = await this.loadBook(nextPosition);
      this.setState({
        currentPage: pageContent,
        nextPosition,
        nextPage,
        loading: false,
        cacheLoading: true,
      });
    }
  };

  onHiddenTextLayout = async ({ nativeEvent: { lines } }) => {
    if (this.state.cacheLoading && lines.length > 1) {
      const maxHeight = Device.height - Constants.statusBarHeight;
      let pageContent = '';
      lines.map(({ baseline, text }) => {
        if (baseline < maxHeight) {
          pageContent += text;
        }
      });
      this.setState({
        nextPage: pageContent,
        cacheLoading: false,
      });
    }
  };

  render() {
    const { backgroundColor, fontSize } = this.props.setting;
    const { position, currentPage, nextPage } = this.state;
    const { currentBook } = this.props;
    if (!currentBook) {
      return (
        <View
          style={[styles.body, {
            backgroundColor,
            justifyContent: 'center',
            alignContent: 'center',
          }]}
        >
          <ActivityIndicator size='large' />
        </View>
      );
    }
    const percent = Math.round((position / currentBook.size) * 10000) / 100;
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.touchScreen} onLongPress={this.showActionSheet}>
          <View style={[styles.body, { backgroundColor }]}>
            <Text
              onTextLayout={this.onTextLayout}
              onLayout={this.onLayout}
              style={{
                ...styles.normalText,
                fontSize,
                paddingLeft: 4,
                paddingRight: 4,
                zIndex: 99,
                backgroundColor,
              }}
            >
              {currentPage}
            </Text>
            <Text
              onTextLayout={this.onHiddenTextLayout}
              onLayout={this.onLayout}
              style={{
                ...styles.normalText,
                fontSize,
                paddingLeft: 4,
                paddingRight: 4,
                zIndex: 0,
              }}
            >
              {nextPage}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Modal
          transparent
          maskClosable
          visible={this.state.modalVisible}
          onClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View style={styles.modalContent}>
            <View>
              <Text style={styles.labelText}>{`${percent}%`}</Text>
            </View>
            <View style={styles.slider}>
              <Slider
                min={0}
                max={100}
                defaultValue={percent}
                onChange={this.changePercent}
                step={0.01}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: themes.fill_body,
  },

  modalContent: {
    paddingVertical: 20,
  },
  labelText: {
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 10,
  },
  normalText: {
    color: themes.color_text_base,
    position: 'absolute',
  },
});
