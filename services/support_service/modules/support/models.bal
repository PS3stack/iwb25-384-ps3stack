// Represents the incoming request body for the /support/chat endpoint.
public type ChatRequest record {|
    string message;
    json[] sessionHistory;
|};

// Represents a record from the 'knowledge_base' table.
public type KnowledgeArticle record {|
    string id;
    string question;
    string answer;
    string? keywords;
|};