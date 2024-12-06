const express = require("express");
const path = require("path");

const app = express();

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname)));

// Example query function
/**function QueryArtistsWithMultipleGenres(decade) {
    // This is a mock implementation. Replace this with your actual logic.
    const mockData = {
        1980: "50 artists worked across genres in the 1980s.",
        1990: "40 artists worked across genres in the 1990s.",
        2000: "60 artists worked across genres in the 2000s.",
    };
    return mockData[decade] || "No data available for the selected decade.";
}**/

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
});

