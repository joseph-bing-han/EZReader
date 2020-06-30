import * as SQLite from 'expo-sqlite';
import { BaseModel, types } from 'expo-sqlite-orm';
import { getBy, getOrder } from './setting';

export default class Book extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase('books_info.sqlite');
  }

  static get tableName() {
    return 'books';
  }

  static get columnMapping() {
    return {
      id: {
        type: types.INTEGER,
        primary_key: true,
      },
      name: {
        type: types.TEXT,
        not_null: true,
      },
      uri: {
        type: types.TEXT,
        not_null: true,
      },
      size: {
        type: types.INTEGER,
        not_null: true,
        default: 0,
      },
      position: {
        type: types.INTEGER,
        not_null: true,
        default: 0,
      },
      updated_at: {
        type: types.INTEGER,
        not_null: true,
        default: () => Date.now(),
      },
    };
  }
}

export async function getBookList() {
  Book.createTable();
  const nOrder = await getOrder();
  const nBy = await getBy();
  const order = `${nOrder} ${nBy}`;
  return Book.query({ order });
}

export async function retrieveBookByName(name = '') {
  return Book.findBy({ name_eq: name });
}

export async function retrieveBook(id) {
  return Book.find(id);
}

export async function updateBook(id, name, uri, size = 9999, position = 0) {
  const props = {
    id,
    name,
    uri,
    size,
    position,
    updated_at: Date.now(),
  };
  await Book.update(props);
  return Book.find(id);
}

export async function createBook(name, uri, size) {
  const props = {
    name,
    uri,
    size,
    position: 0,
    updated_at: Date.now(),
  };
  return Book.create(props);
}

export async function deleteBook(id) {
  Book.destroy(id);
}
