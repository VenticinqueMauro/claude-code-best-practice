# CLAUDE.md

> Context guide for Claude Code in this project.

## Project

- **Name**: {{projectName}}
- **Description**: {{description}}
- **Repo**: {{repoUrl}}

## Stack

- **Framework**: {{framework}}
- **Language**: {{language}}
- **Package Manager**: {{packageManager}}
- **Deploy**: {{deployTarget}}

## Main Commands

```bash
{{pm}} run dev        # Development
{{pm}} run build      # Build
{{pm}} run test       # Tests
{{pm}} run lint       # Linting
```

## Project Structure

```
src/
├── ...               # Source files
tests/
├── ...               # Test files
```

## Code Conventions

- Follow existing patterns in the codebase.
- Consistent naming conventions.
- Clear, self-documenting code.
- Tests for new functionality.

## Project Patterns

{{customPatterns}}

- Document your project-specific patterns here.

## Key Files

{{keyFiles}}

| File | Purpose |
|------|---------|
| `src/index.*` | Entry point |
| `.env` | Environment variables (DO NOT READ) |

## Critical Rules

1. NEVER read `.env` or files in `secrets/`.
2. ALWAYS run tests before committing.
3. Atomic commits: one logical change per commit.
4. Manual `/compact` at 50% context.

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
