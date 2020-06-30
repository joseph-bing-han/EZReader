import { ActionSheet, ActivityIndicator, Modal, Slider } from '@ant-design/react-native';
import * as Base64 from 'Base64';
import { connect, routerRedux } from 'dva';
import * as FileSystem from 'expo-file-system';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import * as Speech from 'expo-speech';
import iconv from 'iconv-lite';
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Device from '../../constants/Device';
import Links from '../../constants/Links';
import themes from '../../themes';
import { getLineCharacterCount, getPageLineCount } from '../../utils/Utils';

@connect(({ home, loading, setting }) => ({
  setting,
  currentBook: home.currentBook,
  booksLoading: loading.effects['home/openBook'],
}))

export default class BookViewer extends React.Component {
  state = {
    lineMax: 10,
    pageMax: 10,
    pages: [],
    currentPage: -1,
    isSpeaking: false,
    modalVisible: false,
    loading: true,
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
    if (this.props.setting?.fontSize) {
      this.setState({
        lineMax: getLineCharacterCount(this.props.setting.fontSize),
        pageMax: getPageLineCount(this.props.setting.fontSize),
      });
    }
  }

  componentWillUnmount() {
    deactivateKeepAwake();
    Speech.stop();
  }

  async UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const { currentBook } = nextProps;
    if (this.state.pages.length === 0) {
      const context = await FileSystem.readAsStringAsync(currentBook.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      iconv.skipDecodeWarning = true;
      const convertContext = iconv.decode(Base64.atob(context), 'gbk');
      this.setState({
        loading: false,
        currentPage: currentBook.page,
      });
      this.calculatePage(convertContext);
    } else if (currentBook.page !== this.state.currentPage) {
      this.setState({
        currentPage: currentBook.page,
      });
    }
  }

  calculatePage = (context) => {
    const { lineMax, pageMax } = this.state;
    const allLines = [];
    let currentLine = '';
    context.split('').map((char, i) => {
      currentLine += char;
      if (currentLine.length === lineMax || char === '\n') {
        allLines.push(currentLine);
        currentLine = '';
      }
    });
    const pages = [];

    currentLine = '';
    let lineCount = 0;
    allLines.map((line, i) => {
      if (lineCount < pageMax) {
        currentLine += line;
      }
      if (++lineCount === pageMax || i === allLines.length - 1) {
        pages.push(currentLine);
        lineCount = 0;
        currentLine = '';
      }
    });
    this.setState({
      pages,
    });
  };

  showActionSheet = async () => {
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
    const { currentPage, pages } = this.state;
    if (currentPage > 0) {
      this.props.dispatch({
        type: 'home/changeBookPage',
        page: currentPage - 1,
        size: pages.length,
      });
    }
  };

  goNextPage = () => {
    const { pages, currentPage } = this.state;
    if ((currentPage + 1) < pages.length) {
      this.props.dispatch({
        type: 'home/changeBookPage',
        page: currentPage + 1,
        size: pages.length,
      });
    }
  };

  onSpeakComplete = () => {
    this.startSpeak(1);
    this.goNextPage();
  };

  startSpeak = (change = 0) => {
    const { pages, currentPage } = this.state;
    const pageNo = currentPage + change;
    const { speakPitch, speakRate } = this.props.setting;
    if (this._speak) {
      Speech.speak(pages[pageNo], {
        pitch: speakPitch,
        rate: speakRate,
        onDone: this.onSpeakComplete,
      });
    }
  };

  changePage = (percent) => {
    const { pages } = this.state;
    const currentPage = Math.floor(pages.length * percent / 100);
    this.setState({ currentPage });
    this.props.dispatch({
      type: 'home/changeBookPage',
      page: currentPage,
      size: pages.length,
    });
  };

  render() {
    const { backgroundColor, fontSize } = this.props.setting;
    const { pages, currentPage, loading } = this.state;
    const percent = Math.round((currentPage / pages.length) * 10000) / 100;
    return (
      <View>
        {loading && (
          <View
            style={[styles.body, {
              backgroundColor,
              justifyContent: 'center',
              alignContent: 'center',
            }]}
          >
            <ActivityIndicator size='large' />
          </View>
        )}
        {!loading && (
          <TouchableWithoutFeedback onPress={this.touchScreen} onLongPress={this.showActionSheet}>
            <View style={[styles.body, { backgroundColor }]}>
              {pages.length > 0 && (
                <Text
                  onLayout={this.onTextLayout}
                  style={{
                    fontSize,
                    paddingTop: 14,
                    paddingBottom: 14,
                    paddingLeft: 4,
                    paddingRight: 4,
                  }}
                >
                  {pages[currentPage]}
                </Text>
              )}

            </View>

          </TouchableWithoutFeedback>
        )}
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
              <Text style={styles.labelText}>{`第${currentPage}页, 共${pages.length}页, ${percent}%`}</Text>
            </View>
            <View style={styles.slider}>
              <Slider
                min={0}
                max={100}
                defaultValue={percent}
                onChange={this.changePage}
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
