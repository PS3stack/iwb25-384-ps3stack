// ==========================================
// CONFIGURATION MODULE FOR API GATEWAY
// ==========================================
// This module handles all configuration related operations

import ballerina/http;
import ballerina/time;

// Service name constants
public const string SERVICE_NAME = "PS3Stack API Gateway";
public const string SERVICE_VERSION = "1.0.0";

// HTTP client configurations with timeout and retry settings
http:ClientConfiguration clientConfig = {
    timeout: 30.0,
    retryConfig: {
        count: 3,
        interval: 2.0
    }
};

// Service URLs are now passed in from main.bal as configurable values
public function getServiceClients(
    string authServiceUrl,
    string electionServiceUrl,
    string voterServiceUrl,
    string supportServiceUrl,
    string censusServiceUrl
) returns map<http:Client>|error {
    return {
        "auth": check new(authServiceUrl, clientConfig),
        "election": check new(electionServiceUrl, clientConfig),
        "voter": check new(voterServiceUrl, clientConfig),
        "support": check new(supportServiceUrl, clientConfig),
        "census": check new(censusServiceUrl, clientConfig)
    };
}

// Get system health status
public isolated function getSystemHealthStatus() returns json {
    return {
        "service": "PS3Stack API Gateway",
        "version": "1.0.0", 
        "status": "healthy",
        "timestamp": time:utcNow()[0]
    };
}
