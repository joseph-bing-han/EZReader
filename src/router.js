import { router } from 'dva';
import React from 'react';
import { Button, Text, View } from 'react-native';
import Links from './constants/Links';
import DefaultLayout from './layouts/DefaultLayout';
import Pages from './pages';

const { Route, Router, Switch } = router;

export default function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <DefaultLayout path={Links.HOME} component={Pages.Home} />
        <Route path="*"
          component={() => (
            <View>
              <Text style={{
                marginTop: 40,
                color: 'red',
              }}
              >
                Oops! Not Found
              </Text>
              <Button
                title="Go Back"
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
