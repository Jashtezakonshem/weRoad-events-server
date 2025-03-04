const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to JSON file
const jsonFilePath = path.resolve(__dirname, "../samples/events.json");
const dbFilePath = path.resolve(__dirname, "../prisma/weroad.db");

// Read JSON file
const jsonData = fs.readFileSync(jsonFilePath, "utf8");
const events = JSON.parse(jsonData);

// Connect to SQLite database (or create it if not exists)
const db = new sqlite3.Database(dbFilePath);

// Create the events table
db.serialize(() => {
    // Prepare insert statement
    const stmt = db.prepare("INSERT INTO Event (id, title, description, location, date, capacity) VALUES (?, ?, ?, ?, ?, ?)");

    // Insert each event into the table
    events.forEach(event => {
        stmt.run(event.id, event.title, event.description, event.location, event.date, event.capacity);
    });

    // Finalize statement
    stmt.finalize();
});

// Close the database connection
db.close(() => {
    console.log("Data successfully inserted into SQLite database.");
});
