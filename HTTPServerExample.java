import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;

public class HTTPServerExample {

    public static void main(String[] args) throws IOException {
        // Create an HTTP server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Register API endpoints
        server.createContext("/api/cross-genre", new CrossGenreHandler());

        // Start the server
        server.setExecutor(null); // Use the default executor
        server.start();
        System.out.println("Server is running on http://localhost:8080");
    }

    // Static nested class to handle requests for cross-genre query
    static class CrossGenreHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            Map<String, String> queryParams = queryToMap(exchange.getRequestURI().getQuery());
            String decadeStr = queryParams.get("decade");

            if (decadeStr == null || decadeStr.isEmpty()) {
                String response = "Decade is required.";
                exchange.sendResponseHeaders(400, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }

            try {
                int decade = Integer.parseInt(decadeStr);

                // Call the query method in the Queries class
                String result = Queries.QueryArtistsWithMultipleGenres2(decade);

                byte[] responseBytes = result.getBytes();
                exchange.sendResponseHeaders(200, responseBytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(responseBytes);
                }
            } catch (NumberFormatException e) {
                String response = "Invalid decade format. Please enter a valid year (e.g., 1980).";
                exchange.sendResponseHeaders(400, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }

    // Converts query parameters into a map
    public static Map<String, String> queryToMap(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null) return map;

        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            if (keyValue.length > 1) {
                map.put(keyValue[0], keyValue[1]);
            }
        }
        return map;
    }
}
