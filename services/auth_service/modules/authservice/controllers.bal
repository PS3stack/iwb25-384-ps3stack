import ballerina/crypto;
import ballerina/http;
import ballerina/io;
import ballerina/sql;
import ballerina/time;
import ballerina/lang.regexp as regex;
import ballerina/log;
import ballerina/lang.array;

configurable int TOKEN_EXPIRY = ?;
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
    // byte[] hashedPassword = crypto:hashSha256(password.toBytes());
    // string hashedPasswordHex = hashedPassword.toBase16();
    
    // For testing purpose
    if (password == storedPasswordHash){
        io:println("Login successful for user: ", email);
        return true;
    // if (hashedPasswordHex == storedPasswordHash) {
    //     io:println("Login successful for user: ", email);
    //     return true;
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
            userEmail: (),
            role: ()
        };
    }
    
    // Get user details
    // User user = check getUserByEmailAndRole(loginReq.email, loginReq.role_id);
    // Generate JWT token
    string token = check generateJwtToken(loginReq.email, loginReq.role_id, TOKEN_EXPIRY);
    string role = check getRole(loginReq.role_id);
    return {
        success: true,
        message: "Login successful",
        token: token,
        userEmail: loginReq.email,
        role: role
    };
}

isolated function generateJwtToken(string email, int role_id, int expiry) returns string|error {
    int currentTime = time:utcNow()[0]+19800;

    json payload = {
        "sub": email,
        "iss": "auth-service",
        "aud": "census-system",
        "iat": currentTime,
        "exp": currentTime + (expiry * 3600),
        "role_id": role_id,
        "role": check getRole(role_id)
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

public isolated function getRole(int role_id) returns string|error {
    if role_id == 1 {
        return "admin";
    } else if role_id == 2 {
        return "observer";
    } else if role_id == 3 {
        return "field_staff";
    } else if role_id == 4 {
        return "polling_staff";
    } else {
        return error("Invalid role_id: " + role_id.toString());
    }
}

public function extractDetailsFromToken(string authorization) returns json|error {
    // Check if authorization header contains Bearer token or extract from Cookie
    string token = "";
    
    if authorization.startsWith("Bearer ") {
        token = authorization.substring(7); // Remove "Bearer " prefix
    } else if authorization.includes("auth_token=") {
        // Extract token from cookie format: "auth_token=payload.signature; other=value"
        regex:RegExp cookiePattern = check regex:fromString("auth_token=([^;\\s]+)");
        regex:Groups? groups = cookiePattern.findGroups(authorization);
        if groups is regex:Groups && groups.length() > 1 {
            regex:Span? tokenGroup = groups[1];
            if tokenGroup is regex:Span {
                token = tokenGroup.substring();
            } else {
                return error("Invalid cookie format - token not found");
            }
        } else {
            return error("Invalid cookie format - auth_token not found");
        }
    } else {
        // Assume the entire authorization string is the token
        token = authorization;
    }
    
    if token == "" {
        return error("No token found");
    }
    
    // Split token by dot to get payload and signature
    string[] tokenParts = regex:split(re `\.`, token);
    if tokenParts.length() != 2 {
        return error("Invalid token format - expected payload.signature");
    }
    
    string encodedPayload = tokenParts[0];
    // string encodedSignature = tokenParts[1];
    
    // Decode Base64 payload (this is the JSON string)
    byte[]|error payloadBytes = array:fromBase64(encodedPayload);
    if payloadBytes is error {
        log:printError("Failed to decode Base64 payload", payloadBytes);
        return error("Invalid token - failed to decode payload");
    }
    
    // Convert bytes back to JSON string
    string payloadJsonStr = check string:fromBytes(payloadBytes);
    
    // Parse JSON string to get the payload object
    json|error payloadJson = payloadJsonStr.fromJsonString();
    if payloadJson is error {
        log:printError("Failed to parse JSON payload", payloadJson);
        return error("Invalid token - failed to parse payload JSON");
    }
    return payloadJson;
    // Extract email from "sub" field
    // if payloadJson is map<json> {
    //     json subValue = payloadJson["sub"];
    //     if subValue is string {
    //         if subValue == "" {
    //             return error("Empty email in token 'sub' claim");
    //         }
    //         return subValue;
    //     } else {
    //         return error("Invalid 'sub' claim in token - expected string");
    //     }
    // } else {
    //     return error("Invalid token payload - expected JSON object");
    // }
}

public function decodeRequest(http:Request req) returns json|error {
    string|error token = extractTokenFromRequest(req);
    if token is error {
        return error("Failed to extract token from request");
    }

    // Decode the token to get the payload
    json|error payload = extractDetailsFromToken(token);
    if payload is error {
        return error("Failed to decode token");
    }

    return payload;
}