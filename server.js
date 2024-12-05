const express = require("express");
const path = require("path");

// Create the Express application
const app = express();

// Serve static files (CSS, JS, images, etc.) from the current directory
app.use(express.static(path.join(__dirname)));

// Serve the HTML file for the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html")); // Ensure 'index.html' is in the same directory
});

// Example API endpoint (optional, for backend functionality)
app.get("/api/example", (req, res) => {
    res.json({ message: "This is an example API response." });
});

// Start the server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
