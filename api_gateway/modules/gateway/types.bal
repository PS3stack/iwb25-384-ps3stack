// Authentication status type
public type AuthError record {|
    string message;
    int statusCode;
|};

// JWT token claims
public type UserClaims record {|
    string sub;
    string iss;
    string aud;
    int iat;
    int exp;
    string role_id;
|};

// Health status for services
public type ServiceHealth record {|
    string name;
    string status;
    int? statusCode;
    string? statusMessage;
    int timestamp;
|};

// Standard API response
public type ApiResponse record {|
    boolean success;
    string message;
    json? data;
    int timestamp;
|};

// Service URLs configuration
public type ServiceConfig record {|
    string authServiceUrl;
    string electionServiceUrl;
    string voterServiceUrl;
    string supportServiceUrl;
    string censusServiceUrl;
|};

// User role definitions
public enum UserRole {
    ADMIN = "1",
    OBSERVER = "2", 
    FIELD_STAFF = "3",
    POLLING_STAFF = "4"
}
