import ballerina/http;
import ballerina/io;
import ballerina/sql;
import ballerina/time;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable int HTTP_PORT = ?;
configurable string DB_HOST = ?;
configurable string DB_USER = ?;
configurable string DB_PASSWORD = ?;
configurable string DB_NAME = ?;

const SERVICE_NAME = "Election Service";

public type Election record {
    string id;
    string title;
    string description?;
    time:Utc start_time;
    time:Utc end_time;
    boolean is_public;
    time:Utc created_at;
};


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

final postgresql:Client dbClient = initDbClient();

public function main() {
    io:println(SERVICE_NAME + " started on port " + HTTP_PORT.toString());
    io:println("Database client initialized successfully.");
}

service /election on new http:Listener(HTTP_PORT) {

    isolated resource function get .() returns Election[]|error {
        stream<Election, sql:Error?> electionsStream = dbClient->query(`SELECT id, title, description, start_time, end_time, is_public, created_at FROM elections`);
        
        Election[] elections = check from Election election in electionsStream
                                    select election;

        return elections;
    }
}