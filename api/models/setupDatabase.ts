import * as mysql from 'mysql2/promise'; // Import all named (instead of default) exports as an object

// LOADING ENVIRONMENT VARIABLES
// merely dotenv.config({path: '../.env'}) is not enough when running 'npm start' instead of 'node app.ts' (from the 'api' directory) because it does not correctly load in enviroment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Construct __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const setupDatabase = async () => {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
        console.log(`Database ${dbConfig.database} created (if it didn't already exist)`);

        // Connect to the database
        await connection.changeUser({ database: dbConfig.database });
        console.log(`Switched to ${dbConfig.database} database`);

        // Create tables
        try {
            await connection.query(`
                CREATE TABLE reservations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(300) NOT NULL,
                    start BIGINT NOT NULL,
                    end BIGINT NOT NULL,
                    created_at BIGINT NOT NULL,
                    last_modified_at BIGINT
                );
            `);
            console.log(`Created 'reservations' table`);
        } catch (error) {
            if (error.code === 'ER_TABLE_EXISTS_ERROR') {
                console.log(`The table 'reservations' already exists; skipping to next step`);
            } else {
                throw error;
            }
        }

        // Clear table data before inserting new test data
        await connection.query(`TRUNCATE TABLE reservations`);
        console.log(`Deleted all data from 'reservations' before inserting the test data`);

        // Insert test data
        await connection.query(`
            INSERT INTO reservations (title, start, end, created_at, last_modified_at)
            VALUES
                ('Planiranje strežniške arhitekture', 1737100800, 1737103500, 1737101524, NULL),
                ('Predstavitev finančnega poročila za prejšnji kvartal', 1737103500, 1737105300, 1737099059, 1737101512),
                ('Marketinški brainstorming', 1737112500, 1737114600, 1737108870, NULL);
        `);
        console.log(`Inserted test data into the 'reservations' table`);

        console.log('Database setup complete!');
        await connection.end();
    } catch (error) {
        console.log("Make sure the MySQL server is running and the database credentials are correct");
        console.error('Error creating a database connection:', error);
        process.exit(1);
    }
};

setupDatabase();