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

// Area models
public type Area record {|
    string id;
    string name;
    string? description;
    time:Utc created_at;
|};

public type CreateAreaData record {|
    string name;
    string? description;
|};

// Observer models
public type ElectionStaffAssignment record {|
    string user_id;
    string election_id;
    string area_id;
|};

public type CreateObserverData record {|
    string user_id;
    string area_id;
|};

// Device models
public type Device record {|
    string id;
    string area_id;
    string device_type;
|};

public type CreateDeviceData record {|
    string device_type;
|};