import Sort from '../constants/Short';
import theme from '../themes';
import Storage from '../utils/Storage';

const COLOR_KEY = 'EZBook-background-color';
const FONT_SIZE_KEY = 'EZBook-font-size';
const SPEAK_PITCH_KEY = 'EZBook-speak-pitch';
const SPEAK_RATE_KEY = 'EZBook-speak-rate';
const ORDER_KEY = 'EZBook-order';
const BY_KEY = 'EZBook-by';

export async function getFontSize() {
  return await Storage.getItem(FONT_SIZE_KEY) ?? 20;
}

export async function getBackgroundColor() {
  return await Storage.getItem(COLOR_KEY) ?? theme.color_light_green;
}

export async function getSpeakPitch() {
  const pitch = await Storage.getItem(SPEAK_PITCH_KEY) ?? '1.0';
  return Math.round(parseFloat(pitch) * 10) / 10;
}

export async function getSpeakRate() {
  const pitch = await Storage.getItem(SPEAK_RATE_KEY) ?? '1.0';
  return Math.round(parseFloat(pitch) * 10) / 10;
}

export async function getOrder() {
  return await Storage.getItem(ORDER_KEY) ?? Sort.ORDER_UPDATE;
}

export async function getBy() {
  return await Storage.getItem(BY_KEY) ?? Sort.BY_DESC;
}

export async function setFontSize(size = 20) {
  await Storage.setItem(FONT_SIZE_KEY, size);
}

export async function setBackgroundColor(color = theme.color_light_green) {
  await Storage.setItem(COLOR_KEY, color);
}

export async function setSpeakPitch(pitch = 1.0) {
  await Storage.setItem(SPEAK_PITCH_KEY, pitch);
}

export async function setSpeakRate(rate = 1.0) {
  await Storage.setItem(SPEAK_RATE_KEY, rate);
}

export async function setOrderBy(order = Sort.ORDER_UPDATE, by = Sort.BY_DESC) {
  await Storage.setItem(ORDER_KEY, order);
  await Storage.setItem(BY_KEY, by);
}
