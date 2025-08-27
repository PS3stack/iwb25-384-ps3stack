import ballerina/http;
import ballerina/time;

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
    return response;
}

// Split string utility
public isolated function splitString(string input, string delimiter) returns string[] {
    // Simplified implementation - in production use proper string:split
    return [input];
}

// Base64 decode utility (simplified)
public isolated function decodeBase64ToString(string input) returns string|error {
    // Simplified implementation - in production use proper base64 decoding
    return input;
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
