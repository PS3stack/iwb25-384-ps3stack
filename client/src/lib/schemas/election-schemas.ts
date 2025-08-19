export const voterIdSchema = {
  "pages": [{
    "name": "identification",
    "elements": [
      {
        "type": "text",
        "name": "voterId",
        "title": "Voter ID Number",
        "isRequired": true,
        "validators": [
          { "type": "regex", "regex": "^[A-Z0-9]{8,12}$", "text": "Please enter a valid voter ID" }
        ]
      },
      {
        "type": "text",
        "name": "firstName",
        "title": "First Name",
        "isRequired": true
      },
      {
        "type": "text",
        "name": "lastName",
        "title": "Last Name",
        "isRequired": true
      },
      {
        "type": "text",
        "name": "dateOfBirth",
        "title": "Date of Birth",
        "inputType": "date",
        "isRequired": true
      }
    ]
  }]
};

export const pollingOfficialLoginSchema = {
  "pages": [{
    "name": "login",
    "elements": [
      {
        "type": "text",
        "name": "officialId",
        "title": "Official ID",
        "isRequired": true
      },
      {
        "type": "password",
        "name": "password",
        "title": "Password",
        "isRequired": true
      },
      {
        "type": "dropdown",
        "name": "pollingStation",
        "title": "Polling Station",
        "isRequired": true,
        "choices": [
          { "value": "ps001", "text": "Central Community Center" },
          { "value": "ps002", "text": "North Elementary School" },
          { "value": "ps003", "text": "South High School" },
          { "value": "ps004", "text": "West Library" }
        ]
      }
    ]
  }]
};

export const reportSubmissionSchema = {
  "pages": [{
    "name": "report",
    "elements": [
      {
        "type": "dropdown",
        "name": "reportType",
        "title": "Report Type",
        "isRequired": true,
        "choices": [
          { "value": "incident", "text": "Incident Report" },
          { "value": "irregularity", "text": "Voting Irregularity" },
          { "value": "technical", "text": "Technical Issue" },
          { "value": "general", "text": "General Observation" }
        ]
      },
      {
        "type": "comment",
        "name": "description",
        "title": "Detailed Description",
        "isRequired": true,
        "validators": [
          { "type": "text", "minLength": 20 }
        ]
      },
      {
        "type": "text",
        "name": "timeOfIncident",
        "title": "Time of Incident",
        "inputType": "datetime-local",
        "isRequired": true
      },
      {
        "type": "dropdown",
        "name": "severity",
        "title": "Severity Level",
        "choices": [
          { "value": "low", "text": "Low" },
          { "value": "medium", "text": "Medium" },
          { "value": "high", "text": "High" },
          { "value": "critical", "text": "Critical" }
        ]
      }
    ]
  }]
};