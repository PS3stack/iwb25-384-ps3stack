import ballerina/http;
import ballerina/io;
import ballerina/sql;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

// --- Configurable Variables ---
configurable int HTTP_PORT = ?;
configurable string DB_HOST = ?;
configurable string DB_USER = ?;
configurable string DB_PASSWORD = ?;
configurable string DB_NAME = ?;

// --- Constants ---
const SERVICE_NAME = "Voter Service";

// --- Record for Query Result ---
type Role record {
    int id;
    string name;
};

// --- Database Client Initialization ---

// This function initializes the client. If it fails, the program will stop (panic),
// because the service cannot run without a database connection.
function initDbClient() returns postgresql:Client {
    postgresql:Options dbOptions = {
        ssl: {
            mode: postgresql:REQUIRE
        }
    };

    postgresql:Client|sql:Error clientResult = new (
        host = DB_HOST,
        username = DB_USER,
        password = DB_PASSWORD,
        database = DB_NAME,
        options = dbOptions
    );

    if clientResult is sql:Error {
        panic error("Database initialization failed!", clientResult);
    }
    
    return clientResult;
}

// The client is initialized once when the module loads and is made 'final'.
// This guarantees it is always available and solves the initialization errors.
final postgresql:Client dbClient = initDbClient();

// --- Main Execution ---
// The main function is now much simpler.
public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
    io:println("✅ Database client initialized successfully.");
}

// --- HTTP Service ---
service / on new http:Listener(HTTP_PORT) {

    // The 'isolated' keyword is added to tell the compiler this resource
    // is safe to be called concurrently by multiple requests.
    isolated resource function get roles() returns Role[]|error {
        // We can now use 'dbClient' directly and safely.
        stream<Role, sql:Error?> roleStream = dbClient->query(`SELECT id, name FROM roles ORDER BY id`);
        
        Role[] roles = check from Role r in roleStream select r;
        return roles;
    }

    isolated resource function get .() returns json {
        return {
            message: "Welcome to the " + SERVICE_NAME,
            "roles_endpoint": "/roles"
        };
    }
}