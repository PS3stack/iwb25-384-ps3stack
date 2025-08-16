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