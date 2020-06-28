import theme from '../themes';
import Storage from '../utils/Storage';

const COLOR_KEY = 'EZBook-background-color';
const FONT_SIZE_KEY = 'EZBook-font-size';
const SPEAK_PITCH = 'EZBook-speak-pitch';
const SPEAK_RATE = 'EZBook-speak-rate';

export async function getFontSize() {
  return await Storage.getItem(FONT_SIZE_KEY) ?? 20;
}

export async function getBackgroundColor() {
  return await Storage.getItem(COLOR_KEY) ?? theme.color_light_green;
}

export async function getSpeakPitch() {
  const pitch = await Storage.getItem(SPEAK_PITCH) ?? '1.0';
  return Math.round(parseFloat(pitch) * 10) / 10;
}

export async function getSpeakRate() {
  const pitch = await Storage.getItem(SPEAK_RATE) ?? '1.0';
  return Math.round(parseFloat(pitch) * 10) / 10;
}

export async function setFontSize(size = 20) {
  await Storage.setItem(FONT_SIZE_KEY, size);
}

export async function setBackgroundColor(color = theme.color_light_green) {
  await Storage.setItem(COLOR_KEY, color);
}

export async function setSpeakPitch(pitch = 1.0) {
  await Storage.setItem(SPEAK_PITCH, pitch);
}

export async function setSpeakRate(rate = 1.0) {
  await Storage.setItem(SPEAK_RATE, rate);
}
