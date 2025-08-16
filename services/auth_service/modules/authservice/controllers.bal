import ballerina/crypto;
import ballerina/http;
import ballerina/io;
import ballerina/sql;
import ballerina/time;

configurable int TOKEN_EXPIRY = ?;
configurable int REFRESH_TOKEN_EXPIRY = ?;
configurable string JWT_SECRET = ?;

public isolated function checkUserCredentials(string email, string password, int role_id) returns boolean|error {
    sql:ParameterizedQuery getUserQuery = `SELECT email, password_hash, role_id FROM users WHERE email = ${email} AND role_id = ${role_id}`;
    stream<User, sql:Error?> userStream = dbClient->query(getUserQuery);

    record {|User value;|}? existingUser = check userStream.next();
    check userStream.close();

    if existingUser is () {
        io:println("Login failed: User not found.");
        return false;
    }

    string storedPasswordHash = existingUser.value.password_hash;
    byte[] hashedPassword = crypto:hashSha256(password.toBytes());
    string hashedPasswordHex = hashedPassword.toBase16();
    
    // For testing purpose
    // if (password == storedPasswordHash){
    //     io:println("Login successful for user: ", email);
    //     return true;
    if (hashedPasswordHex == storedPasswordHash) {
        io:println("Login successful for user: ", email);
        return true;
    } else {
        io:println("Login failed: Invalid password.");
        return false;
    }
}

public isolated function loginUser(LoginRequest loginReq) returns LoginResponse|error {
    // Check user credentials
    boolean isValid = check checkUserCredentials(loginReq.email, loginReq.password, loginReq.role_id);
    
    if (!isValid) {
        return {
            success: false,
            message: "Invalid credentials",
            token: (),
            user: ()
        };
    }
    
    // Get user details
    User user = check getUserByEmailAndRole(loginReq.email, loginReq.role_id);
    // Generate JWT token
    string token = check generateJwtToken(user.email, user.role_id.toString(), TOKEN_EXPIRY);

    return {
        success: true,
        message: "Login successful",
        token: token,
        user: user
    };
}

isolated function getUserByEmailAndRole(string email, int role_id) returns User|error {
    sql:ParameterizedQuery query = `SELECT * FROM users WHERE email = ${email} AND role_id = ${role_id}`;
    stream<User, sql:Error?> userStream = dbClient->query(query);
    
    record {|User value;|}? result = check userStream.next();
    check userStream.close();
    
    if result is () {
        return error("User not found");
    }
    
    return result.value;
}

isolated function generateJwtToken(string email, string role_id, int expiry) returns string|error {
    int currentTime = time:utcNow()[0]+19800;

    json payload = {
        "sub": email,
        "iss": "auth-service",
        "aud": "census-system",
        "iat": currentTime,
        "exp": currentTime + (expiry * 3600),
        "role_id": role_id
    };

    string payloadStr = payload.toJsonString();
    byte[] signature = check crypto:hmacSha256(payloadStr.toBytes(), JWT_SECRET.toBytes());
    
    // Simple token format: payload.signature (Base64 encoded)
    return payloadStr.toBytes().toBase64() + "." + signature.toBase64();
}

public isolated function createAuthCookie(string token, int expiry) returns http:Cookie {
    http:Cookie authCookie = new http:Cookie("auth_token", token, {
        httpOnly: true,
        secure: true, 
        maxAge: expiry * 3600,
        path: "/"
    });

    return authCookie;
}

public isolated function extractTokenFromRequest(http:Request req) returns string|error {
    http:Cookie[] cookies = req.getCookies();

    foreach http:Cookie cookie in cookies {
        if cookie.name == "auth_token" {
            return cookie.value;
        }
    }
    
    return error("Auth token not found in cookies");
}

