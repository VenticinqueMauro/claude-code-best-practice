# CLAUDE.md

> Context guide for Claude Code in this project.

## Project

- **Name**: {{projectName}}
- **Type**: Node.js API
- **Description**: {{description}}
- **Repo**: {{repoUrl}}

## Stack

- **Framework**: {{framework}}
- **Language**: {{language}}
- **DB**: {{database}}
- **Auth**: {{auth}}
- **Deploy**: {{deployTarget}}
- **Package Manager**: {{packageManager}}

## Main Commands

```bash
{{pm}} run dev        # Development server with nodemon
{{pm}} run start      # Production server
{{pm}} run test       # Run tests
{{pm}} run lint       # Linting
```

## Project Structure

```
src/
├── routes/           # Route definitions
│   ├── index.js      # Route aggregator
│   ├── users.js      # User routes
│   └── auth.js       # Auth routes
├── controllers/      # Request handlers
│   ├── userController.js
│   └── authController.js
├── services/         # Business logic
│   ├── userService.js
│   └── authService.js
├── models/           # Data models/schemas
├── middleware/       # Custom middleware
│   ├── auth.js       # Auth middleware
│   ├── validate.js   # Validation middleware
│   └── errorHandler.js
├── utils/            # Helper functions
├── config/           # Configuration
│   ├── database.js
│   └── index.js
└── app.js            # Express app setup
```

## Code Conventions

- Use async/await for all async operations.
- Error handling with try/catch and centralized error handler.
- Validation middleware for all request inputs.
- Environment variables via `process.env` with validation.
- Consistent response format: `{ success, data, error, message }`.

## Architecture Pattern

```
Request → Route → Controller → Service → Repository → Database
                      ↓
              Middleware (auth, validation, logging)
```

## Project Patterns

{{customPatterns}}

- **Validation**: Zod/Joi middleware validates request body, params, query.
- **Error Handling**: Centralized `errorHandler` middleware catches all errors.
- **Auth**: JWT tokens in Authorization header, refresh token in httpOnly cookie.
- **Logging**: Winston/Pino for structured logging.

## Key Files

{{keyFiles}}

| File | Purpose |
|------|---------|
| `src/app.js` | Express app setup |
| `src/routes/index.js` | Route definitions |
| `src/config/database.js` | Database configuration |
| `src/middleware/errorHandler.js` | Error handling |
| `.env` | Environment variables (DO NOT READ) |

## Critical Rules

1. NEVER read `.env` or files in `secrets/`.
2. NEVER expose stack traces in production responses.
3. ALWAYS validate and sanitize user input.
4. ALWAYS use parameterized queries (no SQL injection).
5. Atomic commits: one logical change per commit.

## API Response Format

```javascript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input"
  }
}
```

## Dependencies

| Package | Version | Use |
|---------|---------|-----|
| express | ^4.x | Framework |
| helmet | ^7.x | Security headers |
| cors | ^2.x | CORS handling |
| joi/zod | ^x.x | Validation |

## Testing

- **Unit**: {{testFramework}} for services and utils
- **Integration**: Supertest for API endpoints
- Run: `{{pm}} run test` before PR

## RPI Workflow

For new features, use the Research → Plan → Implement flow:
1. `/rpi:research` - Analyze feasibility before coding
2. `/rpi:plan` - Break down into micro-tasks
3. `/rpi:implement` - Execute task by task with atomic commits

Plans are saved in `rpi/{feature-slug}/`.

---

## Memory

{This section updates between sessions. Claude should read this at startup.}

### Last Session
- **Date**: {{date}}
- **Feature in progress**: None
- **Status**: Initial setup
- **Next step**: Review CLAUDE.md and customize

### Recent Technical Decisions
- Initial project setup with claude-code-setup

### Known Issues
- None

---

## Skills

### Business Domain
- {Add relevant business context for understanding requirements}

### External APIs
{{externalApis}}

### Custom Patterns
- {Add project-specific patterns that Claude should know}
