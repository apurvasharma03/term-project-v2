/**
 * @file Queries.java
 *
 * Implements selected SQL queries on the music database using MySQL and Connector/J.
 */

 import java.sql.Connection;
 import java.sql.DriverManager;
 import java.sql.PreparedStatement;
 import java.sql.ResultSet;
 import java.sql.SQLException;
 import java.util.Scanner;
 
 public class Queries {
     static Connection connection = null;
     private final static String URL = "jdbc:mysql://localhost:3306/musicoset"; // Your DB URL
     private final static String USER = "root"; // Your MySQL username
     private final static String PASSWORD = "Slyder11$"; // Your MySQL password
 
     public static void main(String[] args) {
        System.out.println("Classpath: " + System.getProperty("java.class.path"));
         connectDatabase();
         System.out.println("Database connection established!");
 
         // Example: Find genres with the most artist collaborations
         //Query1();
 
         // Example: Find songs by a specific artist
         Scanner scanner = new Scanner(System.in);
         //System.out.println("Enter artist name:");
         //String artistName = scanner.nextLine();
         //Query2(artistName);

            //System.out.print("Enter the genre: ");
            //String genre = scanner.nextLine();
 
         
         //QueryGenreCollaborations();
         //QueryGenreCollaborationsByUserInput(genre);
         // Collect user input for the decade
         System.out.print("Enter the decade (e.g., 1980, 1990): ");
         int decade = scanner.nextInt();

         // Fetch results for the user-input decade
         //QueryTopGenreByDecade(decade);
         //QueryTopArtistByDecade(decade);
         QueryArtistsWithMultipleGenres(decade);
         scanner.close();
     }
 
     /**
      * Connects to the MySQL database.
      */
      private static void connectDatabase() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Driver loaded successfully!");
    
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Database connection established!");
        } catch (ClassNotFoundException e) {
            System.err.println("Driver not found: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Database connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    
        if (connection == null) {
            System.err.println("Failed to establish a database connection!");
            System.exit(1);
        }
    }
    
 
     /**
      * Finds genres with the most artist collaborations.
      */
     public static void Query1() {
        String query = "SELECT " +
               "a.main_genre AS genre, " +
               "COUNT(DISTINCT s.artists) AS collaboration_count " +
               "FROM songs s " +
               "JOIN artists a ON s.artists = a.artist_id " +
               "GROUP BY a.main_genre " +
               "ORDER BY collaboration_count DESC;";




 
         try (PreparedStatement preparedStatement = connection.prepareStatement(query);
              ResultSet rs = preparedStatement.executeQuery()) {
 
             System.out.println("Genre | Collaboration Count");
             System.out.println("---------------------------");
             while (rs.next()) {
                 String genre = rs.getString("genre");
                 int count = rs.getInt("collaboration_count");
                 System.out.println(genre + " | " + count);
             }
         } catch (SQLException e) {
             System.err.println("Error during Query1: " + e.getMessage());
         }
     }
 
     /**
      * Finds songs by a specific artist.
      */
      public static void Query2(String artistName) {
        // SQL query
        String query = "SELECT song_name, artists, popularity " +
                       "FROM songs " +
                       "WHERE artists LIKE ? " +
                       "ORDER BY popularity DESC";
    
        try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            // Set the parameter for the LIKE clause
            preparedStatement.setString(1, "%" + artistName + "%");
            
            // Execute the query
            ResultSet rs = preparedStatement.executeQuery();
    
            // Print the header
            System.out.println("Song Title | Artists | Popularity Score");
            System.out.println("----------------------------------------");
    
            boolean hasResults = false;
    
            // Iterate through the result set
            while (rs.next()) {
                hasResults = true;
                String songName = rs.getString("song_name");
                String artists = rs.getString("artists");
                int popularity = rs.getInt("popularity");
    
                // Print each row
                System.out.println(songName + " | " + artists + " | " + popularity);
            }
    
            // If no results, display a message
            if (!hasResults) {
                System.out.println("No songs found for artist: " + artistName);
            }
        } catch (SQLException e) {
            // Handle SQL exceptions
            System.err.println("Error during Query2: " + e.getMessage());
        }
    }
    
    public static void QueryGenreCollaborations() {
        String query = "SELECT a.main_genre AS genre, " +
                       "FLOOR(YEAR(r.release_date) / 10) * 10 AS decade, " +
                       "COUNT(DISTINCT s.song_id) AS collaboration_count " +
                       "FROM songs s " +
                       "JOIN tracks t ON s.song_id = t.song_id " +
                       "JOIN releases r ON t.album_id = r.album_id " +
                       "JOIN artists a ON r.artist_id = a.artist_id " +
                       "WHERE s.artists LIKE '%,%' " + // Check for multiple artists
                       "GROUP BY a.main_genre, FLOOR(YEAR(r.release_date) / 10) * 10 " +
                       "ORDER BY genre, decade";
    
        try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            ResultSet rs = preparedStatement.executeQuery();
    
            System.out.println("Genre | Decade | Collaboration Count");
            System.out.println("--------------------------------------");
    
            while (rs.next()) {
                String genre = rs.getString("genre");
                int decade = rs.getInt("decade");
                int count = rs.getInt("collaboration_count");
                System.out.println(genre + " | " + decade + " | " + count);
            }
        } catch (SQLException e) {
            System.err.println("Error during Query: " + e.getMessage());
        }
    }
    
    public static void QueryGenreCollaborationsByUserInput(String genre) {
        String query = "SELECT FLOOR(YEAR(r.release_date) / 10) * 10 AS decade, " +
                       "COUNT(DISTINCT s.song_id) AS collaboration_count " +
                       "FROM songs s " +
                       "JOIN tracks t ON s.song_id = t.song_id " +
                       "JOIN releases r ON t.album_id = r.album_id " +
                       "JOIN artists a ON r.artist_id = a.artist_id " +
                       "WHERE s.artists LIKE '%,%' AND a.main_genre = ? " +
                       "GROUP BY FLOOR(YEAR(r.release_date) / 10) * 10 " +
                       "ORDER BY decade";

        try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            // Set the user input for the genre parameter
            preparedStatement.setString(1, genre);

            // Execute the query
            ResultSet rs = preparedStatement.executeQuery();

            // Print the results
            System.out.println("Decade | Collaboration Count");
            System.out.println("-----------------------------");

            boolean hasResults = false;
            while (rs.next()) {
                hasResults = true;
                int decade = rs.getInt("decade");
                int count = rs.getInt("collaboration_count");
                System.out.println(decade + " | " + count);
            }

            if (!hasResults) {
                System.out.println("No data found for genre: " + genre);
            }
        } catch (SQLException e) {
            System.err.println("Error during Query: " + e.getMessage());
        }
    }
    
    public static void QueryTopGenreByDecade(int decade) {
        String query = "SELECT a.main_genre AS genre, " +
                       "SUM(s.popularity) AS total_popularity " +
                       "FROM songs s " +
                       "JOIN tracks t ON s.song_id = t.song_id " +
                       "JOIN releases r ON t.album_id = r.album_id " +
                       "JOIN artists a ON r.artist_id = a.artist_id " +
                       "WHERE FLOOR(YEAR(r.release_date) / 10) * 10 = ? " +
                       "GROUP BY a.main_genre " +
                       "ORDER BY total_popularity DESC " +
                       "LIMIT 1";

        try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            // Set the decade parameter
            preparedStatement.setInt(1, decade);

            // Execute the query
            ResultSet rs = preparedStatement.executeQuery();

            // Print the result
            if (rs.next()) {
                String genre = rs.getString("genre");
                int totalPopularity = rs.getInt("total_popularity");
                System.out.println("Top Genre in " + decade + ":");
                System.out.println("Genre: " + genre + " | Total Popularity: " + totalPopularity);
            } else {
                System.out.println("No data found for the decade: " + decade);
            }
        } catch (SQLException e) {
            System.err.println("Error during QueryTopGenreByDecade: " + e.getMessage());
        }
    }

    public static void QueryTopArtistByDecade(int decade) {
        String query = "SELECT a.name AS artist, " +
                       "SUM(s.popularity) AS total_popularity " +
                       "FROM songs s " +
                       "JOIN tracks t ON s.song_id = t.song_id " +
                       "JOIN releases r ON t.album_id = r.album_id " +
                       "JOIN artists a ON r.artist_id = a.artist_id " +
                       "WHERE FLOOR(YEAR(r.release_date) / 10) * 10 = ? " +
                       "GROUP BY a.name " +
                       "ORDER BY total_popularity DESC " +
                       "LIMIT 1";

        try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            // Set the decade parameter
            preparedStatement.setInt(1, decade);

            // Execute the query
            ResultSet rs = preparedStatement.executeQuery();

            // Print the result
            if (rs.next()) {
                String artist = rs.getString("artist");
                int totalPopularity = rs.getInt("total_popularity");
                System.out.println("Top Artist in " + decade + ":");
                System.out.println("Artist: " + artist + " | Total Popularity: " + totalPopularity);
            } else {
                System.out.println("No data found for the decade: " + decade);
            }
        } catch (SQLException e) {
            System.err.println("Error during QueryTopArtistByDecade: " + e.getMessage());
        }
    }

    public static void QueryArtistsWithMultipleGenres(int decade) {
        String query = "SELECT COUNT(DISTINCT a.artist_id) AS artist_count " +
                       "FROM artists a " +
                       "JOIN releases r ON a.artist_id = r.artist_id " +
                       "WHERE FLOOR(YEAR(r.release_date) / 10) * 10 = ? " +
                       "AND FIND_IN_SET(a.main_genre, a.genres) = 0";

        try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            // Set the decade parameter
            preparedStatement.setInt(1, decade);

            // Execute the query
            ResultSet rs = preparedStatement.executeQuery();

            // Print the result
            if (rs.next()) {
                int artistCount = rs.getInt("artist_count");
                System.out.println("Number of artists with multiple genres in " + decade + ": " + artistCount);
            } else {
                System.out.println("No data found for the decade: " + decade);
            }
        } catch (SQLException e) {
            System.err.println("Error during QueryArtistsWithMultipleGenres: " + e.getMessage());
        }
    }





    
 }
 