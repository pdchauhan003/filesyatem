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

export const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL
            );
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                file_url TEXT NOT NULL,
                file_type VARCHAR(50) NOT NULL,
                size BIGINT NOT NULL
            );
        `);
        console.log("Database tables initialized successfully");
    } catch (error) {
        console.error("Error initializing database tables:", error);
    }
};