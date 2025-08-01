import ballerina/http;
import ballerina/io;

configurable int HTTP_PORT = ?;
final string SERVICE_NAME = "SP3 Vote Core API Gateway";

configurable string censusServiceUrl = ?;
configurable string electionServiceUrl = ?;
configurable string supportServiceUrl = ?;
configurable string voterServiceUrl = ?;
configurable string authServiceUrl = ?;

final http:Client censusServiceClient = check new(censusServiceUrl);
final http:Client electionServiceClient = check new(electionServiceUrl);
final http:Client supportServiceClient = check new(supportServiceUrl);
final http:Client voterServiceClient = check new(voterServiceUrl);
final http:Client authServiceClient = check new(authServiceUrl);

service / on new http:Listener(HTTP_PORT) {
    resource function get .() returns json {
        return {
            message: "Welcome to the " + SERVICE_NAME
        };
    }
}

public function main() {
    io:println("API Gateway started on port " + HTTP_PORT.toString());
    io:println("------------------------------------");
    io:println("Checking status of backend services...");

    // Call a function to check the health of each service
    checkServiceHealth("Census Service", censusServiceClient);
    checkServiceHealth("Election Service", electionServiceClient);
    checkServiceHealth("Support Service", supportServiceClient);
    checkServiceHealth("Voter Service", voterServiceClient);
    checkServiceHealth("Auth Service", authServiceClient);

    io:println("------------------------------------");
}

// function to check the health of a given service.
function checkServiceHealth(string name, http:Client svcClient) {
    http:Response|error result = trap svcClient->get("/");
    
    if (result is http:Response) {
        if (result.statusCode == 200) {
            io:println(name + " is running. (Status: " + result.statusCode.toString() + ")");
        } else {
            io:println(name + " responded with an unexpected status code. (Status: " + result.statusCode.toString() + ")");
        }
    } else {
        io:println(name + " is NOT running. (Error: " + result.toString() + ")");
    }
}