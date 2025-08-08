public type Role "admin"|"observer"|"field_staff"|"polling_staff";

public type User record {
    string email;
    string passwordHash;
    Role role;
};

public type LoginRequest record {
    string email; // Updated to use email
    string password;
    Role role;
};
