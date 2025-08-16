import auth_service.authservice as auth;

import ballerina/http;
import ballerina/io;

// --- Configurable Variables ---
configurable int HTTP_PORT = ?;

// --- Constants ---
const SERVICE_NAME = "Auth Service";

public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
    io:println("Database client initialized successfully.");
}

service /auth on new http:Listener(HTTP_PORT) {
    resource function post observer/login(auth:LoginRequest req) returns auth:LoginResponse|http:Response|error {
        auth:LoginResponse|error response = auth:loginUser(req);
        if response is error {
            return error("Error logging in observer: " + response.message());
        }
        if response.success && response.token is string{
            http:Response httpResponse = new;
            http:Cookie authCookie = auth:createAuthCookie(response.token.toString(), 1);
            httpResponse.addCookie(authCookie);
            httpResponse.setJsonPayload(response.toJson());
            
            return httpResponse;
        }
        return response;
    }

    resource function post polling_staff/login(auth:LoginRequest req) returns auth:LoginResponse|http:Response|error {
        auth:LoginResponse|error response = auth:loginUser(req);
        if response is error {
            return error("Error logging in polling staff: " + response.message());
        }
        if response.success && response.token is string {
            http:Response httpResponse = new;
            http:Cookie authCookie = auth:createAuthCookie(response.token.toString(), 1);
            httpResponse.addCookie(authCookie);
            httpResponse.setJsonPayload(response.toJson());
            
            return httpResponse;
        }
        return response;
    }

    resource function post admin/login(auth:LoginRequest req) returns auth:LoginResponse|http:Response|error {
        auth:LoginResponse|error response = auth:loginUser(req);
        if response is error {
            return error("Error logging in admin: " + response.message());
        }

        if response.success && response.token is string {
            http:Response httpResponse = new;
            http:Cookie authCookie = auth:createAuthCookie(response.token.toString(), 1);
            httpResponse.addCookie(authCookie);
            httpResponse.setJsonPayload(response.toJson());
            
            return httpResponse;
        }
        return response;
    }

    resource function post logout(http:Request req) returns http:Response|error {
        // Extract token from cookie for session cleanup if needed
        string|error token = auth:extractTokenFromRequest(req);
        http:Response httpResponse = new;
        if token is string {
            io:println("Logging out user with token: " + token);
        }
        // Create logout cookie (expires immediately)
        http:Cookie logoutCookie = auth:createAuthCookie("auth_token", 0);
        
        httpResponse.addCookie(logoutCookie);
        httpResponse.setJsonPayload({
            "success": true,
            "message": "Logged out successfully"
        });
        
        return httpResponse;
    }

}
