import { AsyncStorage } from 'react-native';
import _ from 'lodash';

export default class Storage {
  /**
   * 根据key获取json数值
   * @param key
   * @returns {Promise<TResult>}
   */
  static async getItem(key) {
    try {
      if (typeof key === 'string') {
        const value = await AsyncStorage.getItem(key);
        if (value && value !== '') {
          return typeof value === 'string' ? JSON.parse(value) : value;
        }
      }
    } catch (e) {
      console.error('Storage.getItem', e);
    }
    return null;
  }

  /**
   * 保存key对应的json数值
   * @param key
   * @param value
   * @returns {Promise<string>}
   */
  static async setItem(key, value) {
    if (key && value) {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage.setItem', e);
      }
    }
  }

  /**
   * 删除key对应json数值
   * @param key
   * @returns {Promise<string>}
   */
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Storage.removeItem', e);
    }
  }

  /**
   * 删除所有配置数据
   * @returns {Promise<string>}
   */
  static async clear() {
    try {
      const asyncStorageKeys = await AsyncStorage.getAllKeys();
      if (asyncStorageKeys.length > 0) {
        AsyncStorage.clear();
      }
    } catch (e) {
      console.error('Storage.clear', e);
    }
  }
}
