import {
  getBackgroundColor,
  getFontSize,
  getSpeakPitch,
  getSpeakRate,
  setBackgroundColor,
  setFontSize,
  setSpeakPitch,
  setSpeakRate,
} from '../services/setting';
import theme from '../themes';

export default {
  namespace: 'setting',
  state: {
    backgroundColor: theme.color_light_green,
    fontSize: 20,
    speakPitch: 1.0,
    speakRate: 1.0,
  },
  effects: {
    * getSetting(_, { call, put }) {
      const backgroundColor = yield call(getBackgroundColor);
      const fontSize = yield call(getFontSize);
      const speakPitch = yield call(getSpeakPitch);
      const speakRate = yield call(getSpeakRate);
      yield put({
        type: 'saveColor',
        backgroundColor,
      });
      yield put({
        type: 'saveSize',
        fontSize,
      });
      yield put({
        type: 'savePitch',
        speakPitch,
      });
      yield put({
        type: 'saveRate',
        speakRate,
      });
    },
    * updateBackgroundColor({ color }, { call, put }) {
      yield call(setBackgroundColor, color);
      const backgroundColor = yield call(getBackgroundColor);
      yield put({
        type: 'saveColor',
        backgroundColor,
      });
    },
    * updateFontSize({ size }, { call, put }) {
      yield call(setFontSize, size);
      const fontSize = yield call(getFontSize);
      yield put({
        type: 'saveSize',
        fontSize,
      });
    },
    * updateSpeakPitch({ pitch }, { call, put }) {
      yield call(setSpeakPitch, pitch);
      const speakPitch = yield call(getSpeakPitch);
      yield put({
        type: 'savePitch',
        speakPitch,
      });
    },
    * updateSpeakRate({ rate }, { call, put }) {
      yield call(setSpeakRate, rate);
      const speakRate = yield call(getSpeakRate);
      yield put({
        type: 'saveRate',
        speakRate,
      });
    },
  },
  reducers: {
    saveColor(state, { backgroundColor }) {
      return {
        ...state,
        backgroundColor,
      };
    },
    saveSize(state, { fontSize }) {
      return {
        ...state,
        fontSize,
      };
    },
    savePitch(state, { speakPitch }) {
      return {
        ...state,
        speakPitch,
      };
    },
    saveRate(state, { speakRate }) {
      return {
        ...state,
        speakRate,
      };
    },
  },
};
