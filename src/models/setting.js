import Sort from '../constants/Short';
import {
  getBackgroundColor,
  getBy,
  getFontSize,
  getOrder,
  getSpeakPitch,
  getSpeakRate,
  setBackgroundColor,
  setFontSize,
  setOrderBy,
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
    order: Sort.ORDER_UPDATE,
    by: Sort.BY_DESC,
  },
  effects: {
    * getSetting(_, { call, put }) {
      const backgroundColor = yield call(getBackgroundColor);
      const fontSize = yield call(getFontSize);
      const speakPitch = yield call(getSpeakPitch);
      const speakRate = yield call(getSpeakRate);
      const order = yield call(getOrder);
      const by = yield call(getBy);
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
      yield put({
        type: 'saveOrderBy',
        order,
        by,
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
    * updateOrderBy({ order, by }, { call, put }) {
      yield call(setOrderBy, order, by);
      const nOrder = yield call(getOrder);
      const nBy = yield call(getBy);
      yield put({
        type: 'saveOrderBy',
        order: nOrder,
        by: nBy,
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
    saveOrderBy(state, { order, by }) {
      return {
        ...state,
        order,
        by,
      };
    },
  },
};
