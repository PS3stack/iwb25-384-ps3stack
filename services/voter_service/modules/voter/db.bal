import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

// --- Database Client Initialization ---
configurable string DB_HOST = ?;
configurable string DB_USER = ?;
configurable string DB_PASSWORD = ?;
configurable string DB_NAME = ?;

// The client is initialized once and is shared across the module.
final postgresql:Client dbClient = check new (
    host = DB_HOST,
    username = DB_USER,
    password = DB_PASSWORD,
    database = DB_NAME,
    options = {
        ssl: {
            mode: postgresql:REQUIRE
        }
    }
);