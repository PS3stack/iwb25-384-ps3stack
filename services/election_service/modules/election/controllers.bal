import ballerina/sql;
import ballerina/time;
import ballerina/uuid;

public isolated function getAllElections() returns Election[]|error {
    stream<Election, sql:Error?> electionsStream = dbClient->query(`
        SELECT id, title, description, start_time, end_time, is_public, created_at 
        FROM elections
    `);
    
    return check from Election election in electionsStream select election;
}

public isolated function getElectionById(string id) returns Election|error {
    Election|sql:Error result = dbClient->queryRow(`
        SELECT id, title, description, start_time, end_time, is_public, created_at
        FROM elections WHERE id = ${id}
    `);
    
    if result is sql:NoRowsError {
        return error("Election not found");
    } else if result is sql:Error {
        return result;
    }
    
    return result;
}


public isolated function createElection(CreateElectionData request) returns Election|error {
    time:Utc start_time = check time:utcFromString(request.start_time);
    time:Utc end_time = check time:utcFromString(request.end_time);

    string electionId = uuid:createType4AsString();
    time:Utc currentTime = time:utcNow();
    
    
    sql:ExecutionResult result = check dbClient->execute(`
        INSERT INTO elections (id, title, description, start_time, end_time, is_public, created_at)
        VALUES (${electionId}, ${request.title}, ${request.description}, 
                ${start_time}, ${end_time}, ${request.is_public}, ${currentTime})
    `);
    
    if result.affectedRowCount == 0 {
        return error("Failed to create election");
    }
    
    return {
        id: electionId,
        title: request.title,
        description: request.description,
        start_time: start_time, 
        end_time: end_time,    
        is_public: request.is_public,
        created_at: currentTime
    };
}