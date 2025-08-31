// ==========================================
// REQUEST ROUTING MODULE FOR API GATEWAY
// ==========================================
// This module handles request forwarding to backend services

import ballerina/http;
import ballerina/log;
import api_gateway.gateway;
import api_gateway.auth;

// Forward request to auth service (no authentication required for login endpoints)
public isolated function forwardToAuthService(string method, string path, json? payload, http:Request? originalReq, http:Client authClient) returns http:Response|error {
    
    log:printInfo("Forwarding " + method + " request to auth service: " + path);
    
    http:Response|error response = error("Method not supported");
    
    // Route to appropriate HTTP method
    if method == "GET" {
        response = authClient->get(path);
    } else if method == "POST" {
        response = authClient->post(path, payload);
    } else if method == "PUT" {
        response = authClient->put(path, payload);
    } else if method == "DELETE" {
        response = authClient->delete(path);
    } else {
        log:printError("Unsupported HTTP method: " + method);
        return gateway:createErrorResponse(405, "Method not allowed");
    }
    
    if response is error {
        log:printError("Error forwarding to auth service: " + response.message());
        return gateway:createErrorResponse(503, "Authentication service temporarily unavailable");
    }
    
    // Add CORS headers to the response
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    
    log:printInfo("Successfully forwarded request to auth service");
    return response;
}

// Forward request without authentication (for health checks and public endpoints)
public isolated function forwardRequestWithoutAuth(string method, string path, json? payload, http:Request originalReq, http:Client targetClient, string serviceName) returns http:Response|error {
    
    log:printInfo("Forwarding public " + method + " request to " + serviceName + ": " + path);
    
    http:Response|error response = error("Method not supported");
    
    // Route to appropriate HTTP method
    if method == "GET" {
        response = targetClient->get(path);
    } else if method == "POST" {
        response = targetClient->post(path, payload);
    } else if method == "PUT" {
        response = targetClient->put(path, payload);
    } else if method == "DELETE" {
        response = targetClient->delete(path);
    } else {
        log:printError("Unsupported HTTP method: " + method);
        return gateway:createErrorResponse(405, "Method not allowed");
    }
    
    if response is error {
        log:printError("Error forwarding request to " + serviceName + ": " + response.message());
        return gateway:createErrorResponse(503, serviceName + " temporarily unavailable");
    }
    
    // Add CORS headers to the response
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    
    log:printInfo("Successfully forwarded request to " + serviceName);
    return response;
}

// Forward authenticated request to backend service
public isolated function forwardRequestWithAuth(string method, string path, json? payload, http:Request originalReq, http:Client targetClient, string serviceName) returns http:Response|error {
    
    // First verify authentication
    gateway:AuthError? authError = auth:checkAuthentication(originalReq);
    if authError is gateway:AuthError {
        log:printWarn("Authentication failed for request to " + serviceName + ": " + authError.message);
        return gateway:createErrorResponse(authError.statusCode, authError.message);
    }
    
    log:printInfo("Forwarding authenticated " + method + " request to " + serviceName + ": " + path);
    
    http:Response|error response = error("Method not supported");
    
    // Route to appropriate HTTP method
    if method == "GET" {
        response = targetClient->get(path);
    } else if method == "POST" {
        response = targetClient->post(path, payload);
    } else if method == "PUT" {
        response = targetClient->put(path, payload);
    } else if method == "DELETE" {
        response = targetClient->delete(path);
    } else {
        log:printError("Unsupported HTTP method: " + method);
        return gateway:createErrorResponse(405, "Method not allowed");
    }
    
    if response is error {
        log:printError("Error forwarding request to " + serviceName + ": " + response.message());
        return gateway:createErrorResponse(503, serviceName + " temporarily unavailable");
    }
    
    // Add CORS headers to the response
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    
    log:printInfo("Successfully forwarded request to " + serviceName);
    return response;
}

// Forward request with role-based authorization
public isolated function forwardWithRoleCheck(string method, string path, json? payload, http:Request originalReq, http:Client targetClient, string serviceName, string roleType) returns http:Response|error {
    
    // Check role-based authorization based on role type
    gateway:AuthError? authError = ();
    if roleType == "admin" {
        authError = auth:checkAdminRole(originalReq);
    } else if roleType == "admin_or_observer" {
        authError = auth:checkAdminOrObserverRole(originalReq);
    } else if roleType == "polling_staff_or_admin" {
        authError = auth:checkPollingStaffOrAdminRole(originalReq);
    } else if roleType == "field_staff_or_admin" {
        authError = auth:checkFieldStaffOrAdminRole(originalReq);
    } else {
        authError = auth:checkAuthentication(originalReq);
    }
    
    if authError is gateway:AuthError {
        log:printWarn("Authorization failed for request to " + serviceName + ": " + authError.message);
        return gateway:createErrorResponse(authError.statusCode, authError.message);
    }
    
    log:printInfo("Forwarding authorized " + method + " request to " + serviceName + ": " + path);
    
    http:Response|error response = error("Method not supported");
    
    // Route to appropriate HTTP method
    if method == "GET" {
        response = targetClient->get(path);
    } else if method == "POST" {
        response = targetClient->post(path, payload);
    } else if method == "PUT" {
        response = targetClient->put(path, payload);
    } else if method == "DELETE" {
        response = targetClient->delete(path);
    } else {
        log:printError("Unsupported HTTP method: " + method);
        return gateway:createErrorResponse(405, "Method not allowed");
    }
    
    if response is error {
        log:printError("Error forwarding request to " + serviceName + ": " + response.message());
        return gateway:createErrorResponse(503, serviceName + " temporarily unavailable");
    }
    
    // Add CORS headers to the response
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    
    log:printInfo("Successfully forwarded authorized request to " + serviceName);
    return response;
}

// Election service routing helpers
public isolated function forwardToElectionService(string method, string path, json? payload, http:Request req, http:Client electionClient) returns http:Response|error {
    return forwardRequestWithAuth(method, path, payload, req, electionClient, "Election Service");
}

public isolated function forwardToElectionServiceWithAdminRole(string method, string path, json? payload, http:Request req, http:Client electionClient) returns http:Response|error {
    return forwardWithRoleCheck(method, path, payload, req, electionClient, "Election Service", "admin");
}

public isolated function forwardToElectionServiceWithAdminOrObserverRole(string method, string path, json? payload, http:Request req, http:Client electionClient) returns http:Response|error {
    return forwardWithRoleCheck(method, path, payload, req, electionClient, "Election Service", "admin_or_observer");
}

// Health check routing (no authentication required)
public isolated function forwardToElectionServiceHealth(string method, string path, json? payload, http:Request req, http:Client electionClient) returns http:Response|error {
    return forwardRequestWithoutAuth(method, path, payload, req, electionClient, "Election Service");
}

// Voter service routing helpers
public isolated function forwardToVoterService(string method, string path, json? payload, http:Request req, http:Client voterClient) returns http:Response|error {
    return forwardRequestWithAuth(method, path, payload, req, voterClient, "Voter Service");
}

public isolated function forwardToVoterServiceWithPollingStaffRole(string method, string path, json? payload, http:Request req, http:Client voterClient) returns http:Response|error {
    return forwardWithRoleCheck(method, path, payload, req, voterClient, "Voter Service", "polling_staff_or_admin");
}

// Health check routing (no authentication required)
public isolated function forwardToVoterServiceHealth(string method, string path, json? payload, http:Request req, http:Client voterClient) returns http:Response|error {
    return forwardRequestWithoutAuth(method, path, payload, req, voterClient, "Voter Service");
}

// Support service routing helpers
public isolated function forwardToSupportService(string method, string path, json? payload, http:Request req, http:Client supportClient) returns http:Response|error {
    return forwardRequestWithAuth(method, path, payload, req, supportClient, "Support Service");
}

// Health check routing (no authentication required)
public isolated function forwardToSupportServiceHealth(string method, string path, json? payload, http:Request req, http:Client supportClient) returns http:Response|error {
    return forwardRequestWithoutAuth(method, path, payload, req, supportClient, "Support Service");
}

// Census service routing helpers (admin access required)
public isolated function forwardToCensusService(string method, string path, json? payload, http:Request req, http:Client censusClient) returns http:Response|error {
    return forwardWithRoleCheck(method, path, payload, req, censusClient, "Census Service", "admin");
}

// Health check routing (no authentication required)
public isolated function forwardToCensusServiceHealth(string method, string path, json? payload, http:Request req, http:Client censusClient) returns http:Response|error {
    return forwardRequestWithoutAuth(method, path, payload, req, censusClient, "Census Service");
}

// Auth service health check (no authentication required)
public isolated function forwardToAuthServiceHealth(string method, string path, json? payload, http:Request req, http:Client authClient) returns http:Response|error {
    return forwardRequestWithoutAuth(method, path, payload, req, authClient, "Auth Service");
}
