const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to JSON file
const jsonFilePath = path.resolve(__dirname, "../samples/event_reservations.json");
const dbFilePath = path.resolve(__dirname, "../prisma/weroad.db");

// Read JSON file
const jsonData = fs.readFileSync(jsonFilePath, "utf8");
const reservations = JSON.parse(jsonData);

// Connect to SQLite database (or create it if not exists)
const db = new sqlite3.Database(dbFilePath);

db.serialize(() => {
    // Prepare insert statement
    const stmt = db.prepare("INSERT INTO Reservation (id, eventId, email, telephone) VALUES (?, ?, ?, ?)");

    // Insert each reservation into the table
    reservations.forEach(reservation => {
        stmt.run(reservation.id, reservation.eventId, reservation.email, reservation.telephone);
    });

    // Finalize statement
    stmt.finalize();
});

// Close the database connection
db.close(() => {
    console.log("Data successfully inserted into SQLite database.");
});
