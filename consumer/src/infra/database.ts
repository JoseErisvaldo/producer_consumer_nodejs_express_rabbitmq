import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'pedidos',
  password: 'postgres',
  port: 5432,
  ssl: false, 
});

export const connect = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Error connecting to PostgreSQL', error);
    process.exit(1);
  }
};

export const close = async () => {
  await pool.end();
};
