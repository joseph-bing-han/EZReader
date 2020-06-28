import * as SQLite from 'expo-sqlite';
import { BaseModel, types } from 'expo-sqlite-orm';

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
      page: {
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
  return Book.query({ order: 'updated_at DESC' });
}

export async function retrieveBookByName(name = '') {
  return Book.findBy({ name_eq: name });
}

export async function retrieveBook(id) {
  return Book.find(id);
}

export async function updateBook(id, name, uri, size = 9999, page = 0) {
  const props = {
    id,
    name,
    uri,
    size,
    page,
    updated_at: Date.now(),
  };
  await Book.update(props);
  return Book.find(id);
}

export async function createBook(name, uri) {
  const props = {
    name,
    uri,
    size: 999,
    page: 0,
    updated_at: Date.now(),
  };
  return Book.create(props);
}

export async function deleteBook(id) {
  Book.destroy(id);
}
