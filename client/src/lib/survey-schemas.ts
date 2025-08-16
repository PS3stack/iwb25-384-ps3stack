export const electionFormSchema = {
  "pages": [{
    "name": "electionDetails",
    "elements": [
      {
        "type": "text",
        "name": "title",
        "title": "Election Title",
        "isRequired": true,
        "validators": [
          { "type": "text", "minLength": 3, "maxLength": 100 }
        ]
      },
      {
        "type": "comment",
        "name": "description",
        "title": "Election Description",
        "isRequired": true,
        "validators": [
          { "type": "text", "minLength": 10, "maxLength": 500 }
        ]
      },
      {
        "type": "datetime-local",
        "name": "startDate",
        "title": "Start Date & Time",
        "isRequired": true
      },
      {
        "type": "datetime-local",
        "name": "endDate",
        "title": "End Date & Time",
        "isRequired": true
      },
      {
        "type": "dropdown",
        "name": "eligibilityGroup",
        "title": "Eligibility Group",
        "isRequired": true,
        "choices": [
          { "value": "all", "text": "All Registered Voters" },
          { "value": "faculty", "text": "Faculty Members" },
          { "value": "staff", "text": "Staff Members" },
          { "value": "students", "text": "Students" },
          { "value": "alumni", "text": "Alumni" }
        ]
      },
      {
        "type": "boolean",
        "name": "isPublic",
        "title": "Make this election public",
        "defaultValue": true
      }
    ]
  }],
  "showQuestionNumbers": "off",
  "showProgressBar": "bottom"
};

export const observerFormSchema = {
  "pages": [{
    "name": "observerDetails",
    "elements": [
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
        "type": "email",
        "name": "email",
        "title": "Email Address",
        "isRequired": true
      },
      {
        "type": "text",
        "name": "phone",
        "title": "Phone Number",
        "isRequired": true,
        "inputType": "tel"
      },
      {
        "type": "text",
        "name": "credentials",
        "title": "Credentials/Organization",
        "isRequired": true
      },
      {
        "type": "checkbox",
        "name": "assignedAreas",
        "title": "Assigned Areas",
        "choices": [
          { "value": "area1", "text": "Main Hall" },
          { "value": "area2", "text": "Conference Room A" },
          { "value": "area3", "text": "Conference Room B" },
          { "value": "area4", "text": "Auditorium" }
        ]
      }
    ]
  }]
};

export const candidateFormSchema = {
  "pages": [{
    "name": "candidateDetails",
    "elements": [
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
        "name": "party",
        "title": "Party Affiliation",
        "isRequired": true
      },
      {
        "type": "dropdown",
        "name": "assignedArea",
        "title": "Assigned Area",
        "isRequired": true,
        "choices": [
          { "value": "area1", "text": "District 1" },
          { "value": "area2", "text": "District 2" },
          { "value": "area3", "text": "District 3" },
          { "value": "area4", "text": "At-Large" }
        ]
      },
      {
        "type": "comment",
        "name": "biography",
        "title": "Biography",
        "isRequired": true,
        "validators": [
          { "type": "text", "maxLength": 1000 }
        ]
      }
    ]
  }]
};

export const voterFormSchema = {
  "pages": [{
    "name": "voterDetails",
    "elements": [
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
        "type": "email",
        "name": "email",
        "title": "Email Address",
        "isRequired": true
      },
      {
        "type": "text",
        "name": "voterId",
        "title": "Voter ID",
        "isRequired": true
      },
      {
        "type": "dropdown",
        "name": "area",
        "title": "Voting Area",
        "isRequired": true,
        "choices": [
          { "value": "area1", "text": "Main Hall" },
          { "value": "area2", "text": "Conference Room A" },
          { "value": "area3", "text": "Conference Room B" },
          { "value": "area4", "text": "Auditorium" }
        ]
      },
      {
        "type": "dropdown",
        "name": "eligibilityGroup",
        "title": "Eligibility Group",
        "isRequired": true,
        "choices": [
          { "value": "faculty", "text": "Faculty" },
          { "value": "staff", "text": "Staff" },
          { "value": "student", "text": "Student" },
          { "value": "alumni", "text": "Alumni" }
        ]
      }
    ]
  }]
};

export const areaFormSchema = {
  "pages": [{
    "name": "areaDetails",
    "elements": [
      {
        "type": "text",
        "name": "name",
        "title": "Area Name",
        "isRequired": true
      },
      {
        "type": "text",
        "name": "code",
        "title": "Area Code",
        "isRequired": true
      },
      {
        "type": "comment",
        "name": "description",
        "title": "Description",
        "isRequired": false
      },
      {
        "type": "number",
        "name": "capacity",
        "title": "Capacity",
        "isRequired": true,
        "min": 1
      }
    ]
  }]
};

export const qualificationFormSchema = {
  "pages": [{
    "name": "qualificationDetails",
    "elements": [
      {
        "type": "text",
        "name": "title",
        "title": "Qualification Title",
        "isRequired": true
      },
      {
        "type": "comment",
        "name": "description",
        "title": "Description",
        "isRequired": true
      },
      {
        "type": "tagbox",
        "name": "requirements",
        "title": "Requirements",
        "allowOtherText": true,
        "otherText": "Add requirement...",
        "choices": [
          "Minimum age 18",
          "Registered voter",
          "No criminal record",
          "Resident of district",
          "College degree"
        ]
      },
      {
        "type": "boolean",
        "name": "isRequired",
        "title": "Is this qualification mandatory?",
        "defaultValue": false
      }
    ]
  }]
};

export const settingsFormSchema = {
  "pages": [
    {
      "name": "general",
      "title": "General Settings",
      "elements": [
        {
          "type": "text",
          "name": "organizationName",
          "title": "Organization Name",
          "isRequired": true
        },
        {
          "type": "dropdown",
          "name": "timezone",
          "title": "Timezone",
          "isRequired": true,
          "choices": [
            { "value": "UTC-5", "text": "Eastern Time (UTC-5)" },
            { "value": "UTC-6", "text": "Central Time (UTC-6)" },
            { "value": "UTC-7", "text": "Mountain Time (UTC-7)" },
            { "value": "UTC-8", "text": "Pacific Time (UTC-8)" }
          ]
        },
        {
          "type": "dropdown",
          "name": "language",
          "title": "Default Language",
          "choices": [
            { "value": "en", "text": "English" },
            { "value": "es", "text": "Spanish" },
            { "value": "fr", "text": "French" }
          ]
        },
        {
          "type": "dropdown",
          "name": "dateFormat",
          "title": "Date Format",
          "choices": [
            { "value": "MM/DD/YYYY", "text": "MM/DD/YYYY" },
            { "value": "DD/MM/YYYY", "text": "DD/MM/YYYY" },
            { "value": "YYYY-MM-DD", "text": "YYYY-MM-DD" }
          ]
        }
      ]
    },
    {
      "name": "security",
      "title": "Security Settings",
      "elements": [
        {
          "type": "number",
          "name": "sessionTimeout",
          "title": "Session Timeout (minutes)",
          "isRequired": true,
          "min": 5,
          "max": 480,
          "defaultValue": 30
        },
        {
          "type": "number",
          "name": "minLength",
          "title": "Minimum Password Length",
          "isRequired": true,
          "min": 6,
          "max": 20,
          "defaultValue": 8
        },
        {
          "type": "boolean",
          "name": "requireSpecialChars",
          "title": "Require Special Characters",
          "defaultValue": true
        },
        {
          "type": "boolean",
          "name": "requireNumbers",
          "title": "Require Numbers",
          "defaultValue": true
        },
        {
          "type": "boolean",
          "name": "requireUppercase",
          "title": "Require Uppercase Letters",
          "defaultValue": true
        },
        {
          "type": "boolean",
          "name": "twoFactorEnabled",
          "title": "Enable Two-Factor Authentication",
          "defaultValue": false
        }
      ]
    },
    {
      "name": "notifications",
      "title": "Notification Settings",
      "elements": [
        {
          "type": "boolean",
          "name": "emailNotifications",
          "title": "Enable Email Notifications",
          "defaultValue": true
        },
        {
          "type": "boolean",
          "name": "smsNotifications",
          "title": "Enable SMS Notifications",
          "defaultValue": false
        },
        {
          "type": "boolean",
          "name": "pushNotifications",
          "title": "Enable Push Notifications",
          "defaultValue": true
        },
        {
          "type": "checkbox",
          "name": "notificationRoles",
          "title": "Roles to Receive Notifications",
          "choices": [
            { "value": "admin", "text": "Administrators" },
            { "value": "observer", "text": "Observers" },
            { "value": "staff", "text": "Staff" },
            { "value": "candidate", "text": "Candidates" }
          ]
        }
      ]
    }
  ],
  "showQuestionNumbers": "off",
  "showProgressBar": "bottom"
};