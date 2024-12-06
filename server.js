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

//const mysql = require("mysql2/promise");

// Query function: Top Genre by Decade
async function QueryTopGenreByDecade(decade) {
    const query = `
        SELECT a.main_genre AS genre, 
               SUM(s.popularity) AS total_popularity
        FROM songs s
        JOIN tracks t ON s.song_id = t.song_id
        JOIN releases r ON t.album_id = r.album_id
        JOIN artists a ON r.artist_id = a.artist_id
        WHERE FLOOR(YEAR(r.release_date) / 10) * 10 = ?
        GROUP BY a.main_genre
        ORDER BY total_popularity DESC
        LIMIT 1;
    `;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(connectionConfig);

        // Execute the query with the given decade parameter
        const [rows] = await connection.execute(query, [decade]);

        // Close the connection
        await connection.end();

        // Return the result or a no-data message
        if (rows.length > 0) {
            const genre = rows[0].genre;
            const totalPopularity = rows[0].total_popularity;
            return `Top Genre in ${decade}: ${genre} (Total Popularity: ${totalPopularity})`;
        } else {
            return `No data found for the decade: ${decade}`;
        }
    } catch (error) {
        console.error("Error querying the database:", error);
        return "An error occurred while querying the database.";
    }
}
async function QueryGenreCollaborationsByUserInput(genre) {
    const query = `
        SELECT FLOOR(YEAR(r.release_date) / 10) * 10 AS decade, 
               COUNT(DISTINCT s.song_id) AS collaboration_count
        FROM songs s
        JOIN tracks t ON s.song_id = t.song_id
        JOIN releases r ON t.album_id = r.album_id
        JOIN artists a ON r.artist_id = a.artist_id
        WHERE s.artists LIKE '%,%' AND a.main_genre = ?
        GROUP BY FLOOR(YEAR(r.release_date) / 10) * 10
        ORDER BY decade;
    `;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(connectionConfig);

        // Execute the query with the given genre parameter
        const [rows] = await connection.execute(query, [genre]);

        // Close the connection
        await connection.end();

        // Format and return the result
        if (rows.length > 0) {
            let result = "Decade | Collaboration Count\n-----------------------------\n";
            rows.forEach((row) => {
                result += `${row.decade} | ${row.collaboration_count}\n`;
            });
            return result.trim();
        } else {
            return `No data found for genre: ${genre}`;
        }
    } catch (error) {
        console.error("Error querying the database:", error);
        return "An error occurred while querying the database.";
    }
}
async function QueryTopArtistByDecade(decade) {
    const query = `
        SELECT a.name AS artist, 
               SUM(s.popularity) AS total_popularity
        FROM songs s
        JOIN tracks t ON s.song_id = t.song_id
        JOIN releases r ON t.album_id = r.album_id
        JOIN artists a ON r.artist_id = a.artist_id
        WHERE FLOOR(YEAR(r.release_date) / 10) * 10 = ?
        GROUP BY a.name
        ORDER BY total_popularity DESC
        LIMIT 1;
    `;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(connectionConfig);

        // Execute the query with the given decade parameter
        const [rows] = await connection.execute(query, [decade]);

        // Close the connection
        await connection.end();

        // Return the result or a no-data message
        if (rows.length > 0) {
            const artist = rows[0].artist;
            const totalPopularity = rows[0].total_popularity;
            return `Top Artist in ${decade}: ${artist} (Total Popularity: ${totalPopularity})`;
        } else {
            return `No data found for the decade: ${decade}`;
        }
    } catch (error) {
        console.error("Error querying the database:", error);
        return "An error occurred while querying the database.";
    }
}

async function QuerySongQuantityByDecade(decade) {
    const query = `
        SELECT COUNT(s.song_id) AS song_count
        FROM songs s
        JOIN tracks t ON s.song_id = t.song_id
        JOIN releases r ON t.album_id = r.album_id
        WHERE FLOOR(YEAR(r.release_date) / 10) * 10 = ?;
    `;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(connectionConfig);

        // Execute the query with the given decade parameter
        const [rows] = await connection.execute(query, [decade]);

        // Close the connection
        await connection.end();

        // Return the result or a no-data message
        if (rows.length > 0) {
            const songCount = rows[0].song_count;
            return `Number of songs in ${decade}: ${songCount}`;
        } else {
            return `No data found for the decade: ${decade}`;
        }
    } catch (error) {
        console.error("Error querying the database:", error);
        return "An error occurred while querying the database.";
    }
}

async function QueryArtistsCareers(genre) {
    const query = `
        SELECT 
            a.main_genre AS genre,
            AVG(TIMESTAMPDIFF(YEAR, release_dates.min_date, release_dates.max_date)) AS avg_active_years
        FROM 
            artists a
        JOIN 
            (SELECT artist_id, MIN(release_date) AS min_date, MAX(release_date) AS max_date 
             FROM albums 
             JOIN releases ON albums.album_id = releases.album_id 
             GROUP BY artist_id) AS release_dates 
        ON a.artist_id = release_dates.artist_id
        WHERE a.main_genre = ?
        GROUP BY a.main_genre
        ORDER BY avg_active_years DESC
        LIMIT 50;
    `;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(connectionConfig);

        // Execute the query with the given genre parameter
        const [rows] = await connection.execute(query, [genre]);

        // Close the connection
        await connection.end();

        // Format and return the result
        if (rows.length > 0) {
            let result = "Genre | Avg Active Years\n---------------------------\n";
            rows.forEach((row) => {
                result += `${row.genre} | ${row.avg_active_years}\n`;
            });
            return result.trim();
        } else {
            return `No data found for genre: ${genre}`;
        }
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

// API endpoint: Top Genres by Decade
app.get("/api/top-genres", async (req, res) => {
    const { decade } = req.query;

    if (!decade || isNaN(decade)) {
        return res.status(400).json({ message: "Invalid or missing decade parameter." });
    }

    try {
        const result = await QueryTopGenreByDecade(decade);
        res.json({ message: result });
    } catch (error) {
        console.error("Error in /api/top-genres:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});
// API endpoint: Genre Collaborations
app.get("/api/collaborations", async (req, res) => {
    const { genre } = req.query;

    // Validate the input
    if (!genre) {
        return res.status(400).json({ message: "Genre is required." });
    }

    try {
        const result = await QueryGenreCollaborationsByUserInput(genre);
        res.json({ message: result });
    } catch (error) {
        console.error("Error in /api/collaborations:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});
// API endpoint: Top Artists by Decade
app.get("/api/top-artists", async (req, res) => {
    const { decade } = req.query;

    // Validate the input
    if (!decade || isNaN(decade)) {
        return res.status(400).json({ message: "Invalid or missing decade parameter." });
    }

    try {
        const result = await QueryTopArtistByDecade(decade);
        res.json({ message: result });
    } catch (error) {
        console.error("Error in /api/top-artists:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

// API endpoint: Song Quantity by Decade
app.get("/api/song-quantity", async (req, res) => {
    const { decade } = req.query;

    // Validate the input
    if (!decade || isNaN(decade)) {
        return res.status(400).json({ message: "Invalid or missing decade parameter." });
    }

    try {
        const result = await QuerySongQuantityByDecade(decade);
        res.json({ message: result });
    } catch (error) {
        console.error("Error in /api/song-quantity:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

// API endpoint: Artists' Careers by Genre
app.get("/api/artists-careers", async (req, res) => {
    const { genre } = req.query;

    // Validate the input
    if (!genre) {
        return res.status(400).json({ message: "Genre is required." });
    }

    try {
        const result = await QueryArtistsCareers(genre);
        res.json({ message: result });
    } catch (error) {
        console.error("Error in /api/artists-careers:", error);
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


