# Election Service

The core election management service for the PS3Stack Voting System. This service handles all election-related operations including election creation, candidate management, voting processes, and result tabulation.

## 🎯 Purpose

The Election Service provides:

- **Election Management** - Create, update, and manage elections
- **Candidate Administration** - Register and manage election candidates
- **Voting Operations** - Handle vote casting and validation
- **Result Processing** - Real-time vote counting and result compilation
- **Data Integrity** - Ensure election data accuracy and security

## 🏗️ Architecture

```
Client → API Gateway → Election Service (Port 8082)
                           ↓
                    Election Management
                           ↓
                    Candidate Management
                           ↓
                    Voting Operations
                           ↓
                    Result Processing
```

## 🚀 Getting Started

### Prerequisites

- Ballerina Swan Lake Update 8 or later
- Database connectivity for persistent storage
- Authentication service for user validation

### Configuration

1. **Copy Configuration Template**:

   ```bash
   cp Config.toml.example Config.toml
   ```

2. **Update Configuration**:

   ```toml
   HTTP_PORT = 8082
   DATABASE_URL = "jdbc:mysql://localhost:3306/election_db"
   DATABASE_USER = "election_user"
   DATABASE_PASSWORD = "your_password"
   ```

### Running the Service

```bash
# Start the Election Service
bal run

# Check service health
curl http://localhost:8082/health
```

## 📋 API Endpoints

### Election Management

#### List All Elections

```http
GET /elections
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "elections": [
    {
      "id": 1,
      "title": "Presidential Election 2024",
      "description": "National presidential election",
      "start_date": "2024-11-05T08:00:00Z",
      "end_date": "2024-11-05T20:00:00Z",
      "status": "upcoming",
      "created_by": 1,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Get Election Details

```http
GET /elections/{id}
Authorization: Bearer <jwt_token>
```

#### Create New Election

```http
POST /elections
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Municipal Election 2024",
  "description": "Local municipal election for city council",
  "start_date": "2024-06-15T08:00:00Z",
  "end_date": "2024-06-15T20:00:00Z"
}
```

**Permission Required:** Admin only

#### Update Election

```http
PUT /elections/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Election Title",
  "description": "Updated description",
  "start_date": "2024-06-20T08:00:00Z",
  "end_date": "2024-06-20T20:00:00Z"
}
```

**Permission Required:** Admin only

#### Delete Election

```http
DELETE /elections/{id}
Authorization: Bearer <jwt_token>
```

**Permission Required:** Admin only

### Candidate Management

#### Get Election Candidates

```http
GET /elections/{electionId}/candidates
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Smith",
      "party": "Democratic Party",
      "bio": "Experienced politician with 10 years in public service",
      "election_id": 1,
      "registration_date": "2024-02-01T10:00:00Z"
    }
  ]
}
```

#### Add Candidate

```http
POST /elections/{electionId}/candidates
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "party": "Independent",
  "bio": "Community leader and advocate for change",
  "platform": "Education reform and economic development"
}
```

**Permission Required:** Admin or Observer

#### Update Candidate

```http
PUT /candidates/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Jane Doe Smith",
  "party": "Independent Party",
  "bio": "Updated biography",
  "platform": "Updated platform"
}
```

**Permission Required:** Admin or Observer

#### Delete Candidate

```http
DELETE /candidates/{id}
Authorization: Bearer <jwt_token>
```

**Permission Required:** Admin only

### Voting Operations

#### Cast Vote

```http
POST /vote
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "election_id": 1,
  "candidate_id": 2,
  "voter_id": "12345",
  "polling_station": "Station A-1"
}
```

**Response:**

```json
{
  "message": "Vote cast successfully",
  "vote_id": "abc123xyz",
  "timestamp": "2024-11-05T14:30:00Z",
  "confirmation": true
}
```

#### Get Voting Status

```http
GET /elections/{electionId}/voting-status
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "election_id": 1,
  "total_registered_voters": 50000,
  "votes_cast": 12500,
  "turnout_percentage": 25.0,
  "polling_stations_reporting": 15,
  "total_polling_stations": 20
}
```

### Results Management

#### Get Election Results

```http
GET /elections/{electionId}/results
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "election_id": 1,
  "status": "completed",
  "total_votes": 12500,
  "results": [
    {
      "candidate_id": 1,
      "candidate_name": "John Smith",
      "votes": 6500,
      "percentage": 52.0
    },
    {
      "candidate_id": 2,
      "candidate_name": "Jane Doe",
      "votes": 6000,
      "percentage": 48.0
    }
  ],
  "last_updated": "2024-11-05T21:00:00Z"
}
```

#### Get Real-time Results

```http
GET /elections/{electionId}/results/live
Authorization: Bearer <jwt_token>
```

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "service": "PS3Stack Election Service",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": 1693123456,
  "database_status": "connected",
  "active_elections": 3
}
```

## 🗳️ Election Lifecycle

### Election States

1. **Draft** - Election created but not published
2. **Upcoming** - Election scheduled but not started
3. **Active** - Election currently in progress
4. **Completed** - Election finished, results available
5. **Cancelled** - Election cancelled before completion

### State Transitions

```
Draft → Upcoming → Active → Completed
  ↓        ↓         ↓
Cancelled ← ─ ← ─ ← ─
```

### Voting Process

1. **Voter Authentication** - Verify voter eligibility
2. **Ballot Generation** - Create voter-specific ballot
3. **Vote Recording** - Securely record vote choice
4. **Vote Validation** - Ensure vote integrity
5. **Result Aggregation** - Add to election totals

## 🛡️ Security Features

### Vote Integrity

- **Ballot Serialization** - Unique vote identifiers
- **Double Voting Prevention** - One vote per voter per election
- **Vote Verification** - Cryptographic vote validation
- **Audit Trail** - Comprehensive voting logs

### Data Protection

- **Encryption** - Sensitive data encryption at rest and in transit
- **Access Control** - Role-based data access
- **Anonymization** - Voter privacy protection
- **Backup & Recovery** - Regular data backups

## 🔧 Configuration

### Config.toml Structure

```toml
# Server Configuration
HTTP_PORT = 8082

# Database Configuration
DATABASE_URL = "jdbc:mysql://localhost:3306/election_db"
DATABASE_USER = "election_user"
DATABASE_PASSWORD = "secure_password"
CONNECTION_POOL_SIZE = 10

# Election Configuration
MAX_ELECTIONS_PER_ADMIN = 10
VOTE_VALIDATION_ENABLED = true
REAL_TIME_RESULTS = true

# Security Configuration
ENABLE_VOTE_ENCRYPTION = true
AUDIT_LOGGING = true
```

## 🧪 Testing

### Election Management Testing

```bash
# Create Election
curl -X POST http://localhost:8082/elections \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Election",
    "description": "Test election for API validation",
    "start_date": "2024-12-01T08:00:00Z",
    "end_date": "2024-12-01T20:00:00Z"
  }'

# Get All Elections
curl -X GET http://localhost:8082/elections \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add Candidate
curl -X POST http://localhost:8082/elections/1/candidates \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Candidate",
    "party": "Test Party",
    "bio": "Test candidate biography"
  }'

# Cast Vote
curl -X POST http://localhost:8082/vote \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "election_id": 1,
    "candidate_id": 1,
    "voter_id": "test-voter-123"
  }'

# Get Results
curl -X GET http://localhost:8082/elections/1/results \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Data Models

### Election Model

```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "start_date": "datetime",
  "end_date": "datetime",
  "status": "enum[draft,upcoming,active,completed,cancelled]",
  "created_by": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Candidate Model

```json
{
  "id": "integer",
  "name": "string",
  "party": "string",
  "bio": "string",
  "platform": "string",
  "election_id": "integer",
  "registration_date": "datetime"
}
```

### Vote Model

```json
{
  "id": "string",
  "election_id": "integer",
  "candidate_id": "integer",
  "voter_id": "string",
  "cast_at": "datetime",
  "polling_station": "string",
  "verification_hash": "string"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Election Not Found (404)**
   - Verify election ID exists
   - Check user permissions for election access
   - Ensure election hasn't been deleted

2. **Vote Casting Failed (400)**
   - Check if election is active
   - Verify voter hasn't already voted
   - Ensure candidate belongs to election

3. **Permission Denied (403)**
   - Verify user role permissions
   - Check if user has access to specific election
   - Ensure valid authentication token

4. **Database Connection Issues**
   - Verify database service is running
   - Check connection credentials
   - Ensure database schema is properly set up

## 📝 Development

### Project Structure

```
election_service/
├── Ballerina.toml          # Project configuration
├── Config.toml.example     # Configuration template
├── Dependencies.toml       # Dependencies
├── main.bal               # Main service implementation
└── modules/
    ├── election/          # Election management logic
    ├── candidates/        # Candidate management
    ├── voting/           # Vote processing
    ├── results/          # Result calculation
    └── database/         # Database operations
```

### Adding New Features

1. **Define Data Model** - Create appropriate data structures
2. **Implement Database Operations** - Add CRUD operations
3. **Create API Endpoints** - Define HTTP endpoints
4. **Add Authorization** - Implement role-based access
5. **Update Documentation** - Document new features

## 🚢 Deployment

### Docker Deployment

```dockerfile
FROM ballerina/ballerina:swan-lake-latest

COPY . /home/ballerina/
WORKDIR /home/ballerina/

RUN bal build
EXPOSE 8082

CMD ["bal", "run", "target/bin/election_service.jar"]
```

### Database Setup

```sql
CREATE DATABASE election_db;
CREATE USER 'election_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON election_db.* TO 'election_user'@'localhost';

USE election_db;

CREATE TABLE elections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('draft', 'upcoming', 'active', 'completed', 'cancelled') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    party VARCHAR(255),
    bio TEXT,
    platform TEXT,
    election_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE
);

CREATE TABLE votes (
    id VARCHAR(255) PRIMARY KEY,
    election_id INT NOT NULL,
    candidate_id INT NOT NULL,
    voter_id VARCHAR(255) NOT NULL,
    cast_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    polling_station VARCHAR(255),
    verification_hash VARCHAR(255),
    FOREIGN KEY (election_id) REFERENCES elections(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    UNIQUE KEY unique_voter_election (voter_id, election_id)
);
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
