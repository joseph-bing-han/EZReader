import { ListView, WingBlank } from '@ant-design/react-native';
import { connect } from 'dva';
import ld from 'lodash';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BookListHeader from '../../components/BookListHeader';
import BookListItem from '../../components/BookListItem';
import themes from '../../themes';

@connect(({ home, loading }) => ({
  books: home.books,
  booksLoading: loading.effects['home/getAllBooks'],
}))

export default class Home extends React.Component {
  componentDidMount() {

  }

  fetchBook = async (page = 1, startFetch, _) => {
    this.props.dispatch({
      type: 'home/getAllBooks',
    });
    if (this.props.booksLoading) {
      await ld.delay(2000);
    }
    startFetch(this.props.books, 10);
  };

  addNewBook = () => {
    console.log('Home-addNewBook-30:', '+++++');
  };

  renderHeader = () => (
    <BookListHeader total={this.props?.books?.length || 0} onPress={this.addNewBook} />
  );

  renderItem = (item) => {
    console.log('Home-renderItem-23:', item);
    return (
      <BookListItem />
    );
  };

  render() {
    return (
      <View style={styles.body}>
        <ListView onFetch={this.fetchBook} header={this.renderHeader} renderItem={this.renderItem} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: themes.fill_body,
  },
});
