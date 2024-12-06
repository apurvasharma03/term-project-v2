/**const express = require("express");
const path = require("path");

const app = express();

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname)));

// Example query function
function QueryArtistsWithMultipleGenres(decade) {
    // This is a mock implementation. Replace this with your actual logic.
    const mockData = {
        1980: "50 artists worked across genres in the 1980s.",
        1990: "40 artists worked across genres in the 1990s.",
        2000: "60 artists worked across genres in the 2000s.",
    };
    return mockData[decade] || "No data available for the selected decade.";
}

// API endpoint to handle cross-genre query
app.get("/api/cross-genre", (req, res) => {
    const { decade } = req.query;
    if (!decade) {
        return res.status(400).json({ message: "Decade is required." });
    }

    const result = QueryArtistsWithMultipleGenres(decade);
    res.json({ message: result });
});

// Serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});**/

const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 8080;

// Database connection configuration
const connectionConfig = {
    host: "localhost",
    user: "root", // Replace with your MySQL username
    password: "Slyder11$", // Replace with your MySQL password
    database: "musicoset",     // Replace with your database name
};

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname)));

// Query function: Cross-Genre Artists
async function QueryArtistsWithMultipleGenres(decade) {
    const query = `
        SELECT COUNT(DISTINCT a.artist_id) AS artist_count
        FROM artists a
        JOIN releases r ON a.artist_id = r.artist_id
        WHERE FLOOR(YEAR(r.release_date) / 10) * 10 = ?
        AND FIND_IN_SET(a.main_genre, a.genres) = 0;
    `;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(connectionConfig);

        // Execute the query with the given decade parameter
        const [rows] = await connection.execute(query, [decade]);

        // Close the connection
        connection.end();

        // Return the result or a no-data message
        if (rows.length > 0) {
            return `Number of artists with multiple genres in ${decade}: ${rows[0].artist_count}`;
        } else {
            return `No data found for the decade: ${decade}`;
        }
    } catch (error) {
        console.error("Error querying the database:", error);
        return "An error occurred while querying the database.";
    }
}

// Query function: Top Genres
async function QueryTopGenres() {
    const query = `
        SELECT genre, COUNT(*) AS count
        FROM genres
        GROUP BY genre
        ORDER BY count DESC
        LIMIT 10;
    `;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(connectionConfig);

        // Execute the query
        const [rows] = await connection.execute(query);

        // Close the connection
        connection.end();

        // Format the result
        return rows.map(row => `${row.genre}: ${row.count} songs`).join("\n");
    } catch (error) {
        console.error("Error querying the database:", error);
        return "An error occurred while querying the database.";
    }
}

// API endpoint: Cross-Genre Artists
app.get("/api/cross-genre", async (req, res) => {
    const { decade } = req.query;

    // Validate the input
    if (!decade || isNaN(decade)) {
        return res.status(400).json({ message: "Invalid or missing decade parameter." });
    }

    try {
        // Call the query function
        const result = await QueryArtistsWithMultipleGenres(decade);
        res.json({ message: result });
    } catch (error) {
        console.error("Error in /api/cross-genre:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

// API endpoint: Top Genres
app.get("/api/top-genres", async (req, res) => {
    try {
        const result = await QueryTopGenres();
        res.json({ message: result });
    } catch (error) {
        console.error("Error in /api/top-genres:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

// Serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


