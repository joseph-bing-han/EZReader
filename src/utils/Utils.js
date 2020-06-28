import Constants from 'expo-constants';
import Device from '../constants/Device';

export function Sleep(time) {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
}

export function getLineCharacterCount(characterSize) {
  return Math.floor((Device.width - 8) / characterSize);
}

export function getPageLineCount(characterSize) {
  return Math.floor((Device.height - Constants.statusBarHeight - 20) / (characterSize * 1.5));
}
