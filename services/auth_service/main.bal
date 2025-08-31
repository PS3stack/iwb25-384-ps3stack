import auth_service.authservice as auth;

import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/time;

// --- Configurable Variables ---
configurable int HTTP_PORT = ?;

// --- Constants ---
const SERVICE_NAME = "Auth Service";

public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
    io:println("Database client initialized successfully.");
}

service /auth on new http:Listener(HTTP_PORT) {
    isolated resource function get health() returns json {
        log:printInfo("Auth Service: Health check endpoint called");
        return {
            "service": "Auth Service",
            "status": "healthy",
            "timestamp": time:utcNow()[0]
        };
    }

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

    resource function post field_staff/login(auth:LoginRequest req) returns auth:LoginResponse|http:Response|error {
        auth:LoginResponse|error response = auth:loginUser(req);
        if response is error {
            return error("Error logging in field staff: " + response.message());
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

    resource function get .(http:Request req) returns json|error {
        return auth:decodeRequest(req);
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

    // Sample data endpoint for testing
    resource function post createSampleData() returns json|error {
        // Create sample users for testing
        auth:User[] sampleUsers = [
            {name: "Admin User", email: "admin@test.com", password_hash: "password123", role_id: 1},
            {name: "Observer User", email: "observer@test.com", password_hash: "password123", role_id: 2},
            {name: "Field Staff User", email: "field@test.com", password_hash: "password123", role_id: 3},
            {name: "Polling Staff User", email: "polling@test.com", password_hash: "password123", role_id: 4}
        ];
        
        int insertedCount = 0;
        foreach auth:User user in sampleUsers {
            var result = auth:insertUser(user);
            if result is error {
                io:println("Failed to insert user: " + user.email + " - " + result.message());
            } else {
                insertedCount += 1;
                io:println("Successfully inserted user: " + user.email);
            }
        }
        
        return {
            "message": "Sample data creation completed",
            "inserted_users": insertedCount,
            "total_attempted": sampleUsers.length()
        };
    }

}
