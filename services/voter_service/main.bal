import ballerina/http;
import ballerina/io;

configurable int HTTP_PORT = ?;
final string SERVICE_NAME = "Voter Service";

service / on new http:Listener(HTTP_PORT) {

    resource function get .() returns json | error {
        return {
            "message": "Welcome to the " + SERVICE_NAME
        };
    }
    
}

public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
}
