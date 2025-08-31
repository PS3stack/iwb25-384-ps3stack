# Voter Service

The voter management and operations service for the PS3Stack Voting System. This service handles voter registration, authentication, check-in processes, and voting operations at polling stations.

## 🎯 Purpose

The Voter Service provides:

- **Voter Registration** - Register and manage voter information
- **Voter Authentication** - Verify voter identity and eligibility
- **Check-in Operations** - Handle voter check-in at polling stations
- **Vote Processing** - Process and validate cast votes
- **Voter Analytics** - Generate voter turnout and demographic reports

## 🏗️ Architecture

```
Client → API Gateway → Voter Service (Port 8084)
                           ↓
                    Voter Registration
                           ↓
                    Identity Verification
                           ↓
                    Check-in Processing
                           ↓
                    Vote Handling
```

## 🚀 Getting Started

### Prerequisites

- Ballerina Swan Lake Update 8 or later
- Database connectivity for voter records
- Authentication service integration
- Election service connectivity

### Configuration

1. **Copy Configuration Template**:

   ```bash
   cp Config.toml.example Config.toml
   ```

2. **Update Configuration**:

   ```toml
   HTTP_PORT = 8084
   DATABASE_URL = "jdbc:mysql://localhost:3306/voter_db"
   DATABASE_USER = "voter_user"
   DATABASE_PASSWORD = "your_password"
   ELECTION_SERVICE_URL = "http://localhost:8082"
   ```

### Running the Service

```bash
# Start the Voter Service
bal run

# Check service health
curl http://localhost:8084/health
```

## 📋 API Endpoints

### Voter Registration

#### Register New Voter

```http
POST /voters/register
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "voter_id": "VID-2024-001234",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1-555-0123",
  "date_of_birth": "1990-05-15",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip_code": "62701"
  },
  "registration_date": "2024-01-15T10:00:00Z"
}
```

**Permission Required:** Admin or Observer

**Response:**

```json
{
  "message": "Voter registered successfully",
  "voter": {
    "id": 1,
    "voter_id": "VID-2024-001234",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@email.com",
    "status": "active",
    "registration_date": "2024-01-15T10:00:00Z"
  }
}
```

#### Bulk Voter Upload

```http
POST /elections/{electionId}/voters/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Form Data:
- file: voters.csv
- format: csv
```

**Permission Required:** Admin or Observer

### Voter Check-in

#### Check-in Voter

```http
POST /elections/{electionId}/voters/{voterId}/check-in
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "polling_station": "Station A-1",
  "check_in_time": "2024-11-05T09:15:00Z",
  "staff_id": "STAFF-001"
}
```

**Permission Required:** Polling Staff or Admin

**Response:**

```json
{
  "message": "Voter checked in successfully",
  "check_in": {
    "voter_id": "VID-2024-001234",
    "election_id": 1,
    "polling_station": "Station A-1",
    "check_in_time": "2024-11-05T09:15:00Z",
    "status": "checked_in",
    "ballot_issued": true
  }
}
```

#### Get Check-in Status

```http
GET /elections/{electionId}/voters/{voterId}/status
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "voter_id": "VID-2024-001234",
  "election_id": 1,
  "status": "checked_in",
  "check_in_time": "2024-11-05T09:15:00Z",
  "polling_station": "Station A-1",
  "ballot_issued": true,
  "vote_cast": false
}
```

### Vote Processing

#### Cast Vote

```http
POST /voters/cast
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "voter_id": "VID-2024-001234",
  "election_id": 1,
  "candidate_id": 2,
  "polling_station": "Station A-1",
  "cast_time": "2024-11-05T10:30:00Z"
}
```

**Response:**

```json
{
  "message": "Vote cast successfully",
  "vote_confirmation": {
    "vote_id": "VOTE-ABC123XYZ",
    "voter_id": "VID-2024-001234",
    "election_id": 1,
    "cast_time": "2024-11-05T10:30:00Z",
    "verification_code": "CONF-789456"
  }
}
```

#### Verify Vote

```http
GET /voters/{voterId}/votes/{voteId}/verify
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "vote_id": "VOTE-ABC123XYZ",
  "status": "verified",
  "cast_time": "2024-11-05T10:30:00Z",
  "verification_hash": "sha256:abc123...",
  "is_valid": true
}
```

### Voter Analytics

#### Get Voter Statistics

```http
GET /elections/{electionId}/statistics
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "election_id": 1,
  "total_registered_voters": 50000,
  "checked_in_voters": 12500,
  "votes_cast": 12000,
  "turnout_rate": 24.0,
  "demographics": {
    "age_groups": {
      "18-25": 2500,
      "26-35": 3000,
      "36-50": 4000,
      "51-65": 2000,
      "65+": 500
    },
    "by_location": {
      "urban": 8000,
      "suburban": 3000,
      "rural": 1000
    }
  },
  "polling_stations": [
    {
      "station_id": "Station A-1",
      "checked_in": 250,
      "votes_cast": 240,
      "turnout_rate": 96.0
    }
  ]
}
```

#### Get Turnout Report

```http
GET /elections/{electionId}/turnout
Authorization: Bearer <jwt_token>
```

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "service": "PS3Stack Voter Service",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": 1693123456,
  "database_status": "connected",
  "total_registered_voters": 150000,
  "active_polling_stations": 25
}
```

## 👤 Voter Lifecycle

### Registration Process

1. **Data Collection** - Gather voter information
2. **Eligibility Verification** - Check voting eligibility
3. **Identity Validation** - Verify voter identity
4. **Record Creation** - Create voter record
5. **Status Assignment** - Set voter status (active/inactive)

### Election Day Process

1. **Arrival** - Voter arrives at polling station
2. **Identity Check** - Verify voter identity
3. **Check-in** - Record voter check-in
4. **Ballot Issuance** - Issue voting ballot
5. **Vote Casting** - Process vote submission
6. **Confirmation** - Provide vote confirmation

### Voter Statuses

- **Active** - Eligible to vote
- **Inactive** - Temporarily ineligible
- **Suspended** - Account suspended
- **Archived** - Historical record only

## 🛡️ Security Features

### Identity Verification

- **Multi-factor Authentication** - Multiple verification points
- **Biometric Validation** - Fingerprint/photo verification (future)
- **Document Verification** - ID document validation
- **Cross-reference Checks** - Duplicate voter prevention

### Data Protection

- **PII Encryption** - Personal information protection
- **Access Logging** - Comprehensive audit trails
- **Data Anonymization** - Privacy-preserving analytics
- **Secure Storage** - Encrypted data at rest

### Vote Security

- **Vote Anonymization** - Voter-vote separation
- **Double Voting Prevention** - One vote per voter enforcement
- **Vote Verification** - Cryptographic vote validation
- **Audit Trail** - Complete voting history

## 🔧 Configuration

### Config.toml Structure

```toml
# Server Configuration
HTTP_PORT = 8084

# Database Configuration
DATABASE_URL = "jdbc:mysql://localhost:3306/voter_db"
DATABASE_USER = "voter_user"
DATABASE_PASSWORD = "secure_password"
CONNECTION_POOL_SIZE = 15

# Service Integration
ELECTION_SERVICE_URL = "http://localhost:8082"
AUTH_SERVICE_URL = "http://localhost:8085"

# Voter Configuration
MAX_VOTERS_PER_ELECTION = 100000
ENABLE_BULK_UPLOAD = true
DUPLICATE_CHECK_ENABLED = true

# Security Configuration
ENABLE_PII_ENCRYPTION = true
BIOMETRIC_VERIFICATION = false
AUDIT_LOGGING = true
VOTER_PRIVACY_MODE = true
```

## 🧪 Testing

### Voter Registration Testing

```bash
# Register New Voter
curl -X POST http://localhost:8084/voters/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "voter_id": "TEST-001",
    "first_name": "Test",
    "last_name": "Voter",
    "email": "test.voter@email.com",
    "phone": "+1-555-0199",
    "date_of_birth": "1995-03-20",
    "address": {
      "street": "456 Test Ave",
      "city": "Test City",
      "state": "TS",
      "zip_code": "12345"
    }
  }'

# Check-in Voter
curl -X POST http://localhost:8084/elections/1/voters/TEST-001/check-in \
  -H "Authorization: Bearer YOUR_POLLING_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "polling_station": "TEST-STATION",
    "staff_id": "STAFF-TEST"
  }'

# Cast Vote
curl -X POST http://localhost:8084/voters/cast \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "voter_id": "TEST-001",
    "election_id": 1,
    "candidate_id": 1,
    "polling_station": "TEST-STATION"
  }'

# Get Statistics
curl -X GET http://localhost:8084/elections/1/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Data Models

### Voter Model

```json
{
  "id": "integer",
  "voter_id": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "date_of_birth": "date",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zip_code": "string"
  },
  "status": "enum[active,inactive,suspended,archived]",
  "registration_date": "datetime",
  "last_updated": "datetime"
}
```

### Check-in Model

```json
{
  "id": "integer",
  "voter_id": "string",
  "election_id": "integer",
  "polling_station": "string",
  "check_in_time": "datetime",
  "staff_id": "string",
  "ballot_issued": "boolean",
  "status": "enum[checked_in,voted,completed]"
}
```

### Vote Record Model

```json
{
  "vote_id": "string",
  "voter_id": "string",
  "election_id": "integer",
  "candidate_id": "integer",
  "cast_time": "datetime",
  "polling_station": "string",
  "verification_hash": "string",
  "confirmation_code": "string"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Voter Not Found (404)**
   - Verify voter ID exists in system
   - Check voter registration status
   - Ensure voter is registered for election

2. **Check-in Failed (400)**
   - Verify voter hasn't already checked in
   - Check if election is active
   - Ensure polling station is valid

3. **Vote Casting Failed (403)**
   - Verify voter has checked in
   - Check if voter has already voted
   - Ensure ballot was issued

4. **Database Connection Issues**
   - Verify database service is running
   - Check connection credentials
   - Ensure voter database schema exists

### Debug Commands

```bash
# Check voter status
curl -X GET http://localhost:8084/elections/1/voters/VID-001/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify service health
curl -X GET http://localhost:8084/health

# Check database connectivity
curl -X GET http://localhost:8084/debug/database-status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📝 Development

### Project Structure

```
voter_service/
├── Ballerina.toml          # Project configuration
├── Config.toml.example     # Configuration template
├── Dependencies.toml       # Dependencies
├── main.bal               # Main service implementation
└── modules/
    ├── voter/             # Voter management logic
    ├── checkin/           # Check-in operations
    ├── voting/            # Vote processing
    ├── analytics/         # Voter analytics
    ├── database/          # Database operations
    └── security/          # Security utilities
```

### Adding New Features

1. **Define Data Models** - Create voter-related structures
2. **Implement Database Layer** - Add data persistence
3. **Create Service Endpoints** - Define HTTP APIs
4. **Add Security Measures** - Implement access controls
5. **Update Documentation** - Document new capabilities

## 🚢 Deployment

### Docker Deployment

```dockerfile
FROM ballerina/ballerina:swan-lake-latest

COPY . /home/ballerina/
WORKDIR /home/ballerina/

RUN bal build
EXPOSE 8084

CMD ["bal", "run", "target/bin/voter_service.jar"]
```

### Database Setup

```sql
CREATE DATABASE voter_db;
CREATE USER 'voter_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON voter_db.* TO 'voter_user'@'localhost';

USE voter_db;

CREATE TABLE voters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voter_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE NOT NULL,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(50),
    address_zip VARCHAR(20),
    status ENUM('active', 'inactive', 'suspended', 'archived') DEFAULT 'active',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE voter_checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voter_id VARCHAR(50) NOT NULL,
    election_id INT NOT NULL,
    polling_station VARCHAR(100) NOT NULL,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    staff_id VARCHAR(50) NOT NULL,
    ballot_issued BOOLEAN DEFAULT FALSE,
    status ENUM('checked_in', 'voted', 'completed') DEFAULT 'checked_in',
    FOREIGN KEY (voter_id) REFERENCES voters(voter_id),
    UNIQUE KEY unique_voter_election (voter_id, election_id)
);

CREATE TABLE vote_records (
    vote_id VARCHAR(255) PRIMARY KEY,
    voter_id VARCHAR(50) NOT NULL,
    election_id INT NOT NULL,
    candidate_id INT NOT NULL,
    cast_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    polling_station VARCHAR(100),
    verification_hash VARCHAR(255),
    confirmation_code VARCHAR(50),
    FOREIGN KEY (voter_id) REFERENCES voters(voter_id)
);
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
