import ballerina/http;
import ballerina/io;
import ballerina/log;
import voter_service.voter;
import ballerina/time;

// --- Configurable Variables ---
configurable int HTTP_PORT = ?;

// --- Constants ---
const SERVICE_NAME = "Voter Service";

// --- Main Execution ---
public function main() {
    // Initialize the database client on startup
    _ = voter:dbClient; 
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
    io:println("Database client initialized successfully.");
    io:println("Service is ready to accept requests.");
}

// --- HTTP Service ---
service /voter on new http:Listener(HTTP_PORT) {

    // POST /voter/elections/{electionId}/voters/{voterId}/check-in
    isolated resource function post elections/[string electionId]/voters/[string voterId]/check\-in() returns voter:Voter|http:InternalServerError|http:NotFound {
        log:printInfo("Received check-in request for voter: " + voterId);
        do {
            voter:Voter|error result = voter:checkInVoter(electionId, voterId);
            if result is voter:Voter {
                log:printInfo("Successfully checked in voter: " + voterId);
                return result;
            }
            string errorMsg = result.message();
            log:printError("Error checking in voter: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error during voter check-in: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // POST /voter/cast
    isolated resource function post cast(@http:Payload voter:Vote vote) returns json|http:InternalServerError|http:BadRequest {
        log:printInfo("Received request to cast vote for voter: " + vote.voterId);
        do {
            json|error result = voter:castVote(vote);
            if result is json {
                log:printInfo("Successfully cast vote for voter: " + vote.voterId);
                return result;
            }
            string errorMsg = result.message();
            log:printError("Error casting vote: " + errorMsg);
            if errorMsg.includes("not ready") {
                return http:BAD_REQUEST;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error during vote casting: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // GET /voter/health
    isolated resource function get health() returns json {
        log:printInfo("Voter Service: Health check endpoint called");
        return {
            "service": "Voter Service",
            "status": "healthy",
            "timestamp": time:utcNow()
        };
    }
}