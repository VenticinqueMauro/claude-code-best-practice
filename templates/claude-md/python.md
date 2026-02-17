# CLAUDE.md

> Context guide for Claude Code in this project.

## Project

- **Name**: {{projectName}}
- **Type**: Python Application
- **Description**: {{description}}
- **Repo**: {{repoUrl}}

## Stack

- **Framework**: {{framework}}
- **Language**: Python 3.11+
- **DB**: {{database}}
- **Auth**: {{auth}}
- **Deploy**: {{deployTarget}}
- **Package Manager**: {{packageManager}}

## Main Commands

```bash
# Development
{{packageManager}} run dev                    # Development server
python -m pytest                              # Run tests
python -m pytest --cov=app                    # Tests with coverage
ruff check .                                  # Linting
ruff format .                                 # Formatting
mypy .                                        # Type checking

# Dependencies (pip)
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Dependencies (poetry)
poetry install
poetry add <package>
```

## Project Structure

```
app/
├── main.py           # Application entry point
├── config.py         # Configuration settings
├── database.py       # Database connection
├── models/           # Data models (Pydantic/SQLAlchemy)
│   ├── __init__.py
│   ├── user.py
│   └── base.py
├── routers/          # API route handlers
│   ├── __init__.py
│   ├── users.py
│   └── auth.py
├── services/         # Business logic
│   ├── __init__.py
│   └── user_service.py
├── repositories/     # Data access layer
│   └── user_repo.py
├── schemas/          # Pydantic schemas (request/response)
│   └── user.py
├── utils/            # Helper functions
│   └── security.py
└── middleware/       # Custom middleware
    └── auth.py

tests/
├── conftest.py       # Pytest fixtures
├── test_users.py
└── test_auth.py
```

## Code Conventions

- Type hints everywhere, use `typing` module.
- Pydantic for data validation and serialization.
- Async functions for all I/O operations.
- Dependency injection for services and repositories.
- Environment variables via pydantic-settings.

## Architecture Pattern

```
Request → Router → Service → Repository → Database
            ↓
     Dependencies (auth, db session)
```

## Project Patterns

{{customPatterns}}

- **Validation**: Pydantic models for request/response validation
- **Error Handling**: HTTPException with appropriate status codes
- **Auth**: JWT tokens, OAuth2 password flow
- **Async**: Prefer async/await for database and HTTP operations

## Key Files

{{keyFiles}}

| File | Purpose |
|------|---------|
| `app/main.py` | Application entry |
| `app/config.py` | Settings and config |
| `app/database.py` | Database setup |
| `app/dependencies.py` | Dependency injection |
| `.env` | Environment variables (DO NOT READ) |

## Critical Rules

1. NEVER read `.env` or files in `secrets/`.
2. ALWAYS use type hints for function parameters and returns.
3. ALWAYS use Pydantic models for request/response data.
4. NEVER use raw SQL without parameterization.
5. Atomic commits: one logical change per commit.

## API Response Pattern

```python
# FastAPI example
@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    user = await user_service.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

## Dependencies

| Package | Version | Use |
|---------|---------|-----|
| fastapi | ^0.109 | Framework |
| pydantic | ^2.x | Validation |
| sqlalchemy | ^2.x | ORM |
| alembic | ^1.x | Migrations |

## Testing

- **Unit**: pytest for services and utils
- **Integration**: TestClient for API endpoints
- **Coverage**: pytest-cov for coverage reports
- Run: `python -m pytest` before PR

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
