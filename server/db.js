'use strict';

// Just define and ensure the connection to the database

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './db/tasks.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

module.exports = db;
