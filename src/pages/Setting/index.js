import { Slider } from '@ant-design/react-native';
import { connect } from 'dva';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TriangleColorPicker } from 'react-native-color-picker';
import Device from '../../constants/Device';
import themes from '../../themes';

@connect(({ setting, loading }) => ({
  setting,
  loading: loading.effects['setting/getSetting'],
}))

export default class Home extends React.Component {
  state = {
    showColorPicker: false,
    fontSizeList: [16, 20, 24, 28, 32, 36],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'setting/getSetting',
    });
  }

  onTouchColorPicker = () => {
    this.setState({
      showColorPicker: true,
    });
  };

  updateColor = (color) => {
    this.props.dispatch({
      type: 'setting/updateBackgroundColor',
      color,
    });
    this.setState({
      showColorPicker: false,
    });
  };

  updateSize = (size) => {
    this.props.dispatch({
      type: 'setting/updateFontSize',
      size,
    });
  };

  updatePitch = (pitch) => {
    this.props.dispatch({
      type: 'setting/updateSpeakPitch',
      pitch,
    });
  };

  updateRate = (rate) => {
    this.props.dispatch({
      type: 'setting/updateSpeakRate',
      rate,
    });
  };

  render() {
    const { backgroundColor, fontSize, speakPitch, speakRate } = this.props.setting;
    const { showColorPicker, fontSizeList } = this.state;
    return (
      <View style={styles.body}>
        <View style={styles.context}>
          <View style={styles.item}>
            <View style={styles.label}><Text style={styles.labelText}>背景色:</Text></View>
            {!showColorPicker && (
              <View>
                <TouchableOpacity onPress={this.onTouchColorPicker}>
                  <View style={[styles.color, { backgroundColor }]}></View>
                </TouchableOpacity>
              </View>
            )}
            {showColorPicker && (
              <View style={styles.colorPicker}>
                <TriangleColorPicker
                  onColorSelected={this.updateColor}
                  defaultColor={backgroundColor}
                  style={{
                    flex: 1,
                  }}
                ></TriangleColorPicker>
              </View>
            )}
          </View>
          <View style={styles.item}>
            <View style={styles.label}><Text style={styles.labelText}>字体大小:</Text></View>
            {fontSizeList.map((size) => (
              <TouchableOpacity onPress={() => { this.updateSize(size); }}>
                <View style={[size === fontSize ? styles.fontSizeActive : styles.fontSize, { height: 6 + size * 1.2 }]}>
                  <Text
                    style={{
                      fontSize: size,
                      paddingLeft: 2,
                      paddingRight: 2,
                    }}
                  >字</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.item}>
            <View style={styles.label}><Text style={styles.labelText}>音调:</Text></View>
            <View style={styles.slider}>
              <Slider
                min={0.4}
                max={2.0}
                defaultValue={speakPitch}
                onChange={this.updatePitch}
                step={0.1}
              />
            </View>
            <View>
              <Text style={styles.labelText}>{speakPitch}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}><Text style={styles.labelText}>语速:</Text></View>
            <View style={styles.slider}>
              <Slider
                min={0.8}
                max={3.0}
                defaultValue={speakRate}
                onChange={this.updateRate}
                step={0.1}
              />
            </View>
            <View>
              <Text style={styles.labelText}>{speakRate}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: themes.fill_body,
  },
  context: {
    margin: 10,
    padding: 10,
    borderRadius: themes.radius_md,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 2,
    height: Device.height - themes.tab_bar_height - 44,
  },
  item: {
    marginBottom: 20,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },

  label: {
    width: '24%',
  },
  labelText: {
    fontSize: 16,
  },
  color: {
    width: 30,
    height: 30,
    backgroundColor: '#997777',
    borderStyle: 'solid',
    borderColor: '#808080',
    borderWidth: 1,
    borderRadius: themes.radius_md,
  },
  colorPicker: {
    width: 200,
    height: 200,
  },
  fontSize: {
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderStyle: 'solid',
    borderColor: '#808080',
    borderWidth: 1,
    borderRadius: themes.radius_md,
  },

  fontSizeActive: {
    marginRight: 10,
    color: themes.color_dark_green,
    borderStyle: 'solid',
    borderColor: themes.color_pink,
    borderWidth: 1,
    borderRadius: themes.radius_md,
  },
  slider: {
    width: 200,
  },
});
