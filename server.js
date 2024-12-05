const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Slyder11$",
  database: "musicoset",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MySQL database!");
  }
});

// Default root route
app.get("/", (req, res) => {
  res.send("Welcome to the Music Analysis API!");
});

// Example API endpoint
app.get("/api/artists/multiple-genres", (req, res) => {
  const { decade } = req.query;

  if (!decade) {
    return res.status(400).json({ error: "Decade is required" });
  }

  const query = `
    SELECT COUNT(DISTINCT a.artist_id) AS artist_count
    FROM artists a
    JOIN releases r ON a.artist_id = r.artist_id
    WHERE FLOOR(YEAR(r.release_date) / 10) * 10 = ?
    AND FIND_IN_SET(a.main_genre, a.genres) = 0
  `;

  db.query(query, [decade], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Error executing query" });
    } else {
      res.json({ artistCount: results[0]?.artist_count || 0 });
    }
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
