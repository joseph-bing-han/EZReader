import { router } from 'dva';
import React from 'react';
import { Button, Text, View } from 'react-native';
import Links from './constants/Links';
import DefaultLayout from './layouts/DefaultLayout';
import FullScreenLayout from './layouts/FullScreenLayout';
import Pages from './pages';

const { Route, Router, Switch } = router;

/**
 * 路由跳转 前/后 的预处理
 * @param WrappedComponent
 * @param preCondition
 * @param postCondition
 * @constructor
 */
function RouteCondition(WrappedComponent, preCondition = null, postCondition = null) {
  return class extends React.PureComponent {
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillMount() {
      if (preCondition && typeof preCondition === 'function') {
        preCondition();
      }
    }

    componentWillUnmount() {
      if (postCondition && typeof postCondition === 'function') {
        postCondition();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default function RouterConfig({ history, app }) {
  function resetHistory() {
    // 到首页时重置路由历史记录
    history.index = 0;
  }

  return (
    <Router history={history}>
      <Switch>
        <DefaultLayout path={Links.HOME} exact component={RouteCondition(Pages.Home, resetHistory)} />
        <FullScreenLayout path={`${Links.VIEWER}/:id`} exact component={Pages.BookViewer} />
        <DefaultLayout path={Links.SETTING} exact component={Pages.Setting} />
        <Route
          path='*'
          component={() => (
            <View>
              <Text
                style={{
                  marginTop: 40,
                  color: 'red',
                }}
              >
                Oops! Not Found
              </Text>
              <Button
                title='Go Back'
                onPress={() => {
                  if (history.index > 0) {
                    history.goBack();
                    return true;
                  }
                  return false;
                }}
              />
            </View>
          )}
        />
      </Switch>
    </Router>
  );
}
