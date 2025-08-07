// modules/voter/models.bal

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