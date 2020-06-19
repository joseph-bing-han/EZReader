import { router } from 'dva';
import Constants from 'expo-constants';
import React from 'react';
import { Dimensions, View } from 'react-native';
import FooterBar from '../components/FooterBar';
import themes from '../themes';

const { Route } = router;
export default ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={(matchProps) => (
      <View style={{ flex: 1, flexDirection: 'column', paddingTop: Constants.statusBarHeight }}>
        <View style={{ height: Dimensions.get('window').height - themes.tab_bar_height - Constants.statusBarHeight }}>
          <Component {...matchProps} />
        </View>
        <FooterBar currentLink={rest.path} />
      </View>
    )}
  />
);
