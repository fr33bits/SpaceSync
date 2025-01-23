# SpaceSync

<picture align="center" width="500">
  <source media="(prefers-color-scheme: dark)" alt="Logo" srcset="public/cover_dark.png">
  <source media="(prefers-color-scheme: light)" alt="Logo" srcset="public/cover_light.png">
  <img alt="Logo" src="cover_light.png">
</picture>

SpaceSync is a room reservation and scheduling app. It's an SPA based on React and TypeScript that talks to a Node.js API server, which connects to a MySQL database.

## Set-up

Tested on: Windows 10, macOS 14

### Prerequisites

- You must have [Node.js](https://nodejs.org/en) installed, **preferably v23.6 or later** as it has native (though experimental) support for TypeScript.
  - `npm` scripts (including `start`) are run with the `--experimental-strip-types` option irrespective of the Node.js version for compatibility with older versions.
  - If you keep experiencing issues, please update to Node.js v23.6 or later.
- You must have [MySQL Community Server](https://dev.mysql.com/downloads/) installed.
- The MySQL database must be set up with the root account (username `root`) and your chosen password (which you'll need in later steps).
  - In case this is needed for troubleshooting purposes, the default port for MySQL installations is 3306.
- You can verify your MySQL installation using the command `mysql --version`.
  - If the `mysql` command is not recognized, you may have to add it to your `PATH` variable.
    - Windows 10 example (may differ based on Windows or MySQL Server versions and other variables): run `set path=%PATH%;set path=%PATH%;C:\Program Files\MySQL\MySQL Server 8.4\bin` in the Command Prompt
- Make sure the MySQL Community Server is up and running. You may have to bring it back online after a system restart.
  - macOS: This can be done in System Settings > MySQL.
- The exact set up may vary for different systems and other prerequisites or dependencies may be needed if not already present (e.g. git)

### Preparing the app

1. Clone this repository into your current chosen directory: `git clone https://github.com/fr33bits/SpaceSync.git`
2. Move into the cloned directory: `cd SpaceSync`
3. Install the necessary packages using npm: `npm install`

### Setting up the database

#### Manual set-up in CLI

1. In the CLI, first enter the MySQL server using the command `mysql -u root -p` and then, when prompted, enter the server password.
2. Create a new database for this project: `CREATE DATABASE spacesync_db;`
3. Enter the database: `USE spacesync_db;`
4. Create a new table with the following schema:

```sql
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    start BIGINT NOT NULL, -- UNIX timestamp
    end BIGINT NOT NULL, -- UNIX timestamp
    created_at BIGINT NOT NULL,-- UNIX timestamp
    last_modified_at BIGINT -- UNIX timestamp, NULL if not modified since creation
);
```

5. Optionally, you can also insert test data (or create it yourself later in the app)[^1]:

```sql
INSERT INTO reservations (title, start, end, created_at, last_modified_at)
VALUES
  ('Planiranje strežniške arhitekture', 1737100800, 1737103500, 1737101524, NULL),
  ('Predstavitev finančnega poročila za prejšnji kvartal', 1737103500, 1737105300, 1737099059, 1737101512),
  ('Marketinški brainstorming', 1737112500, 1737114600, 1737108870, NULL);
```

#### Manual set-up in MySQL Workbench

Alternatively, you can create the same database in MySQL Workbench using the same commands from steps 2-5 as in the 'Manual set-up in CLI' method.

### Setting the envionment variables

In this case the environment variables will be set for a product environment. Port 4000 should generally be availible but if not, you can either kill the process using it or change the port.

1. Change your working directory to the project root directory (if you're not there already)
2. Create a new `.env` file that will hold your environment variables (e.g. run the `touch .env` command).
3. Inside the `.env` paste the following and replace `<your_mysql_server_password>` with your MySQL server password and `<node_environment>` with the mode (`production` or `development` that you want to start the project in[^2]):

```env
NODE_ENV=<node_environment>
PORT=4000

DB_HOST=localhost
DB_USER=root
DB_NAME=spacesync_db
DB_PASSWORD=<your_mysql_server_password>
```

### Run the server

1. Run `npm start` inside one of the project directories (including any project root subdirectories).
2. You should get a message saying that the app started on a certain port and is connected to the MySQL database. If you get an error or otherwise have issues running TypeScript code (`app.ts`) on Node.js.

### Start the front-end

1. Change your working directory to the project root directory (if you're not there already)
2. Depending on which environment your want to start the front end in, run the following commands[^2]:
  - `npm run dev` for developer mode
  - `npm run build` and then `npm run preview` for production mode

## Implementation notes

- Validation is done both on the client and the server with the exception of checking if there's already a reservation in a particular time period, which is only done on the server.
- The title has a maximum character length of 300.
- The title cannot be empty and that is enforced both on the side of the client and the API server.
- The default reservation start time is set at 1 hour from the current time.
- The default reservation end time is set 20 minutes from reservation start time.
- The duration of a reservation must be at least 5 minutes long.
- The duration of a reservation must not exceed 1 day.

[^1]: Warning: Windows may alter non-ASCII characters (e.g. š, č, ž) upon pasting into the Command Prompt or similar.

[^2]: There is presently no functional difference (in terms of the app itself) between the developer and production modes.
