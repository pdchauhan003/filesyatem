// import { Pool } from 'pg';

// export const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: process.env.DATABASE,
//     password: process.env.PASSWORD,
//     port: 5432

// })



import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});