import ballerina/http;
import ballerina/io;
import election_service.election;

configurable int HTTP_PORT = ?;
const SERVICE_NAME = "Election Service";

public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
}

service /election on new http:Listener(HTTP_PORT) {

    isolated resource function get .() returns election:Election[]|http:InternalServerError {
        election:Election[]|error result = election:getAllElections();
        if result is election:Election[] {
            return result;
        }
        return http:INTERNAL_SERVER_ERROR;
    }

    isolated resource function get [string id]() returns election:Election|http:InternalServerError|http:NotFound {
        election:Election|error result = election:getElectionById(id);
        if result is election:Election {
            return result;
        }
        if result.message().includes("not found") {
            return http:NOT_FOUND;
        }
        return http:INTERNAL_SERVER_ERROR;
    }
}
