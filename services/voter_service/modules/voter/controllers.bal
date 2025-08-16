// modules/voter/controllers.bal

import ballerina/sql;
import ballerina/time;
import ballerina/log;

public isolated function checkInVoter(string electionId, string voterId) returns Voter|error {
    log:printInfo("Attempting to check-in voter: " + voterId + " for election: " + electionId);
    
    // Check if the voter exists and is eligible - updated for UUID-based schema
    stream<record {string status;}, sql:Error?> voterStream = dbClient->query(`
        SELECT status
        FROM voters
        WHERE election_id = ${electionId}::uuid AND voter_id_hash = ${voterId}
    `);
    
    record {string status;}[]|error voterResults = from record {string status;} voter in voterStream select voter;
    
    if (voterResults is error) {
        log:printError("Database error while checking voter: " + voterResults.message());
        return voterResults;
    }
    
    if (voterResults.length() == 0) {
        log:printWarn("Voter not found: " + voterId + " for election: " + electionId);
        return error("Voter not found");
    }

    log:printInfo("Found voter with status: " + voterResults[0].status);

    // Update the voter's status to 'ready'
    sql:ExecutionResult result = check dbClient->execute(`
        UPDATE voters
        SET status = 'ready'
        WHERE election_id = ${electionId}::uuid AND voter_id_hash = ${voterId}
    `);

    if (result.affectedRowCount == 0) {
        log:printError("Failed to update voter status for voter: " + voterId);
        return error("Voter status could not be updated.");
    }

    log:printInfo("Successfully checked-in voter: " + voterId);
    return {
        voterId: voterId,
        status: "ready",
        timestamp: time:utcToString(time:utcNow())
    };
}

public isolated function castVote(Vote vote) returns json|error {
    log:printInfo("Attempting to cast vote for voter: " + vote.voterId + " in election: " + vote.electionId);
    
    // Verify the voter's status is 'ready' - updated for UUID-based schema
    stream<record {string status;}, sql:Error?> voterStream = dbClient->query(`
        SELECT status
        FROM voters
        WHERE election_id = ${vote.electionId}::uuid AND voter_id_hash = ${vote.voterId} AND status = 'ready'
    `);
    
    record {string status;}[]|error voterResults = from record {string status;} voter in voterStream select voter;
    
    if (voterResults is error) {
        log:printError("Database error while checking voter status: " + voterResults.message());
        return voterResults;
    }

    if (voterResults.length() == 0) {
        log:printWarn("Voter not ready or does not exist: " + vote.voterId);
        return error("Voter not ready or does not exist");
    }

    // Insert the vote - updated for UUID-based schema
    do {
        sql:ExecutionResult voteResult = check dbClient->execute(`
            INSERT INTO votes (election_id, candidate_id)
            VALUES (${vote.electionId}::uuid, ${vote.selection}::uuid)
        `);

        // Update the voter's status to 'voted'
        sql:ExecutionResult voterUpdateResult = check dbClient->execute(`
            UPDATE voters
            SET status = 'voted'
            WHERE election_id = ${vote.electionId}::uuid AND voter_id_hash = ${vote.voterId}
        `);

        if (voteResult.affectedRowCount > 0 && voterUpdateResult.affectedRowCount > 0) {
            log:printInfo("Successfully cast vote for voter: " + vote.voterId);
            return {message: "Vote cast successfully."};
        } else {
            log:printError("Failed to cast vote - no rows affected");
            return error("Failed to cast vote.");
        }
    } on fail var e {
        log:printError("Database error during vote casting: " + e.message());
        return error("Database error during vote casting: " + e.message());
    }
}