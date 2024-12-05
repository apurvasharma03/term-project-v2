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
         Query1();
 
         // Example: Find songs by a specific artist
         Scanner scanner = new Scanner(System.in);
         System.out.println("Enter artist name:");
         String artistName = scanner.nextLine();
         Query2(artistName);
 
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
    
    
    public static void Query4() {
        String query = "SELECT " +
               "a.main_genre AS genre, " +
               "AVG(TIMESTAMPDIFF(YEAR, release_dates.min_date, release_dates.max_date)) AS avg_active_years " +
               "FROM " +
               "artists a " +
               "JOIN " +
               "(SELECT artist_id, MIN(release_date) AS min_date, MAX(release_date) AS max_date " +
               "FROM albums " +
               "JOIN releases ON albums.album_id = releases.album_id " +
               "GROUP BY artist_id) AS release_dates " +
               "ON a.artist_id = release_dates.artist_id " +
               "GROUP BY a.main_genre " +
               "ORDER BY avg_active_years DESC " +
               "LIMIT 50;";


 
         try (PreparedStatement preparedStatement = connection.prepareStatement(query);
              ResultSet rs = preparedStatement.executeQuery()) {
 
             System.out.println("Genre | avg_active_years");
             System.out.println("---------------------------");
             while (rs.next()) {
                 String genre = rs.getString("genre");
                 int count = rs.getInt("avg_active_years");
                 System.out.println(genre + " | " + count);
             }
         } catch (SQLException e) {
             System.err.println("Error during Query4: " + e.getMessage());
         }
     }
    
    
    
 }
 