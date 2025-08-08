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

public type CreateElectionRequest record {|
    string title;
    string? description;
    time:Utc start_time;
    time:Utc end_time;
    boolean is_public;
|};