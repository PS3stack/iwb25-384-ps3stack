import ballerina/http;
import ballerina/io;
import auth_service.authservice;

// --- Configurable Variables ---
configurable int HTTP_PORT = ?;

// --- Constants ---
const SERVICE_NAME = "Auth Service";

public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
    io:println("Database client initialized successfully.");
}
service / on new http:Listener(HTTP_PORT) {
    resource function get .() returns string {
        return "Hello from " + SERVICE_NAME;
    }

    // Add more resources or functions as needed

}

