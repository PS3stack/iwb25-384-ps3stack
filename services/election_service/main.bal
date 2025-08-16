import ballerina/http;
import ballerina/io;
import ballerina/log;
import election_service.election;

configurable int HTTP_PORT = ?;
const SERVICE_NAME = "Election Service";

public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
}

service /election on new http:Listener(HTTP_PORT) {

    isolated resource function get .() returns election:Election[]|http:InternalServerError {
        log:printInfo("Received request to get all elections");
        election:Election[]|error result = election:getAllElections();
        if result is election:Election[] {
            log:printInfo("Successfully retrieved " + result.length().toString() + " elections");
            return result;
        }
        log:printError("Error getting all elections: " + result.message());
        return http:INTERNAL_SERVER_ERROR;
    }

    isolated resource function get [string id]() returns election:Election|http:InternalServerError|http:NotFound {
        log:printInfo("Received request for election with ID: " + id);
        
        do {
            election:Election|error result = election:getElectionById(id);
            if result is election:Election {
                log:printInfo("Successfully found election with ID: " + id);
                return result;
            }
            // Check if the error message indicates the election was not found
            string errorMsg = result.message();
            log:printError("Error fetching election with ID " + id + ": " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in getElectionById: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function post .(@http:Payload election:CreateElectionData request) returns election:Election|http:BadRequest|http:InternalServerError {
        log:printInfo("Received POST request to create election with title: " + request.title);
        
        do {
            election:Election|error result = election:createElection(request);
            if result is election:Election {
                log:printInfo("Successfully created election with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error creating election: " + errorMsg);
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in createElection: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function put [string id](@http:Payload election:UpdateElectionData request) returns election:Election|http:BadRequest|http:NotFound|http:InternalServerError {
        log:printInfo("Received PUT request to update election with ID: " + id);
        
        do {
            election:Election|error result = election:updateElection(id, request);
            if result is election:Election {
                log:printInfo("Successfully updated election with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error updating election: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in updateElection: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function delete [string id]() returns http:NoContent|http:NotFound|http:InternalServerError {
        log:printInfo("Received DELETE request for election with ID: " + id);
        
        do {
            error? result = election:deleteElection(id);
            if result is () {
                log:printInfo("Successfully deleted election with ID: " + id);
                return http:NO_CONTENT;
            }

            string errorMsg = result.message();
            log:printError("Error deleting election: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in deleteElection: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
