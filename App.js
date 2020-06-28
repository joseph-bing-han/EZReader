import Provider from '@ant-design/react-native/lib/provider/index';
import dva from 'dva';
import createLoading from 'dva-loading';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { createMemoryHistory } from 'history';
import React from 'react';
import { BackHandler } from 'react-native';
import models from './src/models';
import routers from './src/router';
import defaultThemes from './src/themes';

console.disableYellowBox = true;

const dvaApp = dva({
  history: createMemoryHistory(), // Trick !!
  initialState: {},
  // extraReducers: {
  //   form: formReducer,
  // },
  onError: (err, dispatch) => {
    err.preventDefault();
    if (err.response) {
      console.warn('davjs Error: ', err.response);
    }
  },
});

// 注册所有 model
models.forEach((m) => dvaApp.model(m));

// 注册路由
dvaApp.router(routers);

// 注册dva-loading
dvaApp.use(createLoading());

const DvaApp = dvaApp.start();

export default class App extends React.PureComponent {
  state = {
    isReady: false,
  };

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { _history: history } = dvaApp;
      if (history) {
        if (history.goBack && history.index > 0) {
          history.goBack();
          return true;
        }
        if (history.index === 0) {
          BackHandler.exitApp();
          return true;
        }
      }
      return false;
    });

    await Font.loadAsync(
      'antoutline',
      // eslint-disable-next-line
      require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
    );

    await Font.loadAsync(
      'antfill',
      // eslint-disable-next-line
      require('@ant-design/icons-react-native/fonts/antfill.ttf'),
    );
    // eslint-disable-next-line
    this.setState({ isReady: true });
  }

  render() {
    const { isReady } = this.state;
    if (!isReady) {
      return <AppLoading />;
    }
    return (
      <Provider theme={defaultThemes}>
        <DvaApp />
      </Provider>
    );
  }
}
