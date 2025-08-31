import ballerina/http;
import ballerina/time;
import ballerina/lang.array;

// Standard error response creation
public isolated function createErrorResponse(int statusCode, string message) returns http:Response {
    http:Response response = new;
    response.statusCode = statusCode;
    response.setJsonPayload({
        "success": false,
        "message": message,
        "timestamp": time:utcNow()[0]
    });
    response.setHeader("Content-Type", "application/json");
    // Add CORS headers
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    return response;
}

// Success response creation
public isolated function createSuccessResponse(json data, string message = "Success") returns http:Response {
    http:Response response = new;
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "message": message,
        "data": data,
        "timestamp": time:utcNow()[0]
    });
    response.setHeader("Content-Type", "application/json");
    // Add CORS headers
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    return response;
}

// Split string utility
public isolated function splitString(string input, string delimiter) returns string[] {
    // Simple implementation to split on '.' for JWT tokens
    if delimiter == "." {
        int? dotIndex = input.indexOf(".");
        if dotIndex is int {
            string part1 = input.substring(0, dotIndex);
            string part2 = input.substring(dotIndex + 1);
            return [part1, part2];
        }
    }
    return [input];
}

// Base64 decode utility
public isolated function decodeBase64ToString(string input) returns string|error {
    byte[]|error decodedBytes = array:fromBase64(input);
    if decodedBytes is error {
        return decodedBytes;
    }
    return string:fromBytes(decodedBytes);
}

// Get current timestamp
public isolated function getCurrentTimestamp() returns int {
    return time:utcNow()[0];
}

// Generate unique request ID
public isolated function generateRequestId() returns string {
    int timestamp = time:utcNow()[0];
    return "req_" + timestamp.toString();
}
