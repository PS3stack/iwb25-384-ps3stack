// modules/voter/controllers.bal

import ballerina/sql;
import ballerina/time;

public isolated function checkInVoter(string electionId, string voterId) returns Voter|error {
    // Check if the voter exists and is eligible
    stream<record{}, sql:Error?> voterStream = dbClient->query(`
        SELECT status
        FROM voters
        WHERE election_id = ${electionId} AND voter_id_hash = ${voterId}
    `);
    record {| record{}...; |}|error? voterRecord = voterStream.next();

    if (voterRecord is ()) {
        return error("Voter not found");
    } else if (voterRecord is error) {
        return voterRecord;
    }

    // Update the voter's status to 'ready'
    sql:ExecutionResult result = check dbClient->execute(`
        UPDATE voters
        SET status = 'ready'
        WHERE election_id = ${electionId} AND voter_id_hash = ${voterId}
    `);

    if (result.affectedRowCount == 0) {
        return error("Voter status could not be updated.");
    }

    return {
        voterId: voterId,
        status: "ready",
        timestamp: time:utcToString(time:utcNow())
    };
}

public isolated function castVote(Vote vote) returns json|error {
    // Verify the voter's status is 'ready'
    stream<record{}, sql:Error?> voterStream = dbClient->query(`
        SELECT status
        FROM voters
        WHERE election_id = ${vote.electionId} AND voter_id_hash = ${vote.voterId} AND status = 'ready'
    `);
    record {| record{}...; |}|error? voterRecord = voterStream.next();

    if (voterRecord is ()) {
        return error("Voter not ready or does not exist");
    } else if (voterRecord is error) {
        return voterRecord;
    }

    // Insert the vote
    sql:ExecutionResult voteResult = check dbClient->execute(`
        INSERT INTO votes (election_id, candidate_id)
        VALUES (${vote.electionId}, ${vote.selection})
    `);

    // Update the voter's status to 'voted'
    sql:ExecutionResult voterUpdateResult = check dbClient->execute(`
        UPDATE voters
        SET status = 'voted'
        WHERE election_id = ${vote.electionId} AND voter_id_hash = ${vote.voterId}
    `);

    if (voteResult.affectedRowCount > 0 && voterUpdateResult.affectedRowCount > 0) {
        return {message: "Vote cast successfully."};
    } else {
        return error("Failed to cast vote.");
    }
}