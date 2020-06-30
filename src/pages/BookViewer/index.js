import { ActionSheet, ActivityIndicator, Modal, Slider } from '@ant-design/react-native';
import * as Base64 from 'Base64';
import { connect, routerRedux } from 'dva';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import * as Speech from 'expo-speech';
import iconv from 'iconv-lite';
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
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
    currentPage: '',
    nextPage: '',
    position: -1,
    nextPosition: -1,
    isSpeaking: false,
    modalVisible: false,
    loading: true,
    isUTF8: false,
  };

  componentDidMount() {
    activateKeepAwake();
    const { params } = this.props.match;
    if (params?.id) {
      this.props.dispatch({
        type: 'home/openBook',
        id: params.id,
      });
    } else {
      this.props.dispatch(routerRedux.push(Links.HOME));
    }
  }

  componentWillUnmount() {
    deactivateKeepAwake();
    Speech.stop();
  }

  async UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const { currentBook } = nextProps;
    if (currentBook?.position !== this.state.position) {
      this.setState({
        position: currentBook.position ?? 0,
        nextPosition: currentBook.position ?? 0,
        loading: true,
        currentPage: await this.loadBook(currentBook.position),
      });
    }
  }

  loadBook = async (position = 0) => {
    const { currentBook } = this.props;
    const base64Context = await FileSystem.readAsStringAsync(currentBook.uri, {
      encoding: FileSystem.EncodingType.Base64,
      position,
      length: 2048,
    });
    const context = Base64.atob(base64Context);
    iconv.skipDecodeWarning = true;
    const utf8Context = iconv.decode(context, 'gbk');
    this.setState({
      isUTF8: utf8Context === context,
    });
    return utf8Context;
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

  touchScreen = ({ nativeEvent: { locationY } }) => {
    Speech.stop();
    if (locationY > (Device.height / 2)) {
      this.startSpeak(+1);
      this.goNextPage();
    } else {
      this.startSpeak(-1);
      this.goPreviousPage();
    }
  };

  goPreviousPage = () => {
    const { position, nextPosition } = this.state;
    if (position > 0) {
      const length = nextPosition - position;
      const newPosition = position > length ? position - length : 0;
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
    this.goNextPage();
    this.startSpeak();
  };

  startSpeak = () => {
    const { currentPage } = this.state;
    const { speakPitch, speakRate } = this.props.setting;
    if (this._speak) {
      Speech.speak(currentPage, {
        pitch: speakPitch,
        rate: speakRate,
        onDone: this.onSpeakComplete,
      });
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
      const originContext = this.state.isUTF8 ? pageContent : iconv.encode(pageContent, 'gbk');
      const nextPosition = this.state.position + originContext.length;
      const nextPage = await this.loadBook(nextPosition);
      this.setState({
        currentPage: pageContent,
        nextPosition,
        nextPage,
        loading: false,
      });
    }
  };

  render() {
    const { backgroundColor, fontSize } = this.props.setting;
    const { position, currentPage } = this.state;
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
                fontSize,
                paddingLeft: 4,
                paddingRight: 4,
              }}
            >
              {currentPage}
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

});
