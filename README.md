# SpaceSync

SpaceSync is a room reservation and scheduling app.

## Set-up

### Prerequisites

- You must have [Node](https://nodejs.org/en) installed, **preferably version 23.6 (in order to be able to run TypeScript code natively without having to use the `--experimental-strip-types` option)**
- You must have [MySQL Community Server](https://dev.mysql.com/downloads/) installed.
- The MySQL database must be set up with the username `root` and your chosen password (which you'll need in later steps).
- You can verify your MySQL installation using the command `mysql --version`.
- If the `mysql` command is not recognized, you may have to add it to your `PATH` variable.

### Preparing the app

1. Clone this repository into your current chosen directory: `git clone https://github.com/fr33bits/SpaceSync.git`
2. Move into the cloned directory: `cd SpaceSync`
3. Install the necessary packages using npm: `npm install`

### Setting up the database

1. In the CLI, first enter the MySQL server using the command `mysql -u root -p` and then, when prompted, enter the server password.
2. Create a new database for this project: `CREATE DATABASE spacesync_db`
3. Enter the database: `USE spacesync_db`
4. Create a new table with the following schema:

```sql
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    start BIGINT NOT NULL, -- UNIX timestamp
    end BIGINT NOT NULL, -- UNIX timestamp
    created_at BIGINT NOT NULL,-- UNIX timestamp
    last_modified_at BIGINT -- UNIX timestamp, NULL if not modified since creation
)
```

5. Optionally, you can also insert test data (or create it yourself later in the app):

```sql
INSERT INTO reservations (title, start, end, created_at, last_modified_at)
VALUES
  ('Planiranje strežniške arhitekture', 1737100800, 1737103500, 1737101524, NULL),
  ('Predstavitev finančnega poročila za prejšnji kvartal', 1737103500, 1737105300, 1737099059, 1737101512),
  ('Marketinški brainstorming', 1737112500, 1737114600, 1737108870, NULL);
```

Alternatively, you can create the same database in MySQL Workbench.

### Setting the envionment variables

In this case the environment variables will be set for a product environment. Port 4000 should generally be availible but if not, you can either kill the process using it or change the port.

1. Create a new `.env` file that will hold your environment variables (e.g. run the `touch .env` command).
2. Inside the `.env` paste the following and replace `<your_mysql_server_password>` with your MySQL server password:

```env
NODE_ENV=production
PORT=4000

DB_HOST=localhost
DB_USER=root
DB_NAME=spacesync_db
DB_PASSWORD=<your_mysql_server_password>
```

### Run the server

1. Make sure you have ts-node installed globally: `npm install -g ts-node`
1. Move into the `api` directory: `cd api`
2. Run `node app.ts`. You should get a message saying that the app started on a certain port and is connected to the MySQL database.

### Start the front-end

These are instructions for running the React front-end in developer mode.

1. Move into the project root directory (if you're in the `api` directory): `cd ..`
2. Run the command `npm run dev`

## Implementation notes

- The title has a maximum character length of 300 and is enforced both on the client and with the database schema.
- The title cannot be empty and that is enforced both on the side of the client and the API server