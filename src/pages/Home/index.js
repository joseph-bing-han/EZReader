import { ListView } from '@ant-design/react-native';
import { connect } from 'dva';
import * as DocumentPicker from 'expo-document-picker';
import ld from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import BookListHeader from '../../components/BookListHeader';
import BookListItem from '../../components/BookListItem';
import themes from '../../themes';
import { Sleep } from '../../utils/Utils';

@connect(({ home, setting, loading }) => ({
  books: home.books,
  booksLoading: loading.effects['home/getAllBooks'],
}))

export default class Home extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'home/getAllBooks',
    });
    this.props.dispatch({
      type: 'setting/getSetting',
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps?.books && this.props?.books && !ld.isEqual(nextProps.books, this.props.books)) {
      this?.listView.refresh();
    }
  }

  fetchBook = async (page = 1, startFetch, _) => {
    if (this.props.booksLoading || !this.props.books) {
      await Sleep(1000);
    }
    startFetch(this.props.books, 10);
  };

  addNewBook = async () => {
    const { uri, name, type } = await DocumentPicker.getDocumentAsync({
      type: 'text/plain',
      copyToCacheDirectory: true,
    });
    if (type === 'success') {
      const names = name.split('.');
      if (names.length > 1) {
        names.pop();
      }
      this.props.dispatch({
        type: 'home/addNewBook',
        uri,
        name: names.join(),
      });
    }
  };

  renderHeader = () => (
    <BookListHeader total={this.props?.books?.length || 0} onPress={this.addNewBook} />
  );

  renderItem = ({ id, name, size, page, updated_at }) => (
    <BookListItem id={id} name={name} size={size} page={page} updated_at={updated_at} />
  );

  render() {
    return (
      <View style={styles.body}>
        <ListView
          ref={(ref) => this.listView = ref}
          onFetch={this.fetchBook}
          header={this.renderHeader}
          renderItem={this.renderItem}
          refreshable
        />
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
