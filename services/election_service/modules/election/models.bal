import ballerina/time;

public type Election record {|
    string id;                    
    string title;                 
    string? description;        
    time:Utc start_time;        
    time:Utc end_time;           
    boolean is_public;           
    time:Utc created_at;         
|};

public type CreateElectionData record {|
    string title;
    string? description;
    string start_time;
    string end_time;
    boolean is_public;
|};

public type UpdateElectionData record {|
    string title;
    string? description;
    string start_time;
    string end_time;
    boolean is_public;
|};

public type Candidate record {|
    string id;
    string election_id;
    string area_id;
    string name;
    string? party;
|};

public type CreateCandidateData record {|
    string area_id;
    string name;
    string? party;
|};

public type UpdateCandidateData record {|
    string area_id;
    string name;
    string? party;
|};