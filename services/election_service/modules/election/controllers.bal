import ballerina/sql;
import ballerina/time;
import ballerina/uuid;
import ballerina/log;

public isolated function getAllElections() returns Election[]|error {
    stream<Election, sql:Error?> electionsStream = dbClient->query(`
        SELECT id, title, description, start_time, end_time, is_public, created_at 
        FROM elections
    `);
    
    return check from Election election in electionsStream select election;
}

public isolated function getElectionById(string id) returns Election|error {
    log:printInfo("Attempting to fetch election with ID: " + id);
    
    // First try to get all elections and see if our ID exists
    stream<Election, sql:Error?> electionsStream = dbClient->query(`
        SELECT id, title, description, start_time, end_time, is_public, created_at 
        FROM elections
    `);
    
    Election[] allElections = check from Election election in electionsStream select election;
    
    // Find the election with the matching ID
    Election? foundElection = ();
    foreach Election election in allElections {
        if election.id == id {
            foundElection = election;
            break;
        }
    }
    
    if foundElection is () {
        log:printWarn("No election found with id: " + id);
        return error("Election not found with id: " + id);
    } else {
        log:printInfo("Successfully fetched election with ID: " + id + ", title: " + foundElection.title);
        return foundElection;
    }
}


public isolated function createElection(CreateElectionData request) returns Election|error {
    log:printInfo("Attempting to create election with title: " + request.title);
    
    // Parse time strings with error handling
    time:Utc start_time;
    time:Utc end_time;
    
    do {
        start_time = check time:utcFromString(request.start_time);
        log:printInfo("Successfully parsed start_time: " + request.start_time);
    } on fail var e {
        log:printError("Failed to parse start_time: " + request.start_time + ", error: " + e.message());
        return error("Invalid start_time format: " + request.start_time);
    }
    
    do {
        end_time = check time:utcFromString(request.end_time);
        log:printInfo("Successfully parsed end_time: " + request.end_time);
    } on fail var e {
        log:printError("Failed to parse end_time: " + request.end_time + ", error: " + e.message());
        return error("Invalid end_time format: " + request.end_time);
    }

    string electionId = uuid:createType4AsString();
    time:Utc currentTime = time:utcNow();
    
    log:printInfo("Generated election ID: " + electionId);
    
    do {
        sql:ExecutionResult result = check dbClient->execute(`
            INSERT INTO elections (id, title, description, start_time, end_time, is_public, created_at)
            VALUES (${electionId}::uuid, ${request.title}, ${request.description}, 
                    ${start_time}, ${end_time}, ${request.is_public}, ${currentTime})
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during election creation");
            return error("Failed to create election");
        }
        
        log:printInfo("Successfully created election with ID: " + electionId);
        
        return {
            id: electionId,
            title: request.title,
            description: request.description,
            start_time: start_time, 
            end_time: end_time,    
            is_public: request.is_public,
            created_at: currentTime
        };
    } on fail var e {
        log:printError("Database error during election creation: " + e.message());
        return error("Database error during election creation: " + e.message());
    }
}

public isolated function updateElection(string id, UpdateElectionData request) returns Election|error {
    log:printInfo("Attempting to update election with ID: " + id);
    
    // First check if election exists
    Election existingElection = check getElectionById(id);
    
    // Parse time strings with error handling
    time:Utc start_time;
    time:Utc end_time;
    
    do {
        start_time = check time:utcFromString(request.start_time);
        log:printInfo("Successfully parsed start_time: " + request.start_time);
    } on fail var e {
        log:printError("Failed to parse start_time: " + request.start_time + ", error: " + e.message());
        return error("Invalid start_time format: " + request.start_time);
    }
    
    do {
        end_time = check time:utcFromString(request.end_time);
        log:printInfo("Successfully parsed end_time: " + request.end_time);
    } on fail var e {
        log:printError("Failed to parse end_time: " + request.end_time + ", error: " + e.message());
        return error("Invalid end_time format: " + request.end_time);
    }
    
    do {
        sql:ExecutionResult result = check dbClient->execute(`
            UPDATE elections 
            SET title = ${request.title}, 
                description = ${request.description}, 
                start_time = ${start_time}, 
                end_time = ${end_time}, 
                is_public = ${request.is_public}
            WHERE id = ${id}::uuid
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during election update for ID: " + id);
            return error("Election not found with id: " + id);
        }
        
        log:printInfo("Successfully updated election with ID: " + id);
        
        return {
            id: id,
            title: request.title,
            description: request.description,
            start_time: start_time, 
            end_time: end_time,    
            is_public: request.is_public,
            created_at: existingElection.created_at
        };
    } on fail var e {
        log:printError("Database error during election update: " + e.message());
        return error("Database error during election update: " + e.message());
    }
}

public isolated function deleteElection(string id) returns error? {
    log:printInfo("Attempting to delete election with ID: " + id);
    
    // First check if election exists
    _ = check getElectionById(id);
    
    do {
        sql:ExecutionResult result = check dbClient->execute(`
            DELETE FROM elections WHERE id = ${id}::uuid
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during election deletion for ID: " + id);
            return error("Election not found with id: " + id);
        }
        
        log:printInfo("Successfully deleted election with ID: " + id);
    } on fail var e {
        log:printError("Database error during election deletion: " + e.message());
        return error("Database error during election deletion: " + e.message());
    }
}

// Candidate functions
public isolated function getCandidatesByElectionId(string electionId) returns Candidate[]|error {
    log:printInfo("Attempting to fetch candidates for election ID: " + electionId);
    
    // First check if election exists
    _ = check getElectionById(electionId);
    
    stream<Candidate, sql:Error?> candidatesStream = dbClient->query(`
        SELECT id, election_id, area_id, name, party 
        FROM candidates 
        WHERE election_id = ${electionId}::uuid
    `);
    
    Candidate[] candidates = check from Candidate candidate in candidatesStream select candidate;
    log:printInfo("Successfully retrieved " + candidates.length().toString() + " candidates for election ID: " + electionId);
    return candidates;
}

public isolated function createCandidate(string electionId, CreateCandidateData request) returns Candidate|error {
    log:printInfo("Attempting to create candidate for election ID: " + electionId);
    
    // First check if election exists
    _ = check getElectionById(electionId);
    
    string candidateId = uuid:createType4AsString();
    log:printInfo("Generated candidate ID: " + candidateId);
    
    do {
        sql:ExecutionResult result = check dbClient->execute(`
            INSERT INTO candidates (id, election_id, area_id, name, party)
            VALUES (${candidateId}::uuid, ${electionId}::uuid, ${request.area_id}::uuid, 
                    ${request.name}, ${request.party})
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during candidate creation");
            return error("Failed to create candidate");
        }
        
        log:printInfo("Successfully created candidate with ID: " + candidateId);
        
        return {
            id: candidateId,
            election_id: electionId,
            area_id: request.area_id,
            name: request.name,
            party: request.party
        };
    } on fail var e {
        log:printError("Database error during candidate creation: " + e.message());
        return error("Database error during candidate creation: " + e.message());
    }
}

public isolated function getCandidateById(string id) returns Candidate|error {
    log:printInfo("Attempting to fetch candidate with ID: " + id);
    
    stream<Candidate, sql:Error?> candidatesStream = dbClient->query(`
        SELECT id, election_id, area_id, name, party 
        FROM candidates 
        WHERE id = ${id}::uuid
    `);
    
    Candidate[] candidates = check from Candidate candidate in candidatesStream select candidate;
    
    if candidates.length() == 0 {
        log:printWarn("No candidate found with id: " + id);
        return error("Candidate not found with id: " + id);
    }
    
    Candidate foundCandidate = candidates[0];
    log:printInfo("Successfully fetched candidate with ID: " + id + ", name: " + foundCandidate.name);
    return foundCandidate;
}

public isolated function updateCandidate(string id, UpdateCandidateData request) returns Candidate|error {
    log:printInfo("Attempting to update candidate with ID: " + id);
    
    // First check if candidate exists
    Candidate existingCandidate = check getCandidateById(id);
    
    do {
        sql:ExecutionResult result = check dbClient->execute(`
            UPDATE candidates 
            SET area_id = ${request.area_id}::uuid, 
                name = ${request.name}, 
                party = ${request.party}
            WHERE id = ${id}::uuid
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during candidate update for ID: " + id);
            return error("Candidate not found with id: " + id);
        }
        
        log:printInfo("Successfully updated candidate with ID: " + id);
        
        return {
            id: id,
            election_id: existingCandidate.election_id,
            area_id: request.area_id,
            name: request.name,
            party: request.party
        };
    } on fail var e {
        log:printError("Database error during candidate update: " + e.message());
        return error("Database error during candidate update: " + e.message());
    }
}

public isolated function deleteCandidate(string id) returns error? {
    log:printInfo("Attempting to delete candidate with ID: " + id);
    
    // First check if candidate exists
    _ = check getCandidateById(id);
    
    do {
        sql:ExecutionResult result = check dbClient->execute(`
            DELETE FROM candidates WHERE id = ${id}::uuid
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during candidate deletion for ID: " + id);
            return error("Candidate not found with id: " + id);
        }
        
        log:printInfo("Successfully deleted candidate with ID: " + id);
    } on fail var e {
        log:printError("Database error during candidate deletion: " + e.message());
        return error("Database error during candidate deletion: " + e.message());
    }
}

// === AREA FUNCTIONS ===

public isolated function createArea(CreateAreaData request) returns Area|error {
    log:printInfo("Creating area with name: " + request.name);
    
    do {
        string areaId = uuid:createType4AsString();
        time:Utc currentTime = time:utcNow();
        
        sql:ExecutionResult result = check dbClient->execute(`
            INSERT INTO areas (id, name, description, created_at)
            VALUES (${areaId}::uuid, ${request.name}, ${request.description}, ${currentTime})
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during area creation");
            return error("Failed to create area");
        }
        
        log:printInfo("Successfully created area with ID: " + areaId);
        
        return {
            id: areaId,
            name: request.name,
            description: request.description,
            created_at: currentTime
        };
    } on fail var e {
        log:printError("Database error during area creation: " + e.message());
        return error("Database error during area creation: " + e.message());
    }
}

// === OBSERVER FUNCTIONS ===

public isolated function createObserver(string electionId, CreateObserverData request) returns ElectionStaffAssignment|error {
    log:printInfo("Creating staff assignment for election: " + electionId + ", user: " + request.user_id + ", area: " + request.area_id);
    
    do {
        sql:ExecutionResult result = check dbClient->execute(`
            INSERT INTO election_staff_assignments (user_id, election_id, area_id)
            VALUES (${request.user_id}::uuid, ${electionId}::uuid, ${request.area_id}::uuid)
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during staff assignment creation");
            return error("Failed to create staff assignment");
        }
        
        log:printInfo("Successfully created staff assignment for user: " + request.user_id);
        
        return {
            user_id: request.user_id,
            election_id: electionId,
            area_id: request.area_id
        };
    } on fail var e {
        log:printError("Database error during staff assignment creation: " + e.message());
        return error("Database error during staff assignment creation: " + e.message());
    }
}

// === DEVICE FUNCTIONS ===

public isolated function createDevice(string areaId, CreateDeviceData request) returns Device|error {
    log:printInfo("Creating device for area: " + areaId + " with type: " + request.device_type);
    
    do {
        string deviceId = uuid:createType4AsString();
        
        sql:ExecutionResult result = check dbClient->execute(`
            INSERT INTO devices (id, area_id, device_type)
            VALUES (${deviceId}::uuid, ${areaId}::uuid, ${request.device_type})
        `);
        
        if result.affectedRowCount == 0 {
            log:printError("No rows affected during device creation");
            return error("Failed to create device");
        }
        
        log:printInfo("Successfully created device with ID: " + deviceId);
        
        return {
            id: deviceId,
            area_id: areaId,
            device_type: request.device_type
        };
    } on fail var e {
        log:printError("Database error during device creation: " + e.message());
        return error("Database error during device creation: " + e.message());
    }
}