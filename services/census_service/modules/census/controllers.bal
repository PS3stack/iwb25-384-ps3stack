// import ballerina/http;
import ballerina/io;
import ballerina/sql;
// import ballerina/time;
import ballerinax/postgresql;
public function createCensusProject(postgresql:Client dbClient, CensusProject project) returns int|error {
    sql:ParameterizedQuery query = `
        INSERT INTO census_projects (project_name, description, start_date, end_date, 
                                   status, created_by)
        VALUES (${project.projectName}, ${project.description}, ${project.startDate}, 
                ${project.endDate}, ${project.status}, ${project.createdBy})
        RETURNING id
    `;
    
    stream<record {int id;}, sql:Error?> resultStream = dbClient->query(query);
    record {|record {int id;} value;|}? result = check resultStream.next();
    check resultStream.close();
    
    if result is () {
        return error("Failed to create census project");
    }
    
    io:println("Census project created with ID: " + result.value.id.toString());
    return result.value.id;
}

