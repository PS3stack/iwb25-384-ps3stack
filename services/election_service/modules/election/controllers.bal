import ballerina/sql;

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