// Represents the response for a successful check-in
public type Voter record {|
    string voterId;
    string status;
    string timestamp;
|};

// Represents the payload for casting a vote
public type Vote record {|
    string voterId;
    string electionId;
    string selection; 
|};

// Internal record for querying voter data from the database
public type VoterData record {|
    string id;
    string status;
|};
