import ballerina/sql;
import ballerina/time;
import ballerina/log;

public isolated function checkInVoter(string electionId, string voterId) returns Voter|error {
    log:printInfo("Controller: Attempting to check in voter", electionId = electionId, voterId = voterId);
    
    // First, verify the voter exists
    VoterData? voterData = check dbClient->queryRow(`
        SELECT id, status FROM voters 
        WHERE election_id = ${electionId}::uuid AND voter_id_hash = ${voterId}
    `);

    if voterData is () {
        log:printWarn("Voter not found for check-in", voterId = voterId);
        return error("Voter not found with id: " + voterId);
    }
    
    // Update the voter's status to 'ready'
    sql:ExecutionResult result = check dbClient->execute(`
        UPDATE voters SET status = 'ready' 
        WHERE id = ${voterData.id}::uuid
    `);

    if (result.affectedRowCount == 0) {
        log:printError("Failed to update voter status to ready", voterId = voterId);
        return error("Voter status could not be updated.");
    }

    log:printInfo("Controller: Successfully updated voter status to ready", voterId = voterId);
    return {
        voterId: voterId,
        status: "ready",
        timestamp: time:utcToString(time:utcNow())
    };
}

public isolated function castVote(Vote vote) returns json|error {
    log:printInfo("Controller: Attempting to cast vote", voterId = vote.voterId);
    
    // Step 1: Verify the voter's status is 'ready'
    string? status = check dbClient->queryRow(`
        SELECT status FROM voters 
        WHERE election_id = ${vote.electionId}::uuid AND voter_id_hash = ${vote.voterId}
    `);

    // If the voter is not found or not ready, return an error
    if status is () || status != "ready" {
        log:printWarn("Vote casting failed: Voter not ready", voterId = vote.voterId, status = status);
        return error("Voter not ready or does not exist");
    }

    // Step 2: Insert the vote
    sql:ExecutionResult voteResult = check dbClient->execute(`
        INSERT INTO votes (election_id, candidate_id) 
        VALUES (${vote.electionId}::uuid, ${vote.selection}::uuid)
    `);

    // Step 3: Update the voter's status to 'voted'
    sql:ExecutionResult voterResult = check dbClient->execute(`
        UPDATE voters SET status = 'voted' 
        WHERE election_id = ${vote.electionId}::uuid AND voter_id_hash = ${vote.voterId}
    `);

    if voteResult.affectedRowCount == 0 || voterResult.affectedRowCount == 0 {
        log:printError("Failed to cast vote or update voter status", voterId = vote.voterId);
        return error("Failed to cast vote");
    }

    log:printInfo("Controller: Vote cast successfully", voterId = vote.voterId);
    return {message: "Vote cast successfully."};
}
