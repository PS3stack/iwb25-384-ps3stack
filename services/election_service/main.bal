
import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/time;
import election_service.election;

configurable int HTTP_PORT = ?;
const SERVICE_NAME = "Election Service";

public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
}

// Create listener
listener http:Listener httpListener = new(HTTP_PORT);

service /election on httpListener {

    isolated resource function get health() returns json {
        log:printInfo("Election Service: Health check endpoint called");
        return {
            "service": "Election Service",
            "status": "healthy",
            "timestamp": time:utcNow()[0]
        };
    }

    isolated resource function get .() returns election:Election[]|http:InternalServerError {
        log:printInfo("Received request to get all elections");
        election:Election[]|error result = election:getAllElections();
        if result is election:Election[] {
            log:printInfo("Successfully retrieved " + result.length().toString() + " elections");
            return result;
        }
        log:printError("Error getting all elections: " + result.message());
        return http:INTERNAL_SERVER_ERROR;
    }

    isolated resource function get [string id]() returns election:Election|http:InternalServerError|http:NotFound {
        log:printInfo("Received request for election with ID: " + id);
        
        do {
            election:Election|error result = election:getElectionById(id);
            if result is election:Election {
                log:printInfo("Successfully found election with ID: " + id);
                return result;
            }
            // Check if the error message indicates the election was not found
            string errorMsg = result.message();
            log:printError("Error fetching election with ID " + id + ": " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in getElectionById: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function post .(@http:Payload election:CreateElectionData request) returns election:Election|http:BadRequest|http:InternalServerError {
        log:printInfo("Received POST request to create election with title: " + request.title);
        
        do {
            election:Election|error result = election:createElection(request);
            if result is election:Election {
                log:printInfo("Successfully created election with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error creating election: " + errorMsg);
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in createElection: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function put [string id](@http:Payload election:UpdateElectionData request) returns election:Election|http:BadRequest|http:NotFound|http:InternalServerError {
        log:printInfo("Received PUT request to update election with ID: " + id);
        
        do {
            election:Election|error result = election:updateElection(id, request);
            if result is election:Election {
                log:printInfo("Successfully updated election with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error updating election: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in updateElection: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function delete [string id]() returns http:NoContent|http:NotFound|http:InternalServerError {
        log:printInfo("Received DELETE request for election with ID: " + id);
        
        do {
            error? result = election:deleteElection(id);
            if result is () {
                log:printInfo("Successfully deleted election with ID: " + id);
                return http:NO_CONTENT;
            }

            string errorMsg = result.message();
            log:printError("Error deleting election: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in deleteElection: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // Candidate endpoints
    isolated resource function get [string electionId]/candidates() returns election:Candidate[]|http:NotFound|http:InternalServerError {
        log:printInfo("Received GET request for candidates in election ID: " + electionId);
        
        do {
            election:Candidate[]|error result = election:getCandidatesByElectionId(electionId);
            if result is election:Candidate[] {
                log:printInfo("Successfully retrieved " + result.length().toString() + " candidates for election ID: " + electionId);
                return result;
            }

            string errorMsg = result.message();
            log:printError("Error getting candidates for election: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in getCandidatesByElectionId: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    isolated resource function post [string electionId]/candidates(@http:Payload election:CreateCandidateData request, http:Caller caller) returns error? {
        log:printInfo("Received POST request to create candidate for election ID: " + electionId);
        
        do {
            election:Candidate|error result = election:createCandidate(electionId, request);
            if result is election:Candidate {
                log:printInfo("Successfully created candidate with ID: " + result.id);
                http:Response response = new;
                response.statusCode = 201;
                response.setJsonPayload(result.toJson());
                check caller->respond(response);
                return;
            }

            string errorMsg = result.message();
            log:printError("Error creating candidate: " + errorMsg);
            if errorMsg.includes("not found") {
                check caller->respond(http:NOT_FOUND);
            } else if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                check caller->respond(http:BAD_REQUEST);
            } else {
                check caller->respond(http:INTERNAL_SERVER_ERROR);
            }
        } on fail var e {
            log:printError("Unexpected error in createCandidate: " + e.message());
            check caller->respond(http:INTERNAL_SERVER_ERROR);
        }
    }

    // Add candidate update endpoint - PUT /election/candidates/{id}
    isolated resource function put candidates/[string id](@http:Payload election:UpdateCandidateData request) returns election:Candidate|http:BadRequest|http:NotFound|http:InternalServerError {
        log:printInfo("Received PUT request to update candidate with ID: " + id);
        
        do {
            election:Candidate|error result = election:updateCandidate(id, request);
            if result is election:Candidate {
                log:printInfo("Successfully updated candidate with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error updating candidate: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in updateCandidate: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // Add candidate delete endpoint - DELETE /election/candidates/{id}
    isolated resource function delete candidates/[string id]() returns http:NoContent|http:NotFound|http:InternalServerError {
        log:printInfo("Received DELETE request for candidate with ID: " + id);
        
        do {
            error? result = election:deleteCandidate(id);
            if result is () {
                log:printInfo("Successfully deleted candidate with ID: " + id);
                return http:NO_CONTENT;
            }

            string errorMsg = result.message();
            log:printError("Error deleting candidate: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in deleteCandidate: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // === AREA ENDPOINTS ===

    // POST /election/areas - Create a new area
    isolated resource function post areas(@http:Payload election:CreateAreaData request) returns election:Area|http:BadRequest|http:InternalServerError {
        log:printInfo("Received POST request to create area with name: " + request.name);
        
        do {
            election:Area|error result = election:createArea(request);
            if result is election:Area {
                log:printInfo("Successfully created area with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error creating area: " + errorMsg);
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in createArea: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // POST /election/areas/{areaId}/devices/upload - Create a new device for an area
    isolated resource function post areas/[string areaId]/devices/upload(@http:Payload election:CreateDeviceData request) returns election:Device|http:BadRequest|http:NotFound|http:InternalServerError {
        log:printInfo("Received POST request to create device for area ID: " + areaId);
        
        do {
            election:Device|error result = election:createDevice(areaId, request);
            if result is election:Device {
                log:printInfo("Successfully created device with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error creating device: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in createDevice: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // === OBSERVER ENDPOINTS ===

    // POST /election/{electionId}/observers - Add observer to election
    isolated resource function post [string electionId]/observers(@http:Payload election:CreateObserverData request) returns election:ElectionStaffAssignment|http:BadRequest|http:NotFound|http:InternalServerError {
        log:printInfo("Received POST request to create staff assignment for election ID: " + electionId);
        
        do {
            election:ElectionStaffAssignment|error result = election:createObserver(electionId, request);
            if result is election:ElectionStaffAssignment {
                log:printInfo("Successfully created staff assignment for election ID: " + electionId);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error creating staff assignment: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in createObserver: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // === VOTER ENDPOINTS ===

    // POST /election/{electionId}/voters/upload - Add voter to election
    isolated resource function post [string electionId]/voters/upload(@http:Payload election:CreateVoterData request) returns election:Voter|http:BadRequest|http:NotFound|http:InternalServerError {
        log:printInfo("Received POST request to create voter for election ID: " + electionId);
        
        do {
            election:Voter|error result = election:createVoter(electionId, request);
            if result is election:Voter {
                log:printInfo("Successfully created voter with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error creating voter: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in createVoter: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // === QUALIFICATION ENDPOINTS ===

    // POST /election/qualifications - Create a new qualification
    isolated resource function post qualifications(@http:Payload election:CreateQualificationData request) returns election:Qualification|http:BadRequest|http:InternalServerError {
        log:printInfo("Received POST request to create qualification with title: " + request.title);
        
        do {
            election:Qualification|error result = election:createQualification(request);
            if result is election:Qualification {
                log:printInfo("Successfully created qualification with ID: " + result.id);
                return result; 
            }

            string errorMsg = result.message();
            log:printError("Error creating qualification: " + errorMsg);
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") || errorMsg.includes("UNIQUE") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in createQualification: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // GET /election/qualifications - Get all qualifications
    isolated resource function get qualifications() returns election:Qualification[]|http:InternalServerError {
        log:printInfo("Received GET request for all qualifications");
        
        do {
            election:Qualification[]|error result = election:getAllQualifications();
            if result is election:Qualification[] {
                log:printInfo("Successfully retrieved " + result.length().toString() + " qualifications");
                return result;
            }

            string errorMsg = result.message();
            log:printError("Error retrieving qualifications: " + errorMsg);
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in getAllQualifications: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // POST /election/candidates/{candidateId}/qualifications - Assign qualification to candidate
    isolated resource function post candidates/[string candidateId]/qualifications(@http:Payload election:AssignQualificationData request) returns json|http:BadRequest|http:NotFound|http:InternalServerError {
        log:printInfo("Received POST request to assign qualification to candidate ID: " + candidateId);
        
        do {
            error? result = election:assignQualificationToCandidate(candidateId, request);
            if result is () {
                log:printInfo("Successfully assigned qualification to candidate ID: " + candidateId);
                return {"message": "Qualification assigned successfully."};
            }

            string errorMsg = result.message();
            log:printError("Error assigning qualification: " + errorMsg);
            if errorMsg.includes("not found") {
                return http:NOT_FOUND;
            }
            if errorMsg.includes("Invalid") || errorMsg.includes("required") || errorMsg.includes("format") {
                return http:BAD_REQUEST; 
            }
            return http:INTERNAL_SERVER_ERROR;
        } on fail var e {
            log:printError("Unexpected error in assignQualificationToCandidate: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }

    // Sample data endpoint for testing
    isolated resource function post createSampleData() returns json|http:InternalServerError {
        log:printInfo("Creating sample election data...");
        
        // Create sample active election
        election:CreateElectionData sampleElection = {
            title: "City Council Election 2025",
            description: "Select your representative for the city council",
            start_time: "2025-08-31T00:00:00Z",
            end_time: "2025-12-31T23:59:59Z",
            is_public: true
        };
        
        do {
            // Create election
            election:Election|error electionResult = election:createElection(sampleElection);
            if electionResult is error {
                log:printError("Failed to create sample election: " + electionResult.message());
                return http:INTERNAL_SERVER_ERROR;
            }
            
            string electionId = electionResult.id.toString();
            log:printInfo("Created election with ID: " + electionId);
            
            // Create a sample area first (required for candidates)
            election:CreateAreaData sampleArea = {
                name: "City District 1",
                description: "Primary voting district"
            };
            
            election:Area|error areaResult = election:createArea(sampleArea);
            if areaResult is error {
                log:printError("Failed to create sample area: " + areaResult.message());
                return http:INTERNAL_SERVER_ERROR;
            }
            
            string areaId = areaResult.id.toString();
            log:printInfo("Created area with ID: " + areaId);
            
            // Create sample candidates
            election:CreateCandidateData[] candidates = [
                {
                    area_id: areaId,
                    name: "Alice Johnson",
                    party: "Democratic Party",
                    photo_url: "https://images.unsplash.com/photo-1494790108755-2616b626be13?w=150&h=150&fit=crop&crop=face"
                },
                {
                    area_id: areaId,
                    name: "Robert Smith", 
                    party: "Republican Party",
                    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                },
                {
                    area_id: areaId,
                    name: "Maria Garcia",
                    party: "Independent",
                    photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                }
            ];
            
            int candidatesCreated = 0;
            foreach election:CreateCandidateData candidate in candidates {
                var candidateResult = election:createCandidate(electionId, candidate);
                if candidateResult is error {
                    log:printError("Failed to create candidate " + candidate.name + ": " + candidateResult.message());
                } else {
                    candidatesCreated += 1;
                    log:printInfo("Created candidate: " + candidate.name);
                }
            }
            
            return {
                "message": "Sample election data created successfully",
                "election_id": electionId,
                "election_title": sampleElection.title,
                "area_id": areaId,
                "candidates_created": candidatesCreated,
                "total_candidates": candidates.length()
            };
            
        } on fail var e {
            log:printError("Error creating sample data: " + e.message());
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
