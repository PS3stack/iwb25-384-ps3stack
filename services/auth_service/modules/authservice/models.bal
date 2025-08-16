public type Role "admin"|"observer"|"field_staff"|"polling_staff";

public type User record {
    string email;
    string password_hash;
    int role_id;
    // Role role;
};

public type LoginRequest record {
    string email; 
    string password;
    int role_id; 
    Role role;
};

public type LoginResponse record {
    boolean success;
    string message;
    string? token;
    User? user;
};


