# Census Service

The demographic data collection and management service for the PS3Stack Voting System. This service handles population census data, demographic analysis, and voter eligibility determination based on census information.

## 🎯 Purpose

The Census Service provides:

- **Population Data Management** - Collect and maintain demographic information
- **Eligibility Verification** - Determine voter eligibility based on census data
- **Demographic Analytics** - Generate population statistics and reports
- **Geographic Mapping** - Associate census data with electoral districts
- **Data Integration** - Connect census information with voter registration

## 🏗️ Architecture

```
Client → API Gateway → Census Service (Port 8081)
                           ↓
                    Census Data Management
                           ↓
                    Demographic Processing
                           ↓
                    Eligibility Assessment
                           ↓
                    Analytics Generation
```

## 🚀 Getting Started

### Prerequisites

- Ballerina Swan Lake Update 8 or later
- Database connectivity for census records
- Authentication service integration
- Geographic data processing capabilities

### Configuration

1. **Copy Configuration Template**:

   ```bash
   cp Config.toml.example Config.toml
   ```

2. **Update Configuration**:

   ```toml
   HTTP_PORT = 8081
   DATABASE_URL = "jdbc:mysql://localhost:3306/census_db"
   DATABASE_USER = "census_user"
   DATABASE_PASSWORD = "your_password"
   GIS_ENABLED = true
   ```

### Running the Service

```bash
# Start the Census Service
bal run

# Check service health
curl http://localhost:8081/health
```

## 📋 API Endpoints

### Census Project Management

#### List Census Projects

```http
GET /census
Authorization: Bearer <jwt_token>
```

**Permission Required:** Admin or Field Staff

**Response:**

```json
{
  "projects": [
    {
      "id": 1,
      "name": "National Census 2024",
      "description": "Comprehensive population census for 2024 elections",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-03-31T23:59:59Z",
      "status": "active",
      "total_records": 1500000,
      "completion_rate": 85.5
    }
  ]
}
```

#### Create Census Project

```http
POST /census
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Regional Census 2024",
  "description": "Regional population assessment for electoral planning",
  "start_date": "2024-02-01T00:00:00Z",
  "end_date": "2024-04-30T23:59:59Z",
  "geographic_scope": "regional",
  "target_population": 500000
}
```

**Permission Required:** Admin only

#### Get Census Project Details

```http
GET /census/{id}
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "id": 1,
  "name": "National Census 2024",
  "description": "Comprehensive population census for 2024 elections",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-03-31T23:59:59Z",
  "status": "active",
  "geographic_scope": "national",
  "target_population": 2000000,
  "statistics": {
    "total_records": 1500000,
    "completion_rate": 75.0,
    "by_age_group": {
      "18-25": 300000,
      "26-35": 400000,
      "36-50": 450000,
      "51-65": 250000,
      "65+": 100000
    },
    "by_gender": {
      "male": 750000,
      "female": 745000,
      "other": 5000
    },
    "by_location": {
      "urban": 900000,
      "suburban": 400000,
      "rural": 200000
    }
  }
}
```

#### Update Census Project

```http
PUT /census/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Census Name",
  "description": "Updated description",
  "end_date": "2024-05-31T23:59:59Z"
}
```

**Permission Required:** Admin only

#### Delete Census Project

```http
DELETE /census/{id}
Authorization: Bearer <jwt_token>
```

**Permission Required:** Admin only

### Population Records

#### Add Population Record

```http
POST /census/{censusId}/records
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "person_id": "PID-2024-001234",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-05-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip_code": "62701",
    "district": "District 5"
  },
  "citizenship": "citizen",
  "registration_eligible": true
}
```

**Permission Required:** Admin or Field Staff

#### Bulk Upload Records

```http
POST /census/{censusId}/records/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Form Data:
- file: census_data.csv
- format: csv
- validation_mode: strict
```

**Permission Required:** Admin or Field Staff

#### Search Population Records

```http
GET /census/{censusId}/records/search?name=John&city=Springfield
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "total_results": 15,
  "page": 1,
  "per_page": 10,
  "records": [
    {
      "person_id": "PID-2024-001234",
      "first_name": "John",
      "last_name": "Doe",
      "age": 34,
      "gender": "male",
      "city": "Springfield",
      "district": "District 5",
      "registration_eligible": true
    }
  ]
}
```

### Eligibility Services

#### Check Voter Eligibility

```http
POST /census/eligibility/check
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "person_id": "PID-2024-001234",
  "census_id": 1,
  "verification_data": {
    "name": "John Doe",
    "date_of_birth": "1990-05-15",
    "address": "123 Main St, Springfield, IL"
  }
}
```

**Response:**

```json
{
  "person_id": "PID-2024-001234",
  "eligible": true,
  "eligibility_reasons": [
    "Age requirement met (18+)",
    "Citizenship verified",
    "Address confirmed in district"
  ],
  "district": "District 5",
  "polling_station": "Springfield Community Center",
  "registration_deadline": "2024-10-15T23:59:59Z"
}
```

#### Bulk Eligibility Check

```http
POST /census/eligibility/bulk-check
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "census_id": 1,
  "person_ids": ["PID-001", "PID-002", "PID-003"],
  "criteria": {
    "min_age": 18,
    "citizenship_required": true,
    "district_validation": true
  }
}
```

### Analytics and Reports

#### Get Demographic Analytics

```http
GET /census/{censusId}/analytics
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "census_id": 1,
  "total_population": 1500000,
  "eligible_voters": 1200000,
  "eligibility_rate": 80.0,
  "demographics": {
    "age_distribution": {
      "18-25": {"count": 300000, "percentage": 20.0},
      "26-35": {"count": 400000, "percentage": 26.7},
      "36-50": {"count": 450000, "percentage": 30.0},
      "51-65": {"count": 250000, "percentage": 16.7},
      "65+": {"count": 100000, "percentage": 6.7}
    },
    "gender_distribution": {
      "male": {"count": 750000, "percentage": 50.0},
      "female": {"count": 745000, "percentage": 49.7},
      "other": {"count": 5000, "percentage": 0.3}
    },
    "geographic_distribution": {
      "urban": {"count": 900000, "percentage": 60.0},
      "suburban": {"count": 400000, "percentage": 26.7},
      "rural": {"count": 200000, "percentage": 13.3}
    }
  },
  "electoral_districts": [
    {
      "district_id": "D001",
      "district_name": "District 1",
      "population": 150000,
      "eligible_voters": 120000,
      "polling_stations": 15
    }
  ]
}
```

#### Generate District Report

```http
GET /census/{censusId}/reports/district/{districtId}
Authorization: Bearer <jwt_token>
```

#### Export Census Data

```http
GET /census/{censusId}/export?format=csv&fields=basic
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `format`: csv, json, excel
- `fields`: basic, full, analytics

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "service": "PS3Stack Census Service",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": 1693123456,
  "database_status": "connected",
  "active_census_projects": 3,
  "total_population_records": 1500000
}
```

## 📊 Census Data Models

### Census Project Model

```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "start_date": "datetime",
  "end_date": "datetime",
  "status": "enum[planning,active,completed,archived]",
  "geographic_scope": "enum[national,regional,local]",
  "target_population": "integer",
  "created_by": "integer",
  "created_at": "datetime"
}
```

### Population Record Model

```json
{
  "person_id": "string",
  "census_id": "integer",
  "first_name": "string",
  "last_name": "string",
  "date_of_birth": "date",
  "gender": "enum[male,female,other]",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zip_code": "string",
    "district": "string",
    "coordinates": {
      "latitude": "float",
      "longitude": "float"
    }
  },
  "citizenship": "enum[citizen,resident,other]",
  "registration_eligible": "boolean",
  "created_at": "datetime"
}
```

### District Model

```json
{
  "district_id": "string",
  "district_name": "string",
  "geographic_boundaries": "geojson",
  "population_count": "integer",
  "eligible_voter_count": "integer",
  "polling_stations": "array",
  "representative_count": "integer"
}
```

## 🛡️ Security and Privacy

### Data Protection

- **PII Encryption** - Personal information encrypted at rest
- **Access Controls** - Role-based data access restrictions
- **Audit Logging** - Comprehensive access logging
- **Data Retention** - Configurable data retention policies

### Privacy Compliance

- **Data Anonymization** - Remove PII for analytics
- **Consent Management** - Track data usage consent
- **Right to Deletion** - Support data deletion requests
- **Export Capabilities** - Allow data portability

### Geographic Security

- **Location Privacy** - Protect precise location data
- **District Boundaries** - Secure electoral district information
- **Address Validation** - Verify address authenticity

## 🔧 Configuration

### Config.toml Structure

```toml
# Server Configuration
HTTP_PORT = 8081

# Database Configuration
DATABASE_URL = "jdbc:mysql://localhost:3306/census_db"
DATABASE_USER = "census_user"
DATABASE_PASSWORD = "secure_password"
CONNECTION_POOL_SIZE = 20

# Geographic Information System
GIS_ENABLED = true
MAP_SERVICE_URL = "https://maps.example.com/api"
COORDINATE_SYSTEM = "WGS84"

# Census Configuration
MAX_RECORDS_PER_PROJECT = 5000000
BULK_UPLOAD_BATCH_SIZE = 1000
ENABLE_ADDRESS_VALIDATION = true

# Analytics Configuration
ENABLE_REAL_TIME_ANALYTICS = true
ANALYTICS_CACHE_TTL = 3600
REPORT_GENERATION_TIMEOUT = 300

# Privacy Configuration
ENABLE_PII_ENCRYPTION = true
DATA_RETENTION_DAYS = 2555  # 7 years
ENABLE_ANONYMIZATION = true
```

## 🧪 Testing

### Census Management Testing

```bash
# Create Census Project
curl -X POST http://localhost:8081/census \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Census 2024",
    "description": "Test census project",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z",
    "geographic_scope": "local",
    "target_population": 10000
  }'

# Add Population Record
curl -X POST http://localhost:8081/census/1/records \
  -H "Authorization: Bearer YOUR_FIELD_STAFF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": "TEST-001",
    "first_name": "Test",
    "last_name": "Person",
    "date_of_birth": "1995-01-01",
    "gender": "male",
    "address": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "TS",
      "zip_code": "12345",
      "district": "Test District"
    },
    "citizenship": "citizen",
    "registration_eligible": true
  }'

# Check Eligibility
curl -X POST http://localhost:8081/census/eligibility/check \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": "TEST-001",
    "census_id": 1,
    "verification_data": {
      "name": "Test Person",
      "date_of_birth": "1995-01-01"
    }
  }'

# Get Analytics
curl -X GET http://localhost:8081/census/1/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### Common Issues

1. **Census Project Not Found (404)**
   - Verify census project ID exists
   - Check user permissions for project access
   - Ensure project hasn't been archived

2. **Invalid Population Record (400)**
   - Verify required fields are provided
   - Check date formats (ISO 8601)
   - Ensure person_id is unique within census

3. **Eligibility Check Failed (422)**
   - Verify person exists in census
   - Check verification data accuracy
   - Ensure census data is complete

4. **Geographic Processing Error (500)**
   - Check GIS service connectivity
   - Verify coordinate system configuration
   - Ensure district boundary data is loaded

## 📝 Development

### Project Structure

```
census_service/
├── Ballerina.toml          # Project configuration
├── Config.toml.example     # Configuration template
├── Dependencies.toml       # Dependencies
├── main.bal               # Main service implementation
└── modules/
    ├── census/            # Census project management
    ├── population/        # Population record handling
    ├── eligibility/       # Voter eligibility processing
    ├── analytics/         # Demographic analytics
    ├── geography/         # Geographic data processing
    └── database/          # Database operations
```

### Adding New Features

1. **Define Data Models** - Create census-related structures
2. **Implement Database Layer** - Add data persistence
3. **Create Service Endpoints** - Define HTTP APIs
4. **Add Analytics Functions** - Implement reporting
5. **Update Documentation** - Document new capabilities

## 🚢 Deployment

### Docker Deployment

```dockerfile
FROM ballerina/ballerina:swan-lake-latest

COPY . /home/ballerina/
WORKDIR /home/ballerina/

RUN bal build
EXPOSE 8081

CMD ["bal", "run", "target/bin/census_service.jar"]
```

### Database Setup

```sql
CREATE DATABASE census_db;
CREATE USER 'census_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON census_db.* TO 'census_user'@'localhost';

USE census_db;

CREATE TABLE census_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('planning', 'active', 'completed', 'archived') DEFAULT 'planning',
    geographic_scope ENUM('national', 'regional', 'local') NOT NULL,
    target_population INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE population_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    person_id VARCHAR(50) NOT NULL,
    census_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(50),
    address_zip VARCHAR(20),
    address_district VARCHAR(100),
    address_latitude DECIMAL(10, 8),
    address_longitude DECIMAL(11, 8),
    citizenship ENUM('citizen', 'resident', 'other') NOT NULL,
    registration_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (census_id) REFERENCES census_projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_person_census (person_id, census_id)
);

CREATE TABLE electoral_districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district_id VARCHAR(50) UNIQUE NOT NULL,
    district_name VARCHAR(255) NOT NULL,
    geographic_boundaries JSON,
    population_count INT DEFAULT 0,
    eligible_voter_count INT DEFAULT 0,
    representative_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
