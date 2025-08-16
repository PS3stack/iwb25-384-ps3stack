import ballerina/time;

public type Status "PLANNED"| "ACTIVE"| "COMPLETED"| "CANCELLED";

public type CensusProject record {
    int id?;
    string projectName;
    string description;
    string startDate;
    string endDate;
    Status status; // "PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"
    string createdBy;
    time:Utc createdAt?;
    time:Utc updatedAt?;
};

public type CensusStaff record {
    int id?;
    string staffId;
    string firstName;
    string lastName;
    string email;
    string phoneNumber;
    string role; // "ENUMERATOR", "SUPERVISOR", "COORDINATOR"
    string district;
    string province;
    string status; // "ACTIVE", "INACTIVE"
    time:Utc createdAt?;
};

public type StaffAssignment record {
    int id?;
    int projectId;
    int staffId;
    string assignedDistrict;
    string assignedArea;
    string assignmentDate;
    string status; // "ASSIGNED", "IN_PROGRESS", "COMPLETED"
    int targetHouseholds?;
    int completedHouseholds?;
};

public type CensusSubmission record {
    int id?;
    int projectId;
    int staffId;
    string householdId;
    string submissionData; // JSON string containing census form data
    string location; // GPS coordinates or address
    string submissionDate;
    string status; // "DRAFT", "SUBMITTED", "VERIFIED", "REJECTED"
    string verifiedBy?;
    string verificationDate?;
    string remarks?;
};

public type CensusForm record {
    string householdId;
    string headOfHouseholdName;
    string address;
    string district;
    string province;
    int totalMembers;
    json memberDetails; // Array of household members
    string housingType;
    string facilities; // JSON string for utilities
    string economicStatus;
};