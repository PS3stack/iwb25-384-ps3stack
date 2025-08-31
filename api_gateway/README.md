# PS3Stack API Gateway

## Overview
The API Gateway serves as the central entry point for all client requests to the PS3Stack Voting System. It provides a unified interface with authentication, authorization, request routing, and health monitoring capabilities.

## Architecture

### Modular Structure
The API Gateway follows a clean, modular architecture with separation of concerns:

```
api_gateway/
├── main.bal                    # Main service endpoints and startup logic
├── config.toml                 # Configuration file
├── modules/
│   ├── gateway/                # Core gateway functionality
│   │   ├── config.bal         # Configuration management
│   │   ├── types.bal          # Type definitions
│   │   └── utils.bal          # Utility functions
│   ├── auth/                   # Authentication and authorization
│   │   └── auth_handler.bal   # JWT validation and role checking
│   ├── routing/                # Request routing
│   │   └── router.bal         # Service routing logic
│   └── health/                 # Health monitoring
│       └── monitor.bal        # Service health checks
└── README.md                   # This documentation
```

### Core Components
- **Gateway Module**: Configuration management, type definitions, and utilities
- **Authentication Module**: JWT token validation and role-based access control
- **Routing Module**: Smart request forwarding to backend services
- **Health Module**: Real-time monitoring of backend service status
- **Main Service**: HTTP endpoints and service orchestration

## Configuration

### Service Ports
- **API Gateway**: `8080`
- **Auth Service**: `8085`
- **Election Service**: `8082`
- **Voter Service**: `8084`
- **Support Service**: `8083`
- **Census Service**: `8081`

### Environment Configuration
Update `config.toml` with your environment-specific settings:

```toml
HTTP_PORT = 8080

# Backend service URLs
authServiceUrl = "http://localhost:8085"
electionServiceUrl = "http://localhost:8082"
voterServiceUrl = "http://localhost:8084"
supportServiceUrl = "http://localhost:8083"
censusServiceUrl = "http://localhost:8081"
```

## Security Model

### Role-Based Access Control
The gateway implements a comprehensive RBAC system:

| Role | ID | Permissions |
|------|----|-----------| 
| Admin | 1 | Full system access, all CRUD operations |
| Observer | 2 | Election monitoring, candidate/voter management |
| Field Staff | 3 | Field operations access |
| Polling Staff | 4 | Voter check-in, polling station operations |

### Authentication Flow
1. **Login**: Client authenticates via `/api/auth/{role}/login`
2. **Token Generation**: Auth service issues JWT token
3. **Cookie Storage**: Gateway sets secure HTTP-only cookie
4. **Request Validation**: Each request validates token and role
5. **Authorization**: Endpoint-level permission checking

## API Endpoints

### Public Endpoints (No Authentication)
```
GET  /                           # API information and status
GET  /health                     # System health check
POST /api/auth/admin/login       # Administrator login
POST /api/auth/observer/login    # Observer login
POST /api/auth/polling_staff/login # Polling staff login
POST /api/auth/logout            # User logout
```

### Election Management (Authenticated)
```
GET    /api/elections            # List all elections
GET    /api/elections/{id}       # Get specific election
POST   /api/elections            # Create election (Admin only)
PUT    /api/elections/{id}       # Update election (Admin only)
DELETE /api/elections/{id}       # Delete election (Admin only)
```

### Candidate Management
```
GET    /api/elections/{electionId}/candidates # Get election candidates
POST   /api/elections/{electionId}/candidates # Add candidate (Admin/Observer)
PUT    /api/candidates/{id}                   # Update candidate (Admin/Observer)
DELETE /api/candidates/{id}                   # Delete candidate (Admin only)
```

### Voter Operations
```
POST /api/elections/{electionId}/voters/{voterId}/check-in # Check-in (Polling Staff/Admin)
POST /api/voters/cast                                      # Cast vote (Authenticated)
POST /api/elections/{electionId}/voters/upload            # Add voter (Admin/Observer)
```

### Areas and Devices
```
POST /api/areas                              # Create area (Admin only)
POST /api/areas/{areaId}/devices/upload     # Upload device (Admin/Observer)
```

### Qualifications
```
GET  /api/qualifications                     # List qualifications (Authenticated)
POST /api/qualifications                     # Create qualification (Admin only)
POST /api/candidates/{candidateId}/qualifications # Assign qualification (Admin/Observer)
```

### Observer Management
```
POST /api/elections/{electionId}/observers  # Add observer (Admin only)
```

### Support Services
```
POST /api/support/chat                       # Chat support (Authenticated)
```

### Census Services
```
GET /api/census                              # Access census (Admin only)
```

## Development Guide

### Building and Running
```bash
# Navigate to API Gateway directory
cd api_gateway

# Build the project
bal build

# Run the service
bal run
```

### Adding New Endpoints
1. **Define Route**: Add endpoint in `main.bal` service
2. **Add Authentication**: Choose appropriate auth check
3. **Implement Routing**: Use routing module functions
4. **Update Documentation**: Document the new endpoint

### Adding New Modules
1. **Create Module Directory**: `modules/{module_name}/`
2. **Add Module Files**: Create `.bal` files with functions
3. **Import in Main**: Add import statement in `main.bal`
4. **Update Dependencies**: Reference in other modules as needed

### Custom Authorization
```ballerina
// Example: Adding custom role check
resource function post api/custom/endpoint(http:Request req) returns http:Response|error {
    // Custom authorization logic
    gateway:AuthError? authError = auth:checkCustomRole(req);
    if authError is gateway:AuthError {
        return gateway:createErrorResponse(authError.statusCode, authError.message);
    }
    
    // Forward to service
    return routing:forwardToCustomService("POST", "/custom/path", (), req);
}
```

## Monitoring and Health

### Health Check Endpoint
```
GET /health
```

Returns comprehensive health status:
```json
{
  "overall_status": "healthy",
  "healthy_services": 5,
  "total_services": 5,
  "services": {
    "auth": {"name": "Authentication Service", "status": "healthy"},
    "election": {"name": "Election Service", "status": "healthy"},
    "voter": {"name": "Voter Service", "status": "healthy"},
    "support": {"name": "Support Service", "status": "healthy"},
    "census": {"name": "Census Service", "status": "healthy"}
  },
  "gateway": {
    "name": "PS3Stack API Gateway",
    "version": "1.0.0",
    "status": "healthy"
  }
}
```

### Startup Health Check
The gateway performs health checks on all backend services during startup and logs the results.

## Error Handling

### Standardized Error Responses
All errors follow a consistent format:
```json
{
  "error": true,
  "message": "Error description",
  "statusCode": 400,
  "timestamp": 1734385200
}
```

### Common HTTP Status Codes
- `200 OK`: Successful operation
- `201 Created`: Resource created successfully  
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Backend service error
- `503 Service Unavailable`: Backend service unreachable

## Security Features

### JWT Token Security
- Secure HTTP-only cookies prevent XSS attacks
- Token expiration validation
- Role-based claims in token payload
- Signature validation (simplified in current implementation)

### Request Security
- Input validation at gateway level
- Header sanitization
- CORS protection
- Rate limiting (planned enhancement)

### Logging and Monitoring
- Request/response logging
- Authentication attempt tracking
- Error condition monitoring
- Service health status logging

## Production Deployment

### Environment Variables
For production deployment, ensure proper configuration:
- Use HTTPS for all service URLs
- Configure proper JWT secret keys
- Set appropriate timeout values
- Enable production logging levels

### Performance Considerations
- Connection pooling for backend services
- Request timeout configuration
- Circuit breaker pattern (planned)
- Load balancing support (planned)

### Security Checklist
- [ ] HTTPS enabled for all communications
- [ ] JWT secret keys properly secured
- [ ] Rate limiting configured
- [ ] CORS policies restricted to known origins
- [ ] Audit logging enabled
- [ ] Error messages sanitized

## Troubleshooting

### Common Issues

1. **Service Unreachable**
   - Check backend service status
   - Verify network connectivity
   - Confirm service URLs in config

2. **Authentication Failures**
   - Verify JWT token format
   - Check token expiration
   - Validate user permissions

3. **Permission Denied**
   - Confirm user role assignments
   - Check endpoint authorization requirements
   - Verify token claims

### Debug Mode
Enable detailed logging by configuring log levels in Ballerina configuration.

## Future Enhancements

### Planned Features
- [ ] Advanced JWT signature verification
- [ ] Request/response caching
- [ ] Rate limiting and throttling
- [ ] Circuit breaker pattern
- [ ] Metrics collection and monitoring
- [ ] Load balancing for backend services
- [ ] Request/response transformation
- [ ] API versioning support

### Security Improvements
- [ ] Multi-factor authentication
- [ ] Token refresh mechanism
- [ ] Advanced audit logging
- [ ] Request encryption
- [ ] IP whitelisting/blacklisting

## Contributing

When contributing to the API Gateway:

1. Follow the modular architecture
2. Maintain consistent error handling
3. Add comprehensive logging
4. Update documentation
5. Include appropriate tests
6. Follow Ballerina best practices

## Contact

For technical support or questions about the API Gateway implementation, please refer to the PS3Stack project documentation or contact the development team.
