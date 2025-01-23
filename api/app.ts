import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

// LOADING ENVIRONMENT VARIABLES
// merely dotenv.config({path: '../.env'}) is not enough when running 'npm start' instead of 'node app.ts' (from the 'api' directory) because it does not correctly load in enviroment variables
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Construct __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// DATABASE
export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err.stack)
        return
    }
    console.log("Connected to MySQL database")
})

// SERVER
import indexApi from './routes/index.ts' // API router

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json()) // for parsing JSON

// Debugging
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
// });

// API routing
app.use('/api', indexApi);

// Start the server
app.listen(PORT, () => {
    console.log(
        `App started in '${process.env.NODE_ENV || "development"
        } mode' listening on port ${PORT}!`
    );
});