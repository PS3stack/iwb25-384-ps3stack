import ballerina/http;
import ballerina/log;
import ballerina/time;
import api_gateway.gateway;

// Check if a service is healthy
public isolated function checkServiceHealth(http:Client serviceClient, string serviceName) returns boolean {
    log:printInfo("Checking health for " + serviceName);
    
    string healthPath = "/" + serviceName + "/health";
    http:Response|error result = trap serviceClient->get(healthPath);
    
    if result is http:Response {
        boolean isHealthy = result.statusCode == 200;
        if isHealthy {
            log:printInfo(serviceName + " health check: HEALTHY");
        } else {
            log:printWarn(serviceName + " health check: UNHEALTHY (Status: " + result.statusCode.toString() + ")");
        }
        return isHealthy;
    } else {
        log:printError(serviceName + " health check: UNREACHABLE - " + result.toString());
        return false;
    }
}

// Get detailed service health information
public isolated function getServiceHealthDetails(http:Client serviceClient, string serviceName) returns gateway:ServiceHealth {
    log:printInfo("Getting detailed health for " + serviceName);
    
    string healthPath = "/" + serviceName + "/health";
    http:Response|error result = trap serviceClient->get(healthPath);
    
    if result is http:Response {
        gateway:ServiceHealth health = {
            name: serviceName,
            status: result.statusCode == 200 ? "healthy" : "unhealthy",
            statusCode: result.statusCode,
            statusMessage: (),
            timestamp: time:utcNow()[0]
        };
        
        if result.statusCode == 200 {
            log:printInfo(serviceName + " detailed health check: HEALTHY");
        } else {
            log:printWarn(serviceName + " detailed health check: UNHEALTHY (Status: " + result.statusCode.toString() + ")");
        }
        
        return health;
    } else {
        log:printError(serviceName + " detailed health check: UNREACHABLE - " + result.toString());
        return {
            name: serviceName,
            status: "unreachable",
            statusCode: (),
            statusMessage: result.toString(),
            timestamp: time:utcNow()[0]
        };
    }
}

// Check health of all backend services
public isolated function checkAllServicesHealth(map<http:Client> serviceClients) returns map<boolean> {
    log:printInfo("Starting comprehensive health check of all services");
    
    map<boolean> healthStatus = {};
    
    foreach string serviceName in serviceClients.keys() {
        http:Client? httpClient = serviceClients[serviceName];
        if httpClient is http:Client {
            healthStatus[serviceName] = checkServiceHealth(httpClient, serviceName);
        } else {
            log:printError("Client not found for service: " + serviceName);
            healthStatus[serviceName] = false;
        }
    }
    
    log:printInfo("Health check completed");
    return healthStatus;
}

// Startup health check with detailed logging
public isolated function performStartupHealthCheck(map<http:Client> serviceClients) {
    log:printInfo("Performing startup health check for all backend services...");
    
    int totalServices = serviceClients.length();
    int healthyServices = 0;
    
    foreach string serviceName in serviceClients.keys() {
        http:Client? httpClient = serviceClients[serviceName];
        if httpClient is http:Client {
            boolean isHealthy = checkServiceHealth(httpClient, serviceName);
            if isHealthy {
                healthyServices = healthyServices + 1;
                log:printInfo(serviceName + " - Ready");
            } else {
                log:printWarn(serviceName + " - Not responding");
            }
        } else {
            log:printError(serviceName + " - Client configuration error");
        }
    }

    log:printInfo("Health Check Summary: " + healthyServices.toString() + "/" + totalServices.toString() + " services healthy");

    if healthyServices == totalServices {
        log:printInfo("All backend services are healthy! API Gateway is ready to serve requests.");
    } else {
        log:printWarn("Some backend services are not responding. API Gateway will continue but some features may be unavailable.");
    }
}
