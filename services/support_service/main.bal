import ballerina/http;
import ballerina/io;
import ballerina/log;
import support_service.support;
import ballerina/time;

// --- Configurable Variables ---
configurable int HTTP_PORT = ?;

// --- Constants ---
const SERVICE_NAME = "Support Service";

// --- Main Execution ---
public function main() {
    // Initialize the database client on startup by referencing it.
    _ = support:dbClient; 
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
    io:println("Database client initialized successfully.");
    io:println("OpenAI client initialized.");
    io:println("Service is ready to accept requests.");
}

// --- HTTP Service ---
service /support on new http:Listener(HTTP_PORT) {

    // POST /support/chat
    isolated resource function post chat(support:ChatRequest payload) returns json|http:InternalServerError {
        // Call the logic function from the support module
        json|error result = support:getChatReply(payload);
        if result is json {
            return result;
        } else {
            log:printError("Failed to get chat reply", result);
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // GET /support/health
    isolated resource function get health() returns json {
        log:printInfo("Support Service: Health check endpoint called");
        return {
            "service": "Support Service",
            "status": "healthy",
            "timestamp": time:utcNow()
        };
    }
}