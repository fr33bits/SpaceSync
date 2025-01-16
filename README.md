# SpaceSync

SpaceSync is a room reservation and scheduling app

## Set up

### Prerequesites

- You must have [Node](https://nodejs.org/en) and [MySQL Community Server](https://dev.mysql.com/downloads/) installed.
- The MySQL database must be set up with the username `root` and your chosen password (which you'll need in later steps).
- You can verify your MySQL installation using the command `mysql --version`.
- If the `mysql` command is not recognized, you may have to add it to your `PATH` variable.

### Preparing the app

1. Clone this repository into your current chosen directory: `git clone https://github.com/fr33bits/SpaceSync.git`
2. Moved into the cloned directory: `cd SpaceSync`
3. Install the necessary packages using npm: `npm install`

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

1. Move into the `api` directory: `cd api`
2. Run `node app.js`. You should get a message saying that the app started on a certain port and is connected to the MySQL database.
