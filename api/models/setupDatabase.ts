import * as mysql from 'mysql2/promise'; // Import all named (instead of default) exports as an object
import { logger } from '../logger.ts';

import path from 'path';
import dotenv from 'dotenv';

// dynamically resolve the .env file path based on the current working directory
dotenv.config({ path: path.resolve(process.cwd(), './.env') });

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
        logger.info(`Database ${dbConfig.database} created (if it didn't already exist)`);

        // Connect to the database
        await connection.changeUser({ database: dbConfig.database });
        logger.info(`Switched to ${dbConfig.database} database`);

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
            logger.info(`Created 'reservations' table`);
        } catch (error) {
            if (error.code === 'ER_TABLE_EXISTS_ERROR') {
                logger.info(`The table 'reservations' already exists; skipping to next step`);
            } else {
                throw error;
            }
        }

        // Clear table data before inserting new test data
        await connection.query(`TRUNCATE TABLE reservations`);
        logger.info(`Deleted all data from 'reservations' before inserting the test data`);

        // Insert test data
        await connection.query(`
            INSERT INTO reservations (title, start, end, created_at, last_modified_at)
            VALUES
                ('Planiranje strežniške arhitekture', 1737100800, 1737103500, 1737101524, NULL),
                ('Predstavitev finančnega poročila za prejšnji kvartal', 1737103500, 1737105300, 1737099059, 1737101512),
                ('Marketinški brainstorming', 1737112500, 1737114600, 1737108870, NULL);
        `);
        logger.info(`Inserted test data into the 'reservations' table`);

        logger.info('Database setup complete!');
        await connection.end();
    } catch (error) {
        logger.info("Make sure the MySQL server is running and the database credentials are correct");
        logger.error({ err: error }, 'Error creating a database connection');
        process.exit(1);
    }
};

setupDatabase();