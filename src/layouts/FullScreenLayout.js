import { router } from 'dva';
import Constants from 'expo-constants';
import React from 'react';
import { Dimensions, View } from 'react-native';

const { Route } = router;
export default ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={(matchProps) => (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          // paddingTop: Constants.statusBarHeight,
        }}
      >
        <View style={{ height: Dimensions.get('window').height - Constants.statusBarHeight }}>
          <Component {...matchProps} />
        </View>
      </View>
    )}
  />
);
