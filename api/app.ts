import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

import { logger } from './logger.ts';

// ENVIRONMENT VARIABLES
import path from 'path';
import dotenv from 'dotenv';

// dynamically resolve the .env file path based on the current working directory
dotenv.config({ path: path.resolve(process.cwd(), './.env') });

// DATABASE
export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

db.connect(err => {
    if (err) {
        logger.error({ error: err }, "Database connection failed")
        return
    }
    logger.info("Connected to MySQL database")
})

// SERVER
import indexApi from './routes/index.ts' // API router

export const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json()) // for parsing JSON

// Debugging
// app.use((req, res, next) => {
//     logger.info(`${req.method} ${req.path}`);
//     next();
// });

// API routing
app.use('/api', indexApi);

// Start the server
if (process.env.NODE_ENV !== 'test') { // this is to avoid open handles when running tests
    app.listen(PORT, () => {
        logger.info(
            `App started in '${process.env.NODE_ENV || "development"
            } mode' listening on port ${PORT}!`
        );
    })
}