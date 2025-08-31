
import ballerina/http;
import ballerina/log;
import api_gateway.gateway;
import api_gateway.routing;
import api_gateway.health;

configurable int HTTP_PORT = ?;
configurable string authServiceUrl = ?;
configurable string electionServiceUrl = ?;
configurable string voterServiceUrl = ?;
configurable string supportServiceUrl = ?;
configurable string censusServiceUrl = ?;

// Main service initialization
public function main() returns error? {
    log:printInfo("Starting PS3Stack API Gateway on port " + HTTP_PORT.toString());
    map<http:Client> clients = check gateway:getServiceClients(
        authServiceUrl,
        electionServiceUrl,
        voterServiceUrl,
        supportServiceUrl,
        censusServiceUrl
    );
    health:performStartupHealthCheck(clients);
    log:printInfo("PS3Stack API Gateway is ready to serve requests");
    return;
}

service / on new http:Listener(HTTP_PORT) {
    
    // CORS preflight handler
    resource function options [string... pathSegments](http:Request req) returns http:Response {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.statusCode = 200;
        return response;
    }
    
    // Root endpoint - API information
    resource function get .() returns json {
        return {
            "service": "PS3Stack API Gateway",
            "version": "1.0.0",
            "status": "healthy",
            "documentation": "API Gateway for PS3Stack Voting System",
            "timestamp": gateway:getCurrentTimestamp()
        };
    }

    // Health check endpoint for all backend services
    resource function get health() returns json|error {
        map<http:Client> clients = check gateway:getServiceClients(
            authServiceUrl,
            electionServiceUrl,
            voterServiceUrl,
            supportServiceUrl,
            censusServiceUrl
        );
        map<json> serviceHealth = {};
        int healthy = 0;
        int total = 0;
        foreach string name in clients.keys() {
            http:Client? c = clients[name];
            if c is http:Client {
                var details = health:getServiceHealthDetails(c, name);
                serviceHealth[name] = details;
                if details.status == "healthy" {
                    healthy += 1;
                }
            } else {
                serviceHealth[name] = {status: "unreachable"};
            }
            total += 1;
        }
        return {
            overall_status: healthy == total ? "healthy" : "degraded",
            healthy_services: healthy,
            total_services: total,
            services: serviceHealth,
            gateway: {
                name: "PS3Stack API Gateway",
                version: "1.0.0",
                status: "healthy"
            }
        };
    }

    // Path-based catch-all routing for /api/*
    resource function 'default [string... pathSegments](http:Request req) returns http:Response|json|error {
        if pathSegments.length() == 0 {
            return gateway:createErrorResponse(404, "Not found");
        }
        string first = pathSegments[0];
        string method = req.method;
        json|error? payload = ();
        if method == "POST" || method == "PUT" {
            payload = req.getJsonPayload();
        }
        
        // Get clients
        map<http:Client> clients = check gateway:getServiceClients(
            authServiceUrl,
            electionServiceUrl,
            voterServiceUrl,
            supportServiceUrl,
            censusServiceUrl
        );
        
        // Forward based on first path segment
        if first == "api" && pathSegments.length() > 1 {
            string serviceKey = pathSegments[1];
            string subPath = "/";
            string[] subSegments = pathSegments.slice(1);
            if subSegments.length() > 0 {
                subPath += subSegments[0];
                foreach int i in 1 ..< subSegments.length() {
                    subPath += "/" + subSegments[i];
                }
            }
            if serviceKey == "auth" {
                // Auth endpoints (login/logout) - no authentication required
                http:Client? authClient = clients["auth"];
                if authClient is http:Client {
                    if subPath.endsWith("/health") {
                        return routing:forwardToAuthServiceHealth(method, subPath, payload is error ? () : payload, req, authClient);
                    } else {
                        return routing:forwardToAuthService(method, subPath, payload is error ? () : payload, req, authClient);
                    }
                } else {
                    return gateway:createErrorResponse(503, "Auth service unavailable");
                }
            } else if serviceKey == "election" {
                // Election endpoints - no path transformation needed
                string fixedPath = subPath;
                http:Client? electionClient = clients["election"];
                if electionClient is http:Client {
                    // Health check doesn't need authentication
                    if fixedPath == "/election/health" {
                        return routing:forwardToElectionServiceHealth(method, fixedPath, payload is error ? () : payload, req, electionClient);
                    } else if method == "POST" || method == "PUT" || method == "DELETE" {
                        // Admin-only operations for creating/updating/deleting elections
                        return routing:forwardToElectionServiceWithAdminRole(method, fixedPath, payload is error ? () : payload, req, electionClient);
                    } else {
                        // Read operations - basic authentication
                        return routing:forwardToElectionService(method, fixedPath, payload is error ? () : payload, req, electionClient);
                    }
                } else {
                    return gateway:createErrorResponse(503, "Election service unavailable");
                }
            } else if serviceKey == "voters" {
                // Voter endpoints
                string fixedPath = subPath;
                if fixedPath.startsWith("/voters") {
                    fixedPath = "/voter" + fixedPath.substring(7);
                }
                http:Client? voterClient = clients["voter"];
                if voterClient is http:Client {
                    // Health check doesn't need authentication
                    if fixedPath == "/voter/health" {
                        return routing:forwardRequestWithoutAuth(method, fixedPath, payload is error ? () : payload, req, voterClient, "Voter Service");
                    } else if fixedPath == "/voter/cast" {
                        // Casting votes requires voter role
                        return routing:forwardToVoterServiceWithVoterRole(method, fixedPath, payload is error ? () : payload, req, voterClient);
                    } else if fixedPath.includes("/check-in") {
                        // Check-in operations require polling staff or admin role
                        return routing:forwardToVoterServiceWithPollingStaffRole(method, fixedPath, payload is error ? () : payload, req, voterClient);
                    } else {
                        // Other endpoints need basic authentication
                        return routing:forwardToVoterService(method, fixedPath, payload is error ? () : payload, req, voterClient);
                    }
                } else {
                    return gateway:createErrorResponse(503, "Voter service unavailable");
                }
            } else if serviceKey == "support" {
                string fixedPath = subPath;
                // No replacement needed for /support
                http:Client? supportClient = clients["support"];
                if supportClient is http:Client {
                    // Health check doesn't need authentication
                    if fixedPath == "/support/health" {
                        return routing:forwardRequestWithoutAuth(method, fixedPath, payload is error ? () : payload, req, supportClient, "Support Service");
                    } else {
                        // Other endpoints need authentication
                        return routing:forwardToSupportService(method, fixedPath, payload is error ? () : payload, req, supportClient);
                    }
                } else {
                    return gateway:createErrorResponse(503, "Support service unavailable");
                }
            } else if serviceKey == "census" {
                string fixedPath = subPath;
                // No replacement needed for /census
                http:Client? censusClient = clients["census"];
                if censusClient is http:Client {
                    // Health check doesn't need authentication
                    if fixedPath == "/census/health" {
                        return routing:forwardRequestWithoutAuth(method, fixedPath, payload is error ? () : payload, req, censusClient, "Census Service");
                    } else {
                        // Other endpoints need authentication (admin only)
                        return routing:forwardToCensusService(method, fixedPath, payload is error ? () : payload, req, censusClient);
                    }
                } else {
                    return gateway:createErrorResponse(503, "Census service unavailable");
                }
            } else {
                return gateway:createErrorResponse(404, "Unknown API service: " + serviceKey);
            }
        }
        return gateway:createErrorResponse(404, "Not found");
    }
}
