# Auth Service

The central authentication and authorization service for the PS3Stack Voting System. This service handles user authentication, role management, and JWT token generation for all system users.

## 🎯 Purpose

The Auth Service provides:

- **Multi-Role Authentication** - Support for Admin, Observer, Field Staff, and Polling Staff roles
- **JWT Token Management** - Secure token generation and validation
- **Session Management** - User login/logout functionality
- **Role-Based Authorization** - User role and permission management
- **Security Layer** - First line of defense for the entire system

## 🏗️ Architecture

```
Client → API Gateway → Auth Service (Port 8085)
                           ↓
                    User Authentication
                           ↓
                    JWT Token Generation
                           ↓
                    Role-Based Authorization
```

## 🚀 Getting Started

### Prerequisites

- Ballerina Swan Lake Update 8 or later
- Network access for JWT token operations

### Configuration

1. **Copy Configuration Template**:
   ```bash
   cp Config.toml.example Config.toml
   ```

2. **Update Configuration**:
   ```toml
   HTTP_PORT = 8085
   JWT_SECRET = "your-secure-jwt-secret-key"
   TOKEN_EXPIRY_HOURS = 24
   ```

### Running the Service

```bash
# Start the Auth Service
bal run

# Check service health
curl http://localhost:8085/health
```

## 👥 User Roles & Demo Accounts

The system supports four distinct user roles with demo accounts for testing:

### 1. Admin (Role ID: 1)
**Demo Account**: `admin@test.com` / `password123`
- Full system administration
- Create/edit/delete elections
- Manage all user roles
- Access all system features
- System configuration

### 2. Observer (Role ID: 2)
**Demo Account**: `observer@test.com` / `password123`
- Election monitoring and oversight
- Candidate management
- Voter registration oversight
- Results observation
- Report generation

### 3. Field Staff (Role ID: 3)
**Demo Account**: `fieldstaff@test.com` / `password123`
- Field operations management
- Voter registration
- Polling station setup
- Equipment management
- Data collection

### 4. Polling Staff (Role ID: 4)
**Demo Account**: `pollingstaff@test.com` / `password123`
- Voter check-in operations
- Polling station operations
- Vote casting assistance
- Station monitoring
- Incident reporting

## 📋 API Endpoints

### Authentication Endpoints

#### Admin Login
```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password123",
  "role_id": 1
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "admin@test.com",
    "role_id": 1,
    "role_name": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Observer Login
```http
POST /auth/observer/login
Content-Type: application/json

{
  "email": "observer@test.com",
  "password": "password123",
  "role_id": 2
}
```

#### Field Staff Login
```http
POST /auth/field_staff/login
Content-Type: application/json

{
  "email": "fieldstaff@test.com",
  "password": "password123",
  "role_id": 3
}
```

#### Polling Staff Login
```http
POST /auth/polling_staff/login
Content-Type: application/json

{
  "email": "pollingstaff@test.com",
  "password": "password123",
  "role_id": 4
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "service": "PS3Stack Auth Service",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": 1693123456,
  "uptime": "2h 15m 30s"
}
```

## 🔐 JWT Token Structure

### Token Format
The service generates JWT tokens with the following structure:

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "user_id": 1,
  "email": "admin@test.com",
  "role_id": 1,
  "role_name": "Admin",
  "iat": 1693123456,
  "exp": 1693209856
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Token Claims

| Claim | Type | Description |
|-------|------|-------------|
| `user_id` | int | Unique user identifier |
| `email` | string | User email address |
| `role_id` | int | User role identifier (1-4) |
| `role_name` | string | Human-readable role name |
| `iat` | int | Token issued at timestamp |
| `exp` | int | Token expiration timestamp |

## 🛡️ Security Features

### Password Security
- **Hashing**: Passwords are hashed using secure algorithms
- **Validation**: Strong password requirements enforced
- **Demo Accounts**: Pre-configured for testing purposes

### Token Security
- **JWT Standard**: Industry-standard JSON Web Tokens
- **Expiration**: Configurable token expiry times
- **Secret Key**: Secure HMAC signing with configurable secret
- **Claims Validation**: Comprehensive payload validation

### Authentication Flow
1. **Credential Validation**: Email and password verification
2. **Role Verification**: Role ID validation against user record
3. **Token Generation**: JWT creation with user claims
4. **Response**: Secure token delivery to client

## 🔧 Configuration

### Config.toml Structure

```toml
# Server Configuration
HTTP_PORT = 8085

# JWT Configuration
JWT_SECRET = "your-secure-jwt-secret-key-minimum-32-characters"
TOKEN_EXPIRY_HOURS = 24

# Security Configuration
ENABLE_CORS = true
ALLOWED_ORIGINS = ["http://localhost:3000"]
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 30
```

### Environment Variables

```bash
export HTTP_PORT=8085
export JWT_SECRET="your-secure-jwt-secret-key"
export TOKEN_EXPIRY_HOURS=24
```

## 🧪 Testing

### Authentication Testing

```bash
# Test Admin Login
curl -X POST http://localhost:8085/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "role_id": 1
  }'

# Test Observer Login
curl -X POST http://localhost:8085/auth/observer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "observer@test.com", 
    "password": "password123",
    "role_id": 2
  }'

# Test Field Staff Login
curl -X POST http://localhost:8085/auth/field_staff/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fieldstaff@test.com",
    "password": "password123", 
    "role_id": 3
  }'

# Test Polling Staff Login
curl -X POST http://localhost:8085/auth/polling_staff/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pollingstaff@test.com",
    "password": "password123",
    "role_id": 4
  }'

# Test Logout
curl -X POST http://localhost:8085/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Health Check
curl http://localhost:8085/health
```

## 🐛 Troubleshooting

### Common Issues

1. **Login Failed (401)**
   - Verify email and password combination
   - Check role_id matches user's actual role
   - Ensure demo accounts are properly configured

2. **Token Validation Failed**
   - Check JWT secret configuration
   - Verify token hasn't expired
   - Ensure token format is correct

3. **Service Unavailable (503)**
   - Check if auth service is running on port 8085
   - Verify network connectivity
   - Check service logs for errors

4. **Invalid Role (403)**
   - Verify role_id in login request
   - Check user's assigned role in demo data
   - Ensure role permissions are correctly configured

### Debug Information

Enable detailed logging for troubleshooting:

```toml
[observability]
metrics.enabled = true
logs.level = "DEBUG"
```

## 📊 Monitoring

### Health Metrics
- Service uptime and status
- Authentication success/failure rates
- Token generation statistics
- Active user sessions

### Security Monitoring
- Failed login attempts
- Suspicious authentication patterns
- Token usage analytics
- Role-based access patterns

## 📝 Development

### Project Structure

```
auth_service/
├── Ballerina.toml          # Project configuration
├── Config.toml.example     # Configuration template
├── Dependencies.toml       # Dependencies
├── main.bal               # Main service implementation
└── modules/
    ├── auth/              # Authentication logic
    ├── jwt/               # JWT token management
    ├── users/             # User management
    └── security/          # Security utilities
```

### Adding New User Roles

1. **Define Role**: Add new role constants
2. **Update Login Endpoints**: Create role-specific login endpoint
3. **Demo Data**: Add demo account for new role
4. **Documentation**: Update role documentation

### Token Customization

```ballerina
// Example: Adding custom claims to JWT
public function generateToken(User user) returns string|error {
    jwt:Header header = {alg: jwt:HS256, typ: "JWT"};
    
    jwt:Payload payload = {
        user_id: user.id,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
        // Custom claims
        permissions: getUserPermissions(user.role_id),
        department: user.department,
        iat: time:utcNow(),
        exp: time:utcNow() + (TOKEN_EXPIRY_HOURS * 3600)
    };
    
    return jwt:issue(payload, config.jwtSecret);
}
```

## 🚢 Deployment

### Docker Deployment

```dockerfile
FROM ballerina/ballerina:swan-lake-latest

COPY . /home/ballerina/
WORKDIR /home/ballerina/

RUN bal build
EXPOSE 8085

CMD ["bal", "run", "target/bin/auth_service.jar"]
```

### Production Configuration

```toml
# Production Config.toml
HTTP_PORT = 8085
JWT_SECRET = "${JWT_SECRET_ENV}"  # Use environment variable
TOKEN_EXPIRY_HOURS = 8             # Shorter expiry for production
ENABLE_RATE_LIMITING = true
MAX_REQUESTS_PER_MINUTE = 100
```

## 🔐 Security Best Practices

### JWT Secret Management
- Use environment variables for secrets
- Rotate secrets periodically
- Use minimum 32-character secrets
- Never commit secrets to version control

### Production Security
- Enable HTTPS for all communications
- Implement rate limiting
- Monitor for brute force attacks
- Regular security audits
- Secure logging practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
