// ==========================================
// AUTHENTICATION MODULE FOR API GATEWAY
// ==========================================
// This module handles all authentication and authorization logic

import ballerina/http;
import ballerina/time;
import ballerina/log;
import api_gateway.gateway;

// Extract and validate JWT token from HTTP cookies
public isolated function extractAndValidateToken(http:Request req) returns gateway:UserClaims|gateway:AuthError {
    // Extract authentication token from cookies
    http:Cookie[] cookies = req.getCookies();
    string? token = ();
    
    foreach http:Cookie cookie in cookies {
        if cookie.name == "auth_token" {
            token = cookie.value;
            break;
        }
    }
    
    if token is () {
        log:printWarn("Authentication failed: No token found in request");
        return {message: "Authentication required - no token found", statusCode: 401};
    }
    
    // Simple token validation - in production, implement proper JWT validation
    string[] tokenParts = gateway:splitString(token, ".");
    if tokenParts.length() != 2 {
        log:printWarn("Authentication failed: Invalid token format");
        return {message: "Invalid token format", statusCode: 401};
    }
    
    // Simplified token validation - decode payload
    string|error payloadStr = gateway:decodeBase64ToString(tokenParts[0]);
    if payloadStr is error {
        log:printWarn("Authentication failed: Invalid token encoding");
        return {message: "Invalid token encoding", statusCode: 401};
    }
    
    json|error payloadJson = payloadStr.fromJsonString();
    if payloadJson is error {
        log:printWarn("Authentication failed: Invalid token JSON");
        return {message: "Invalid token JSON", statusCode: 401};
    }
    
    // Extract and validate user claims
    gateway:UserClaims|error claims = payloadJson.cloneWithType(gateway:UserClaims);
    if claims is error {
        log:printWarn("Authentication failed: Invalid token claims");
        return {message: "Invalid token claims", statusCode: 401};
    }
    
    // Check token expiration
    int currentTime = time:utcNow()[0];
    if claims.exp < currentTime {
        log:printWarn("Authentication failed: Token expired for user: " + claims.sub);
        return {message: "Token expired", statusCode: 401};
    }
    
    log:printInfo("Authentication successful for user: " + claims.sub + " with role: " + claims.role_id);
    return claims;
}

// Basic authentication check - verifies if user is authenticated
public isolated function checkAuthentication(http:Request req) returns gateway:AuthError? {
    gateway:UserClaims|gateway:AuthError result = extractAndValidateToken(req);
    if result is gateway:AuthError {
        return result;
    }
    return ();
}

// Admin role check - verifies if user has administrator privileges
public isolated function checkAdminRole(http:Request req) returns gateway:AuthError? {
    gateway:UserClaims|gateway:AuthError result = extractAndValidateToken(req);
    if result is gateway:AuthError {
        return result;
    }
    
    // Role ID 1 = Admin
    if result.role_id != gateway:ADMIN {
        log:printWarn("Authorization failed: Admin access required for user: " + result.sub);
        return {message: "Administrator access required", statusCode: 403};
    }
    return ();
}

// Admin or Observer role check - allows both admins and observers
public isolated function checkAdminOrObserverRole(http:Request req) returns gateway:AuthError? {
    gateway:UserClaims|gateway:AuthError result = extractAndValidateToken(req);
    if result is gateway:AuthError {
        return result;
    }
    
    // Role ID 1 = Admin, 2 = Observer
    if result.role_id != gateway:ADMIN && result.role_id != gateway:OBSERVER {
        log:printWarn("Authorization failed: Admin or Observer access required for user: " + result.sub);
        return {message: "Administrator or Observer access required", statusCode: 403};
    }
    return ();
}

// Polling Staff or Admin role check - for polling station operations
public isolated function checkPollingStaffOrAdminRole(http:Request req) returns gateway:AuthError? {
    gateway:UserClaims|gateway:AuthError result = extractAndValidateToken(req);
    if result is gateway:AuthError {
        return result;
    }
    
    // Role ID 1 = Admin, 4 = Polling Staff
    if result.role_id != gateway:ADMIN && result.role_id != gateway:POLLING_STAFF {
        log:printWarn("Authorization failed: Polling Staff or Admin access required for user: " + result.sub);
        return {message: "Polling Staff or Administrator access required", statusCode: 403};
    }
    return ();
}

// Field Staff or Admin role check - for field operations
public isolated function checkFieldStaffOrAdminRole(http:Request req) returns gateway:AuthError? {
    gateway:UserClaims|gateway:AuthError result = extractAndValidateToken(req);
    if result is gateway:AuthError {
        return result;
    }
    
    // Role ID 1 = Admin, 3 = Field Staff
    if result.role_id != gateway:ADMIN && result.role_id != gateway:FIELD_STAFF {
        log:printWarn("Authorization failed: Field Staff or Admin access required for user: " + result.sub);
        return {message: "Field Staff or Administrator access required", statusCode: 403};
    }
    return ();
}

// Get current user from request
public isolated function getCurrentUser(http:Request req) returns gateway:UserClaims|gateway:AuthError {
    return extractAndValidateToken(req);
}

// Check if user has specific role
public isolated function hasRole(http:Request req, gateway:UserRole role) returns boolean {
    gateway:UserClaims|gateway:AuthError result = extractAndValidateToken(req);
    if result is gateway:AuthError {
        return false;
    }
    return result.role_id == role;
}
