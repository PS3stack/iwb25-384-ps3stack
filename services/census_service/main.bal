import census_service.census;

import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/time;

configurable int HTTP_PORT = ?;
final string SERVICE_NAME = "Census Service";

service /census on new http:Listener(HTTP_PORT) {
    isolated resource function get health() returns json {
        log:printInfo("Census Service: Health check endpoint called");
        return {
            "service": "Census Service",
            "status": "healthy",
            "timestamp": time:utcNow()[0]
        };
    }

    resource function post .(@http:Payload census:CensusProject project) returns json|http:InternalServerError {
        int|error result = census:createCensusProject(project);
        if result is error {
            io:println("Error creating census project: " + result.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        census:CensusProject|error createdProject = census:getCensusProjectById(result);
        if createdProject is error {
            io:println("Error retrieving created project: " + createdProject.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        return createdProject.toJson();
    }

    resource function get .() returns json|http:InternalServerError {
        census:CensusProject[]|error projects = census:getAllCensusProjects();
        if projects is error {
            io:println("Error retrieving census projects: " + projects.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        return projects.toJson();
    }

    resource function put [int id](@http:Payload census:CensusProject project) returns json|http:InternalServerError|http:NotFound {
        census:CensusProject|error result = census:updateCensusProject(id, project);
        if result is error {
            if result.message().includes("not found") {
                return http:NOT_FOUND;
            }
            io:println("Error updating census project: " + result.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        return result.toJson();
    }

    isolated resource function delete [int id]() returns http:NoContent|http:NotFound|http:InternalServerError {
        json|error result = census:deleteCensusProject(id);
        if result is error {
            if result.message().includes("not found") {
                return http:NOT_FOUND;
            }
            io:println("Error deleting census project: " + result.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        return http:NO_CONTENT;
    }

    resource function post [int censusId]/staff/upload(@http:Payload byte[] csvData) returns json|http:InternalServerError {
        json|error result = census:uploadStaffData(csvData);
        if result is error {
            io:println("Error uploading staff data: " + result.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        return result;
    }

    resource function get staff/assignments(@http:Header string authorization) returns json|http:InternalServerError|http:Unauthorized {
        string|error staffId = census:extractStaffIdFromToken(authorization);
        if staffId is error {
            return http:UNAUTHORIZED;
        }

        json|error assignments = census:getStaffAssignments(staffId);
        if assignments is error {
            io:println("Error retrieving staff assignments: " + assignments.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        return assignments;
    }

    resource function post [string censusId]/households/upload(@http:Payload byte[] csvData, @http:Header string authorization) returns json|http:InternalServerError|http:Unauthorized {
        string|error staffId = census:extractStaffIdFromToken(authorization);
        if staffId is error {
            return http:UNAUTHORIZED;
        }

        json|error result = census:uploadHouseholdsData(censusId, csvData, staffId);
        if result is error {
            io:println("Error uploading households data: " + result.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        return result;
    }

    resource function post [string censusId]/submissions(@http:Payload json surveyData, @http:Header string authorization, string householdId) returns json|http:InternalServerError|http:Unauthorized {
        string|error staffId = census:extractStaffIdFromToken(authorization);
        if staffId is error {
            return http:UNAUTHORIZED;
        }

        json|error result = census:submitCensusData(householdId, censusId, surveyData, staffId);
        if result is error {
            io:println("Error submitting census data: " + result.message());
            return http:INTERNAL_SERVER_ERROR;
        }

        return result;
    }

    isolated resource function post [string censusId]/fieldStaff(@http:Payload census:FieldStaffAssignment request) returns json|http:BadRequest|http:NotFound|http:InternalServerError {
        io:println("Received POST request to create staff assignment for census ID: " + censusId);
        do {
            json|error result = census:assignFieldStaff(request);
            if result is json {
                io:println("Successfully created staff assignment for census ID: " + censusId);
                return result;
            }

            string errorMsg = result.message();
            io:println("Error creating staff assignment: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            io:println("Unexpected error in createObserver: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}

public function main() {
    io:println("Service started on port " + HTTP_PORT.toString());
}
