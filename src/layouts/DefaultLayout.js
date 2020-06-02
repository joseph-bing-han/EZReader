import { router } from 'dva';
import Constants from 'expo-constants';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import FooterBar from '../components/FooterBar';

const { Route } = router;
export default ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={(matchProps) => (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
          <Component {...matchProps} />
          <FooterBar currentLink={rest.path} />
        </View>
      </SafeAreaView>
    )}
  />
);
