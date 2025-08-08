import ballerina/crypto;
// import ballerina/http;
import ballerina/io;
import ballerina/sql;
// import ballerinax/postgresql;

public isolated function checkUserCredentials(string email, string password, string role) returns boolean|error {
    sql:ParameterizedQuery getUserQuery = `SELECT email, passwordHash, role FROM users WHERE email = ${email} AND role = ${role}`;
    stream<User, sql:Error?> userStream = dbClient->query(getUserQuery);

    record {|User value;|}? existingUser = check userStream.next();
    check userStream.close();

    if existingUser is () {
        io:println("Login failed: User not found.");
        return false;
    }

    string storedPasswordHash = existingUser.value.passwordHash;
    byte[] hashedPassword = crypto:hashSha256(password.toBytes());
    string hashedPasswordHex = hashedPassword.toBase16();

    if (hashedPasswordHex == storedPasswordHash) {
        io:println("Login successful for user: ", email);
        return true;
    } else {
        io:println("Login failed: Invalid password.");
        return false;
    }
}
