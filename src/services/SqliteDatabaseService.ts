import { SqliteDatabase } from '../types';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const TABLES = {
  ToeCounter: 'ToeCounter',
};

export default class SqliteDatabaseService {
  private static _db?: SqliteDatabase;

  private constructor() {}

  static async getDatabase(): Promise<SqliteDatabase> {
    if (this._db) return this._db;

    this._db = await open({
      filename: 'database.sqlite3',
      driver: sqlite3.Database,
    });

    await this.createTables(this._db);
    return this._db;
  }

  private static async createTables(db: SqliteDatabase) {
    await db.exec(
      `CREATE TABLE IF NOT EXISTS ToeCounter (
        userId TEXT PRIMARY KEY,
        toeCount INT NOT NULL
    )`
    );
  }
}
