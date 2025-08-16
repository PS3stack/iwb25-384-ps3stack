import ballerina/time;

public type Voter record {|
    string voterId;
    string status;
    string timestamp;
|};

public type Vote record {|
    string voterId;
    string electionId;
    string selection;
|};

// Additional types for better error handling and responses
public type VoterStatus record {|
    string voterId;
    string electionId;
    string status;
    time:Utc? updatedAt;
|};

public type VoteResponse record {|
    string message;
    string? voteId;
    time:Utc timestamp;
|};