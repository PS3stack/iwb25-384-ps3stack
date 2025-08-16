import ballerina/http;
import ballerina/io;
import voter_service.voter;

// --- Configurable Variables ---
configurable int HTTP_PORT = ?;

// --- Constants ---
const SERVICE_NAME = "Voter Service";

// --- Main Execution ---
public function main() {
    // Initialize the database client on startup by referencing it.
    _ = voter:dbClient; 
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
    io:println("✅ Database client initialized successfully.");
    io:println("✅ Service is ready to accept requests.");
}

// --- HTTP Service ---
service /voter on new http:Listener(HTTP_PORT) {

    isolated resource function post elections/[string electionId]/voters/[string voterId]/check\-in() returns voter:Voter|http:InternalServerError|http:NotFound {
        voter:Voter|error result = voter:checkInVoter(electionId, voterId);
        if result is voter:Voter {
            return result;
        } else {
            if result.message().includes("not found") {
                return http:NOT_FOUND;
            }
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function post cast(voter:Vote vote) returns json|http:InternalServerError|http:BadRequest {
        json|error result = voter:castVote(vote);
        if result is json {
            return result;
        } else {
             if result.message().includes("not ready") {
                return http:BAD_REQUEST;
            }
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function get .() returns json {
        return {
            message: "Welcome to the " + SERVICE_NAME,
            "check-in_endpoint": "/voter/elections/{electionId}/voters/{voterId}/check-in (POST)",
            "cast_vote_endpoint": "/voter/cast (POST)"
        };
    }
}