import { Button, Icon } from '@ant-design/react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import themes from '../../themes';

export default class BookListHeader extends React.PureComponent {
  static propTapes = {
    total: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
  };
  render() {
    return (
      <View style={styles.body}>
        <View style={styles.text}>
          <Text style={styles.text}>{`图书: ${this.props.total}部`}</Text>
        </View>
        <View style={styles.sort}>
          <Text style={styles.text}>按字数排序</Text>
          <Icon style={styles.text} name={'ellipsis'} />
        </View>
        <View style={styles.sort}>
          <Text style={styles.text}>按时间排序</Text>
          <Icon style={styles.text} name={'sort-ascending'} />
        </View>
        <View>
          <Button type='ghost' size='small' onPress={this.props.onPress}>{'+ 添加图书'}</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${themes.color_light_green}20`,
    paddingLeft: themes.h_spacing_md,
    paddingRight: themes.h_spacing_md,
    height: 36,
  },
  sort: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  text: {
    color: themes.color_font_primary,
  },
});
