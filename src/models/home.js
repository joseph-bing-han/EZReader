import { routerRedux } from 'dva';
import { deleteAsync } from 'expo-file-system';
import Links from '../constants/Links';
import { createBook, deleteBook, getBookList, retrieveBook, retrieveBookByName, updateBook } from '../services/books';

export default {
  namespace: 'home',
  state: {},
  effects: {
    * getAllBooks(_, { call, put }) {
      const response = yield call(getBookList);
      yield put({
        type: 'saveAllBooks',
        books: response,
      });
    },
    * addNewBook({ uri, name }, { call, put }) {
      const existBook = yield call(retrieveBookByName, name);
      let currentBook = null;
      if (existBook) {
        // 已经有的书籍更新数据
        currentBook = yield call(updateBook, existBook.id, name, uri, existBook.size, existBook.page);
      } else {
        // 没有则新建
        currentBook = yield call(createBook, name, uri);
      }
      // yield put({
      //   type: 'saveCurrentBook',
      //   currentBook,
      // });
      // // 刷新列表
      // yield put({ type: 'getAllBooks' });
      yield put(routerRedux.push(`${Links.VIEWER}/${currentBook.id}`));
    },

    * removeBook({ id }, { call, put }) {
      const currentBook = yield call(retrieveBook, id);
      yield call(deleteAsync, currentBook.uri, { idempotent: true });
      yield call(deleteBook, id);
      // 刷新列表
      yield put({ type: 'getAllBooks' });
    },

    * openBook({ id }, { call, put }) {
      const currentBook = yield call(retrieveBook, id);
      yield call(updateBook, currentBook.id, currentBook.name, currentBook.uri, currentBook.size, currentBook.page);
      yield put({
        type: 'saveCurrentBook',
        currentBook,
      });
    },

    * changeBookPage({ page = 0, size = 9999 }, { select, call, put }) {
      const { currentBook } = yield select((data) => data.home);
      currentBook.page = page;
      currentBook.size = size;
      yield call(updateBook, currentBook.id, currentBook.name, currentBook.uri, size, page);
      const newBook = {};
      Object.assign(newBook, currentBook);
      yield put({
        type: 'saveCurrentBook',
        currentBook: newBook,
      });
    },
  },
  reducers: {
    saveAllBooks(state, action) {
      return {
        ...state,
        books: action.books,
      };
    },
    saveCurrentBook(state, { currentBook }) {
      return {
        ...state,
        currentBook,
      };
    },
  },
};
