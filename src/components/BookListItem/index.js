import { connect } from 'dva';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import themes from '../../themes';

@connect()
export default class BookListItem extends React.PureComponent {
  render() {
    return (
      <View>
        <Text>aaaaa</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: themes.color_dark_green,
  },
});
