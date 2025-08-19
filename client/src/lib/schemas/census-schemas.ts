export const censusProjectSchema = {
  "pages": [{
    "name": "projectDetails",
    "elements": [
      {
        "type": "text",
        "name": "title",
        "title": "Census Project Title",
        "isRequired": true,
        "validators": [
          { "type": "text", "minLength": 3, "maxLength": 100 }
        ]
      },
      {
        "type": "comment",
        "name": "description",
        "title": "Project Description",
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
        "type": "number",
        "name": "targetPopulation",
        "title": "Target Population",
        "isRequired": true,
        "min": 1
      },
      {
        "type": "boolean",
        "name": "isPublic",
        "title": "Make this census publicly accessible",
        "defaultValue": true
      }
    ]
  }],
  "showQuestionNumbers": "off",
  "showProgressBar": "bottom"
};

export const dataCollectorSchema = {
  "pages": [{
    "name": "collectorDetails",
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
        "name": "employeeId",
        "title": "Employee ID",
        "isRequired": true
      },
      {
        "type": "checkbox",
        "name": "assignedAreas",
        "title": "Assigned Areas",
        "choices": [
          { "value": "area1", "text": "Downtown District" },
          { "value": "area2", "text": "Residential North" },
          { "value": "area3", "text": "Industrial Zone" },
          { "value": "area4", "text": "Suburban South" }
        ]
      }
    ]
  }]
};

export const householdDataSchema = {
  "pages": [
    {
      "name": "householdInfo",
      "title": "Household Information",
      "elements": [
        {
          "type": "text",
          "name": "householdNumber",
          "title": "Household Number",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "address",
          "title": "Complete Address",
          "isRequired": true
        },
        {
          "type": "number",
          "name": "totalMembers",
          "title": "Total Household Members",
          "isRequired": true,
          "min": 1
        },
        {
          "type": "dropdown",
          "name": "dwellingType",
          "title": "Type of Dwelling",
          "choices": [
            { "value": "house", "text": "House" },
            { "value": "apartment", "text": "Apartment" },
            { "value": "condo", "text": "Condominium" },
            { "value": "other", "text": "Other" }
          ]
        }
      ]
    },
    {
      "name": "demographics",
      "title": "Demographics",
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "members",
          "title": "Household Members",
          "columns": [
            {
              "name": "name",
              "title": "Full Name",
              "cellType": "text",
              "isRequired": true
            },
            {
              "name": "age",
              "title": "Age",
              "cellType": "number",
              "isRequired": true
            },
            {
              "name": "gender",
              "title": "Gender",
              "cellType": "dropdown",
              "choices": ["Male", "Female", "Other"]
            },
            {
              "name": "relationship",
              "title": "Relationship to Head",
              "cellType": "dropdown",
              "choices": ["Head", "Spouse", "Child", "Parent", "Sibling", "Other"]
            }
          ]
        }
      ]
    }
  ]
};