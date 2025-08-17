import ballerina/io;
import ballerina/sql;
import ballerina/log;
import ballerina/crypto;
import ballerina/lang.regexp as regex;
import ballerina/lang.array;

public function getAllCensusProjects() returns CensusProject[]|error {
    sql:ParameterizedQuery query = `SELECT * FROM census_projects ORDER BY submitted_at DESC`;
    
    stream<CensusProject, sql:Error?> resultStream = dbClient->query(query);
    CensusProject[] projects = [];
    
    check from CensusProject project in resultStream
        do {
            projects.push(project);
        };
    
    check resultStream.close();
    return projects;
}

public function createCensusProject(CensusProject project) returns int|error {
    sql:ParameterizedQuery query = `
        INSERT INTO census_projects (project_name, description, start_date, end_date, 
                                   public_submission_enabled, created_by)
        VALUES (${project.projectName}, ${project.description}, ${project.startDate}, 
                ${project.endDate}, ${project.public_submission_enabled}, ${project.createdBy})
                RETURNING id`;

    stream<record {int id;}, sql:Error?> resultStream = dbClient->query(query);
    record {|record {int id;} value;|}? result = check resultStream.next();
    check resultStream.close();

    
    if result is () {
        return error("Failed to create census project");
    }
    
    io:println("Census project created with ID: " + result.value.id.toString());
    return result.value.id;
}


public function updateCensusProject(int id, CensusProject project) returns CensusProject|error {
    sql:ParameterizedQuery query = `
        UPDATE census_projects 
        SET project_name = ${project.projectName}, 
            description = ${project.description},
            start_date = ${project.startDate},
            end_date = ${project.endDate},
            public_submission_enabled = ${project.public_submission_enabled},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
    `;
    
    stream<CensusProject, sql:Error?> resultStream = dbClient->query(query);
    record {|CensusProject value;|}? result = check resultStream.next();
    check resultStream.close();
    
    if result is () {
        return error("Census project not found");
    }
    
    return result.value;
}

public isolated function deleteCensusProject(int id) returns json|error {
    sql:ParameterizedQuery query = `DELETE FROM census_projects WHERE id = ${id}`;
    sql:ExecutionResult result = check dbClient->execute(query);
    
    if result.affectedRowCount == 0 {
        return error("Census project not found");
    }
    
    io:println("Census project deleted with ID: " + id.toString());
    return {"message": "Census project deleted successfully"};
}

public isolated function insertUser(string name, string email, string password, int roleId) returns int|error {
    byte[] hashedPassword = crypto:hashSha256(password.toBytes());
    string hashedPasswordHex = hashedPassword.toBase16();
    // string hashedPassword = check hashSha256(password);
    sql:ParameterizedQuery query = `
        INSERT INTO users (name, email, password_hash, role_id, is_active, created_at, updated_at)
        VALUES (${name}, ${email}, ${hashedPasswordHex}, ${roleId}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id
    `;

    stream<record {int id;}, sql:Error?> resultStream = dbClient->query(query);
    record {|record {int id;} value;|}? result = check resultStream.next();
    check resultStream.close();

    if result is () {
        return error("Failed to create user");
    }

    io:println("User created with ID: " + result.value.id.toString());
    return result.value.id;
}

// Need to be updated
public function uploadStaffData(byte[] csvData) returns json|error {
    // Parse CSV and insert staff records
    // This is a simplified version - you'll need CSV parsing logic

    string csvContent = check string:fromBytes(csvData);
    
    // Parse CSV lines
    regex:RegExp newlinePattern = check regex:fromString("\n");
    string[] lines = newlinePattern.split(csvContent);
    if lines.length() < 2 {
        return error("CSV file must contain at least header and one data row");
    }
    
    // Skip header row and process data rows
    int successCount = 0;
    int errorCount = 0;
    string[] errors = [];
    
    foreach int i in 1 ..< lines.length() {
        string line = lines[i].trim();
        if line == "" {
            continue; // Skip empty lines
        }
        
        // Parse CSV row (assuming format: staff_name,email,phone,assigned_region)
        regex:RegExp commaPattern = check regex:fromString(",");
        string[] fields = commaPattern.split(line);
        if fields.length() < 4 {
            errorCount += 1;
            errors.push("Row " + i.toString() + ": Invalid number of fields");
            continue;
        }
        
        string staffName = fields[0].trim();
        string email = fields[1].trim();
        string password = fields[2].trim();
        // string assignedRegion = fields[3].trim();
        
        // Validate required fields
        if staffName == "" || email == "" {
            errorCount += 1;
            errors.push("Row " + i.toString() + ": Staff name and email are required");
            continue;
        }
        
        byte[] hashedPassword = crypto:hashSha256(password.toBytes());
        string hashedPasswordHex = hashedPassword.toBase16();
        // Insert into database
        sql:ParameterizedQuery query = `
            INSERT INTO Users (name, email, password_hash, role_id, is_active, created_at, updated_at)
            VALUES (${staffName}, ${email}, ${hashedPasswordHex}, 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        
        sql:ExecutionResult|error result = dbClient->execute(query);
        if result is error {
            errorCount += 1;
            errors.push("Row " + i.toString() + ": Database error - " + result.message());
            log:printError("Failed to insert staff data for row " + i.toString(), result);
        } else if result.affectedRowCount > 0 {
            successCount += 1;
        } else {
            errorCount += 1;
            errors.push("Row " + i.toString() + ": No rows inserted");
        }
    }

    io:println("Staff data uploaded");
    return {
        "message": "Staff data upload completed",
        "success_count": successCount,
        "error_count": errorCount,
        "errors": errors
    };
}

public function uploadHouseholdsData(string census_id, byte[] csvData, string staff_id) returns json|error {
    // Parse CSV and insert household records
    
    string csvContent = check string:fromBytes(csvData);
    
    // Parse CSV lines
    regex:RegExp newlinePattern = check regex:fromString("\n");
    string[] lines = newlinePattern.split(csvContent);
    if lines.length() < 2 {
        return error("CSV file must contain at least header and one data row");
    }
    
    // Skip header row and process data rows
    int successCount = 0;
    int errorCount = 0;
    string[] errors = [];
    // string census_id = "";

    foreach int i in 1 ..< lines.length() {
        string line = lines[i].trim();
        if line == "" {
            continue; // Skip empty lines
        }
        
        // Parse CSV row (assuming format: staff_name,email,phone,assigned_region)
        regex:RegExp commaPattern = check regex:fromString(",");
        string[] fields = commaPattern.split(line);
        if fields.length() < 4 {
            errorCount += 1;
            errors.push("Row " + i.toString() + ": Invalid number of fields");
            continue;
        }
        
        string household_id = fields[0].trim();
        string address = fields[1].trim();
        
        // Validate required fields
        if staff_id == "" || household_id == "" {
            errorCount += 1;
            errors.push("Row " + i.toString() + ": Staff ID and Household ID are required");
            continue;
        }
        
        sql:ParameterizedQuery query = `
            INSERT INTO households (census_id, staff_id, household_id, address, status)
            VALUES (${census_id}, ${staff_id}, ${household_id}, ${address}, NOT_YET)
        `;
        
        sql:ExecutionResult|error result = dbClient->execute(query);
        if result is error {
            errorCount += 1;
            errors.push("Row " + i.toString() + ": Database error - " + result.message());
            log:printError("Failed to insert staff data for row " + i.toString(), result);
        } else if result.affectedRowCount > 0 {
            successCount += 1;
        } else {
            errorCount += 1;
            errors.push("Row " + i.toString() + ": No rows inserted");
        }
    }
    
    io:println("Households data uploaded for census ID: " + census_id);
    return {
        "message": "Staff data upload completed",
        "success_count": successCount,
        "error_count": errorCount,
        "errors": errors
    };
}

public function submitCensusData(string household_id, string censusId, json surveyData, string staffId) returns string|error {
    // string randID = uuid:createType4AsString();
    sql:ParameterizedQuery query = `
        INSERT INTO census_submissions (household_id, census_id, submitted_by_id, form_data,  submitted_at)
        VALUES (${household_id}, ${censusId}, ${staffId}, ${surveyData.toString()}, CURRENT_TIMESTAMP)
        RETURNING id
    `;
    
    stream<record {string id;}, sql:Error?> resultStream = dbClient->query(query);
    record {|record {string id;} value;|}? result = check resultStream.next();
    check resultStream.close();
    
    if result is () {
        return error("Failed to submit census data");
    }
    
    io:println("Census submission created with ID: " + result.value.id.toString());
    return result.value.id;
}

public function getCensusProjectById(int id) returns CensusProject|error {
    sql:ParameterizedQuery query = `SELECT * FROM census_projects WHERE id = ${id}`;
    
    stream<CensusProject, sql:Error?> resultStream = dbClient->query(query);
    record {|CensusProject value;|}? result = check resultStream.next();
    check resultStream.close();
    
    if result is () {
        return error("Census project not found");
    }
    
    return result.value;
}

public function extractStaffEmailFromToken(string authorization) returns string|error {
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
    
    // Extract email from "sub" field
    if payloadJson is map<json> {
        json subValue = payloadJson["sub"];
        if subValue is string {
            if subValue == "" {
                return error("Empty email in token 'sub' claim");
            }
            return subValue;
        } else {
            return error("Invalid 'sub' claim in token - expected string");
        }
    } else {
        return error("Invalid token payload - expected JSON object");
    }
}

public function extractStaffIdFromToken(string authorization) returns string|error {
    // First get the email from token
    string email = check extractStaffEmailFromToken(authorization);
    
    // Query database to get staff ID from email
    sql:ParameterizedQuery query = `SELECT id FROM Users WHERE email = ${email}`;
    
    stream<record {string id;}, sql:Error?> resultStream = dbClient->query(query);
    record {|record {string id;} value;|}? result = check resultStream.next();
    check resultStream.close();
    
    if result is () {
        return error("Staff member not found with email: " + email);
    }
    
    return result.value.id;
}

public isolated function createArea(string name, string description) returns json|error {
    sql:ParameterizedQuery query = `
        INSERT INTO areas (name, description, created_at)
        VALUES (${name}, ${description}, CURRENT_TIMESTAMP)`;

    sql:ExecutionResult result = check dbClient->execute(query);

    if result.affectedRowCount == 0 {
        log:printError("No rows affected during area creation");
        return error("Failed to create area");
    }
    
    io:println("Area created with ID: " + name);
    return {"name": name, "message": "Area created successfully"};
}

public isolated function assignFieldStaff(FieldStaffAssignment f) returns json|error {
    sql:ParameterizedQuery query = `
        INSERT INTO census_staff_assignment (staff_user_id, census_id, area_id)
        VALUES (${f.staff_user_id}, ${f.census_id}, ${f.area_id})`;

    sql:ExecutionResult result = check dbClient->execute(query);

    if result.affectedRowCount == 0 {
        log:printError("No rows affected during field staff creation");
        return error("Failed to create field staff");
    }

    io:println("Field staff with ID: " + f.staff_user_id + " Assigned to census with ID: " + f.census_id);
    return {"staff_id": f.staff_user_id, "message": "Field staff assigned successfully"};
}

public function getStaffAssignments(string staffId) returns json|error {
    // Query to get census assignments for a staff member
    sql:ParameterizedQuery query = `
        SELECT 
            cp.id as census_id,
            cp.project_name,
            cp.description,
            cp.start_date,
            cp.end_date,
            csa.area_id,
            a.name as area_name,
            a.description as area_description,
            COUNT(h.id) as total_households,
            COUNT(CASE WHEN h.status = 'COMPLETED' THEN 1 END) as completed_households,
            COUNT(CASE WHEN h.status = 'NOT_YET' THEN 1 END) as pending_households
        FROM census_projects cp
        JOIN census_staff_assignment csa ON cp.id = csa.census_id
        LEFT JOIN areas a ON csa.area_id = a.id
        LEFT JOIN households h ON cp.id = h.census_id AND h.staff_id = ${staffId}
        WHERE csa.staff_user_id = ${staffId} 
        AND cp.status IN ('active', 'ongoing')
        GROUP BY cp.id, cp.project_name, cp.description, cp.start_date, cp.end_date, 
                 cp.status, csa.area_id, a.name, a.description
        ORDER BY cp.start_date DESC
    `;
    
    stream<StaffAssignment, sql:Error?> resultStream = dbClient->query(query);
    
    json[] assignments = [];
    
    check from var assignment in resultStream
        do {
            // Calculate completion percentage
            decimal completionPercentage = 0.0;
            if assignment.total_households > 0 {
                completionPercentage = <decimal>assignment.completed_households / <decimal>assignment.total_households * 100.0;
            }
            
            assignments.push({
                "census_id": assignment.census_id,
                "project_name": assignment.project_name,
                "description": assignment.description,
                "start_date": assignment.start_date,
                "end_date": assignment.end_date,
                "area": {
                    "id": assignment.area_id,
                    "name": assignment.area_name,
                    "description": assignment.area_description
                },
                "households": {
                    "total": assignment.total_households,
                    "completed": assignment.completed_households,
                    "pending": assignment.pending_households,
                    "completion_percentage": completionPercentage
                }
            });
        };
    
    check resultStream.close();
    
    return {
        "staff_id": staffId,
        "assignments": assignments,
        "total_assignments": assignments.length()
    };
}