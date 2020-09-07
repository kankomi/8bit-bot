import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export type SqliteDatabase = Database<sqlite3.Database, sqlite3.Statement>;
