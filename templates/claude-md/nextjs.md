# CLAUDE.md

> Context guide for Claude Code in this project.

## Project

- **Name**: {{projectName}}
- **Type**: Next.js 14+ / App Router
- **Description**: {{description}}
- **Repo**: {{repoUrl}}

## Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: {{language}} (strict)
- **Styling**: {{styling}}
- **DB**: {{database}}
- **Auth**: {{auth}}
- **Deploy**: {{deployTarget}}
- **Package Manager**: {{packageManager}}

## Main Commands

```bash
{{pm}} run dev        # Development server
{{pm}} run build      # Production build
{{pm}} run lint       # Linting
{{pm}} run test       # Tests
npx tsc --noEmit      # Type-check without emit
```

## Project Structure

```
src/
├── app/              # App Router: routes, layouts, pages
│   ├── api/          # API routes
│   ├── (auth)/       # Auth route group
│   └── globals.css
├── components/       # Reusable components
│   ├── ui/           # Primitives (Button, Input, Modal)
│   └── features/     # Business components
├── lib/              # Utilities, helpers, configs
├── hooks/            # Custom hooks
├── types/            # Global types and interfaces
├── services/         # Business logic and API calls
└── constants/        # Constants and enums
```

## Code Conventions

- Server Components by default. `"use client"` only when necessary.
- Props typed with `interface`, not `type`.
- Named exports always. Default exports only for Next.js pages.
- One component per file. Filename = component name.
- Custom hooks in `hooks/` with `use` prefix.
- Absolute imports with `@/` alias from `src/`.

## Project Patterns

{{customPatterns}}

- **Data Fetching**: Server Components with direct fetch. Client-side with React Query.
- **Forms**: React Hook Form + Zod for validation.
- **Error Handling**: Error boundaries per route. Try/catch in server actions.
- **API Pattern**: Route handlers in `app/api/` return `NextResponse.json()`.

## Key Files

{{keyFiles}}

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Database connection |
| `src/lib/auth.ts` | Auth configuration |
| `src/types/index.ts` | Shared types |
| `middleware.ts` | Next.js middleware |
| `.env.local` | Environment variables (DO NOT READ) |

## Critical Rules

1. NEVER read `.env`, `.env.local` or files in `secrets/`.
2. ALWAYS run `npx tsc --noEmit` before committing.
3. ALWAYS start with a plan before implementing large changes.
4. Atomic commits: one logical change per commit.
5. Manual `/compact` at 50% context.

## Dependencies

| Package | Version | Use |
|---------|---------|-----|
| next | ^14.x | Framework |
| react | ^18.x | UI |
| typescript | ^5.x | Typing |
| tailwindcss | ^3.x | Styling |

## Testing

- **Unit**: {{testFramework}} for functions and hooks
- **Components**: React Testing Library
- **E2E**: Playwright/Cypress (if applicable)
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
