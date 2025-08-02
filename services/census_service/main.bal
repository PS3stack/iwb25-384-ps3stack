import ballerina/http;
import ballerina/io;

configurable int HTTP_PORT = ?;
final string SERVICE_NAME = "Census Service";

service / on new http:Listener(HTTP_PORT) {

    resource function get .() returns json | error {
        return {
            "message": "Welcome to the " + SERVICE_NAME
        };
    }
    
}

public function main() {
    io:println("Service started on port " + HTTP_PORT.toString());
}
