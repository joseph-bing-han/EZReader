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
      id: { type: types.INTEGER, primary_key: true }, // For while only supports id as primary key
      path: { type: types.TEXT, not_null: true },
      length: { type: types.INTEGER, not_null: true, default: 0 },
      position: { type: types.INTEGER, not_null: true, default: 0 },
      updated_at: { type: types.INTEGER, not_null: true, default: () => Date.now() },
    };
  }
}

export async function getBookList() {
  Book.createTable();
  return Book.query({ order: 'updated_at DESC' });
}
