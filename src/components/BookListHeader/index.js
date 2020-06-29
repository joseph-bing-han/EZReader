import { Button, Icon } from '@ant-design/react-native';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sort from '../../constants/Short';
import themes from '../../themes';

@connect(({ setting }) => ({
  order: setting.order,
  by: setting.by,
}))
export default class BookListHeader extends React.PureComponent {
  static propTapes = {
    total: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  changeOrder = (nOrder) => {
    const { order, by } = this.props;
    let nBy = by;
    if (nOrder === order) {
      if (by === Sort.BY_ASC) {
        nBy = Sort.BY_DESC;
      } else {
        nBy = Sort.BY_ASC;
      }
    } else {
      nBy = Sort.BY_DESC;
    }
    this.props.dispatch({
      type: 'setting/updateOrderBy',
      order: nOrder,
      by: nBy,
    });
    this.props.dispatch({
      type: 'home/getAllBooks',
    });
  };

  render() {
    const { order, by } = this.props;
    return (
      <View style={styles.body}>
        <View style={styles.text}>
          <Text style={styles.text}>{`图书: ${this.props.total}部`}</Text>
        </View>
        <TouchableOpacity onPress={() => { this.changeOrder(Sort.ORDER_SIZE); }}>
          <View style={styles.sort}>
            <Text style={styles.text}>按字数排序</Text>
            {order === Sort.ORDER_SIZE && by === Sort.BY_DESC && (
              <Icon style={styles.text} name={'sort-descending'} />
            )}
            {order === Sort.ORDER_SIZE && by === Sort.BY_ASC && (
              <Icon style={styles.text} name={'sort-ascending'} />
            )}
            {order === Sort.ORDER_UPDATE && (
              <Icon style={styles.text} name={'ellipsis'} />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.changeOrder(Sort.ORDER_UPDATE); }}>
          <View style={styles.sort}>
            <Text style={styles.text}>按时间排序</Text>
            {order === Sort.ORDER_UPDATE && by === Sort.BY_DESC && (
              <Icon style={styles.text} name={'sort-descending'} />
            )}
            {order === Sort.ORDER_UPDATE && by === Sort.BY_ASC && (
              <Icon style={styles.text} name={'sort-ascending'} />
            )}
            {order === Sort.ORDER_SIZE && (
              <Icon style={styles.text} name={'ellipsis'} />
            )}
          </View>
        </TouchableOpacity>
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
