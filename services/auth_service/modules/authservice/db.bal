import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable int HTTP_PORT = ?;
configurable string DB_HOST = ?;
configurable string DB_USER = ?;
configurable string DB_PASSWORD = ?;
configurable string DB_NAME = ?;

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
