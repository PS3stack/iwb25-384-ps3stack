public type User record {
    string email;
    string password_hash;
    int role_id;
};

public type LoginRequest record {
    string email; 
    string password;
    int role_id; 
};

public type LoginResponse record {
    boolean success;
    string message;
    string? token;
    string? userEmail;
    string? role;
};


