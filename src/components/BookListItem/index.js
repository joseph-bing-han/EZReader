import { Button, Icon, Progress } from '@ant-design/react-native';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Links from '../../constants/Links';
import themes from '../../themes';
import Link from '../Link';

@connect()
export default class BookListItem extends React.PureComponent {
  static propTapes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
  };

  removeBook = () => {
    const { id, name } = this.props;
    Alert.alert(
      '确认提示',
      `确定要移除 "${name}" 吗?`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确认移除',
          onPress: () => {
            this.props.dispatch({
              type: 'home/removeBook',
              id,
            });
          },
        },
      ],
    );
  };

  render() {
    const { id, name, size, position, updated_at } = this.props;
    return (
      <Link linkTo={`${Links.VIEWER}/${id}`}>
        <View style={styles.body}>
          <View style={styles.image}>
            <ImageBackground source={require('../../../assets/book-background.jpg')} style={styles.imageBackground}>
              <Text style={styles.bookTitle} numberOfLines={4} ellipsizeMode={'tail'}>{name}</Text>
            </ImageBackground>
          </View>
          <View style={styles.info}>
            <View style={styles.infoDiv}>
              <Text numberOfLines={2} ellipsizeMode={'tail'}>{`书籍名称: ${name}`}</Text>
            </View>
            <View style={styles.infoDiv}>
              <Text numberOfLines={2} ellipsizeMode={'tail'}>{`书籍大小: ${(size / 1024 / 1024).toFixed(2)}M`}</Text>
            </View>
            <View style={[styles.infoDiv, styles.infoProgress]}>
              <Text>{'当前进度: '}</Text>
              <Progress percent={position / size * 100} style={styles.progress} />
              <Text>{`${(position / size * 100).toFixed(2)}%`}</Text>
            </View>
            <View style={styles.infoDiv}>
              <Text>{`阅读时间: ${moment(updated_at).format('lll')}`}</Text>
            </View>
          </View>
          <View style={styles.remove}>
            <Button type='warning' size='small' onPress={this.removeBook}>
              <Icon
                name={'delete'}
                size={'xxs'}
                color={themes.color_text_base_inverse}
              />
              移除
            </Button>
          </View>
        </View>
      </Link>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: `${themes.color_light_yellow}77`,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
    marginTop: 1,
    marginBottom: 1,
    borderRadius: themes.radius_lg,
  },
  image: {
    width: 100,
    height: 120,
    margin: 4,
  },
  imageBackground: {
    width: 100,
    height: 120,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themes.color_font_primary,
    padding: 16,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 8,
    width: 220,
  },
  infoDiv: {
    paddingTop: 6,
  },
  infoProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    height: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  remove: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
