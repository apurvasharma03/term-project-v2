# Music Mogul

Music Mogul is an interactive music analytics platform that enables users to explore real-world trends, history, and patterns in music data. Built with a hybrid tech stack, the application offers dynamic querying capabilities on a curated database, enabling insights into artist collaborations, genre trends by decade, cross-genre performers, and more.

## Features

- Search and analyze top genres and artists by decade
- Identify artists with long careers or cross-genre versatility
- Examine collaboration networks across genres and time periods
- View song production trends and data-driven music patterns
- Clean, single-page UI with 6 interactive, query-driven buttons

## Architecture

The project follows a modular full-stack architecture integrating a frontend, backend, and MySQL database.

### Frontend

- Built using HTML and vanilla JavaScript
- Includes 6 dynamic buttons that prompt user input and trigger queries
- Displays JSON query results returned from the backend API

### Backend

- Implemented using Node.js (via `server.js`)
- Routes user input and handles requests using HTTP server logic
- Uses the MySQL2 Node.js library for database interaction

### Java Integration

- Java classes (`HTTPServerExample.java`) define custom HTTP handlers
- Hybrid model to integrate Java-based logic into routing and data handling

### Database

- Powered by MySQL, using a schema created with `testschema.sql`
- Dataset sourced from [MusicOSet](https://musicoset.org)
- Normalized to 3NF for query efficiency and reduced redundancy
- Includes multi-table joins, aggregations, and subqueries

## Example Query Topics

- Top genres by decade
- Cross-genre artist detection
- Most frequent collaborators
- Longest career spans in music history
- Production volume by year and genre

## Dataset

The music data was sourced from MusicOSet, a dataset tailored for music data mining and research. We downloaded and imported CSVs into MySQL using MySQL Workbench and a custom schema.

## Interaction Flow

1. User selects a query option and inputs parameters via the frontend (e.g., decade, genre).
2. Frontend sends an HTTP request to the backend Node.js server.
3. Backend processes input, constructs SQL query, and retrieves results from the MySQL database.
4. Results are returned to the frontend as a JSON response.
5. Frontend dynamically renders the output in a readable format on the webpage.

## Team Members & Responsibilities

- **Apurva**: SQL queries, project proposal, database integration, deployment
- **Robyn**: Git repository setup, proposal writing, data handling
- **Gowri**: SQL development, proposal writing, frontend and backend deployment

## Technologies Used

- Node.js
- Java + HTTP handlers
- MySQL + MySQL2
- HTML/CSS/JavaScript
- MusicOSet dataset

---

Music Mogul is designed for enthusiasts, researchers, and hobbyists looking to explore music through data. Its clean UI and dynamic insights make it a lightweight yet powerful music analytics engine.
