import { getBookList } from '../services/books';

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
  },
  reducers: {
    saveAllBooks(state, action) {
      return {
        ...state,
        books: action.books,
      };
    },
  },
};
