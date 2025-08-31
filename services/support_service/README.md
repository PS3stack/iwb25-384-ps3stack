# Support Service

The AI-powered support and assistance service for the PS3Stack Voting System. This service provides intelligent chatbot functionality, help desk operations, and user assistance across all system components.

## 🎯 Purpose

The Support Service provides:

- **AI Chatbot** - Intelligent conversational assistance using OpenAI
- **User Help** - Context-aware support for all system users
- **Issue Resolution** - Automated problem-solving and guidance
- **Documentation Access** - Dynamic help content and FAQs
- **Multilingual Support** - Multi-language assistance capabilities

## 🏗️ Architecture

```
Client → API Gateway → Support Service (Port 8083)
                           ↓
                    OpenAI Integration
                           ↓
                    Context Processing
                           ↓
                    Response Generation
                           ↓
                    User Assistance
```

## 🚀 Getting Started

### Prerequisites

- Ballerina Swan Lake Update 8 or later
- **OpenAI API Key** (Required for chatbot functionality)
- Network access for OpenAI API calls
- Authentication service integration

### ⚠️ Important: API Key Configuration

**The Support Service requires an OpenAI API key to function properly.** Without this key, the chatbot will not work.

#### How to Obtain an OpenAI API Key:

1. **Visit OpenAI Platform**: Go to [https://platform.openai.com](https://platform.openai.com)
2. **Create Account**: Sign up for an OpenAI account if you don't have one
3. **Access API Keys**: Navigate to the API Keys section in your dashboard
4. **Generate Key**: Create a new API key for your project
5. **Secure Storage**: Store the key securely and never commit it to version control

#### API Key Setup:

1. **Copy Configuration Template**:

   ```bash
   cp Config.toml.example Config.toml
   ```

2. **Add Your OpenAI API Key**:

   ```toml
   HTTP_PORT = 8083
   
   # OpenAI Configuration (REQUIRED)
   OPENAI_API_KEY = "sk-your-actual-openai-api-key-here"
   OPENAI_MODEL = "gpt-3.5-turbo"
   OPENAI_MAX_TOKENS = 500
   OPENAI_TEMPERATURE = 0.7
   ```

3. **Alternative: Environment Variable**:

   ```bash
   export OPENAI_API_KEY="sk-your-actual-openai-api-key-here"
   ```

### Running the Service

```bash
# Ensure your OpenAI API key is configured
# Start the Support Service
bal run

# Check service health
curl http://localhost:8083/health
```

## 📋 API Endpoints

### Chat Support

#### Send Chat Message

```http
POST /support/chat
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "How do I check in a voter at the polling station?",
  "context": {
    "user_role": "polling_staff",
    "current_page": "voter_checkin",
    "election_id": 1
  }
}
```

**Response:**

```json
{
  "reply": "To check in a voter at the polling station:\n\n1. Verify the voter's identity using their ID\n2. Look up the voter in the system using their voter ID\n3. Confirm they are registered for this election\n4. Click 'Check In Voter' and scan their ID or enter voter ID manually\n5. Issue them a ballot once check-in is confirmed\n6. The system will prevent double voting automatically\n\nIs there a specific issue you're encountering with voter check-in?",
  "context": {
    "response_type": "instruction",
    "related_topics": ["voter_management", "polling_operations"],
    "confidence": 0.95
  },
  "timestamp": "2024-12-17T10:30:00Z"
}
```

#### Get Chat History

```http
GET /support/chat/history
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "conversations": [
    {
      "id": "conv-123",
      "started_at": "2024-12-17T10:00:00Z",
      "messages": [
        {
          "type": "user",
          "message": "How do I add a new candidate?",
          "timestamp": "2024-12-17T10:00:00Z"
        },
        {
          "type": "assistant",
          "message": "To add a new candidate, navigate to the Elections page...",
          "timestamp": "2024-12-17T10:00:15Z"
        }
      ]
    }
  ]
}
```

### Help Content

#### Get Contextual Help

```http
GET /support/help/{topic}
Authorization: Bearer <jwt_token>
```

Examples:
- `/support/help/voting` - Voting process help
- `/support/help/candidates` - Candidate management help
- `/support/help/elections` - Election administration help

**Response:**

```json
{
  "topic": "voting",
  "title": "Voting Process Guide",
  "content": "Step-by-step guide for the voting process...",
  "related_topics": ["voter_checkin", "ballot_creation"],
  "last_updated": "2024-12-17T08:00:00Z"
}
```

#### Search Help Content

```http
GET /support/search?q=voter+registration
Authorization: Bearer <jwt_token>
```

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "service": "PS3Stack Support Service",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": 1693123456,
  "openai_status": "connected",
  "api_key_configured": true,
  "chat_sessions_active": 5
}
```

## 🤖 AI Chatbot Features

### OpenAI Integration

The chatbot uses OpenAI's GPT models to provide intelligent assistance:

- **Model**: GPT-3.5-turbo (configurable)
- **Context Awareness**: Understands user roles and current system context
- **Response Quality**: High-quality, relevant responses
- **Multilingual**: Supports multiple languages

### Context-Aware Responses

The chatbot understands:

- **User Role** - Tailors responses based on Admin, Observer, Field Staff, or Polling Staff roles
- **Current Page** - Provides relevant help based on what the user is viewing
- **Election Context** - Considers current election information
- **System State** - Aware of system status and current operations

### Supported Topics

#### For Admins
- Election creation and management
- User role administration
- System configuration
- Data management and reports
- Security settings

#### For Observers
- Candidate management
- Election monitoring
- Voter oversight
- Result observation
- Reporting processes

#### For Field Staff
- Voter registration
- Field operations
- Equipment setup
- Data collection
- Area management

#### For Polling Staff
- Voter check-in procedures
- Ballot issuance
- Polling station operations
- Incident reporting
- Vote processing

## 🔧 Configuration

### Config.toml Structure

```toml
# Server Configuration
HTTP_PORT = 8083

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY = "sk-your-openai-api-key-here"
OPENAI_MODEL = "gpt-3.5-turbo"
OPENAI_MAX_TOKENS = 500
OPENAI_TEMPERATURE = 0.7
OPENAI_TIMEOUT = 30

# Chat Configuration
MAX_CHAT_HISTORY = 50
CONVERSATION_TIMEOUT_MINUTES = 30
ENABLE_CHAT_LOGGING = true

# Content Configuration
HELP_CONTENT_CACHE_TTL = 3600
ENABLE_SEARCH_INDEXING = true

# Security Configuration
RATE_LIMIT_REQUESTS_PER_MINUTE = 60
ENABLE_CONTENT_FILTERING = true
```

### Environment Variables

```bash
# Essential configuration
export OPENAI_API_KEY="sk-your-openai-api-key-here"
export HTTP_PORT=8083

# Optional configuration
export OPENAI_MODEL="gpt-3.5-turbo"
export OPENAI_MAX_TOKENS=500
export OPENAI_TEMPERATURE=0.7
```

## 🧪 Testing

### Chat Testing

```bash
# Test Basic Chat
curl -X POST http://localhost:8083/support/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I create a new election?",
    "context": {
      "user_role": "admin",
      "current_page": "elections"
    }
  }'

# Test Role-Specific Help
curl -X POST http://localhost:8083/support/chat \
  -H "Authorization: Bearer YOUR_POLLING_STAFF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What should I do if a voter lost their ID?",
    "context": {
      "user_role": "polling_staff",
      "current_page": "voter_checkin"
    }
  }'

# Test Help Content
curl -X GET http://localhost:8083/support/help/voting \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search Help
curl -X GET "http://localhost:8083/support/search?q=candidate+registration" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Health Check
curl http://localhost:8083/health
```

### OpenAI API Testing

```bash
# Test OpenAI connectivity
curl -X POST http://localhost:8083/support/debug/openai-test \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "test_message": "Hello, this is a test message."
  }'
```

## 📊 Chat Analytics

### Usage Metrics

The service tracks:

- **Total chat sessions** - Number of conversations
- **Messages per session** - Average interaction length
- **Response time** - AI response performance
- **User satisfaction** - Based on interaction patterns
- **Popular topics** - Most frequently asked questions

### Performance Monitoring

- **OpenAI API latency** - Response time monitoring
- **Token usage** - API cost tracking
- **Error rates** - Failed request monitoring
- **Rate limiting** - Request throttling statistics

## 🛡️ Security Features

### API Key Security

- **Environment Variables** - Secure key storage
- **No Logging** - API keys never logged
- **Encryption** - Encrypted key transmission
- **Rotation Support** - Easy key rotation

### Content Filtering

- **Input Validation** - Malicious input prevention
- **Response Filtering** - Inappropriate content blocking
- **Rate Limiting** - Abuse prevention
- **Context Validation** - Proper context enforcement

### Privacy Protection

- **No Personal Data** - No PII sent to OpenAI
- **Anonymized Logs** - Privacy-preserving logging
- **Session Isolation** - Secure conversation boundaries
- **Data Retention** - Configurable chat history retention

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Key Not Configured (500)**
   ```
   Error: OpenAI API key is not configured
   ```
   **Solution**: Add your OpenAI API key to Config.toml or environment variables

2. **OpenAI API Call Failed (503)**
   ```
   Error: Failed to connect to OpenAI API
   ```
   **Solutions**:
   - Verify API key is valid and active
   - Check internet connectivity
   - Ensure OpenAI service is available
   - Verify API quota/billing status

3. **Rate Limit Exceeded (429)**
   ```
   Error: Too many requests to OpenAI API
   ```
   **Solutions**:
   - Wait for rate limit reset
   - Upgrade OpenAI plan for higher limits
   - Implement request throttling

4. **Invalid Chat Context (400)**
   ```
   Error: Invalid user context provided
   ```
   **Solutions**:
   - Ensure user_role is valid
   - Check current_page context
   - Verify authentication token

### Debug Commands

```bash
# Check OpenAI configuration
curl -X GET http://localhost:8083/support/debug/config \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Test OpenAI connectivity
curl -X POST http://localhost:8083/support/debug/openai-ping \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# View service metrics
curl -X GET http://localhost:8083/support/metrics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📝 Development

### Project Structure

```
support_service/
├── Ballerina.toml          # Project configuration
├── Config.toml.example     # Configuration template
├── Dependencies.toml       # Dependencies
├── main.bal               # Main service implementation
└── modules/
    ├── support/           # Support service logic
    ├── chat/              # Chat processing
    ├── openai/            # OpenAI integration
    ├── content/           # Help content management
    └── analytics/         # Usage analytics
```

### Adding New Features

1. **Define Chat Flows** - Create conversation patterns
2. **Implement Context Handlers** - Add context processing
3. **Create Help Content** - Add documentation content
4. **Add API Endpoints** - Define new service endpoints
5. **Update Documentation** - Document new capabilities

### Custom Prompts

```ballerina
// Example: Custom prompt for specific context
public function generateContextPrompt(string userRole, string currentPage) returns string {
    string basePrompt = "You are a helpful assistant for the PS3Stack Voting System.";
    
    if (userRole == "admin") {
        basePrompt += " You are helping a system administrator.";
    } else if (userRole == "polling_staff") {
        basePrompt += " You are helping polling station staff.";
    }
    
    if (currentPage == "voter_checkin") {
        basePrompt += " The user is currently on the voter check-in page.";
    }
    
    return basePrompt + " Provide clear, actionable guidance.";
}
```

## 🚢 Deployment

### Docker Deployment

```dockerfile
FROM ballerina/ballerina:swan-lake-latest

COPY . /home/ballerina/
WORKDIR /home/ballerina/

# Build application
RUN bal build

# Expose port
EXPOSE 8083

# Set environment variable for API key
ENV OPENAI_API_KEY=""

CMD ["bal", "run", "target/bin/support_service.jar"]
```

### Production Configuration

```toml
# Production Config.toml
HTTP_PORT = 8083

# OpenAI Configuration - Use environment variables
OPENAI_API_KEY = "${OPENAI_API_KEY}"
OPENAI_MODEL = "gpt-3.5-turbo"
OPENAI_MAX_TOKENS = 300  # Lower for cost control
OPENAI_TEMPERATURE = 0.5  # More deterministic responses

# Rate limiting for production
RATE_LIMIT_REQUESTS_PER_MINUTE = 30
MAX_CHAT_HISTORY = 20

# Security
ENABLE_CONTENT_FILTERING = true
ENABLE_AUDIT_LOGGING = true
```

### Environment Setup

```bash
# Production environment variables
export OPENAI_API_KEY="your-production-api-key"
export HTTP_PORT=8083
export OPENAI_MODEL="gpt-3.5-turbo"
export RATE_LIMIT_REQUESTS_PER_MINUTE=30
```

## 💰 Cost Management

### OpenAI Usage Optimization

- **Token Limits** - Configure max tokens per request
- **Response Caching** - Cache common responses
- **Request Batching** - Optimize API calls
- **Model Selection** - Use appropriate model for needs

### Cost Monitoring

- Track token usage per conversation
- Monitor API costs in OpenAI dashboard
- Set up usage alerts and limits
- Regular cost analysis and optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
