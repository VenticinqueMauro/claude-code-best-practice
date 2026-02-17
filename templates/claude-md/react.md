# CLAUDE.md

> Context guide for Claude Code in this project.

## Project

- **Name**: {{projectName}}
- **Type**: React SPA
- **Description**: {{description}}
- **Repo**: {{repoUrl}}

## Stack

- **Framework**: {{framework}}
- **Language**: {{language}}
- **Styling**: {{styling}}
- **State**: Context/Redux/Zustand
- **Deploy**: {{deployTarget}}
- **Package Manager**: {{packageManager}}

## Main Commands

```bash
{{pm}} run dev        # Development server
{{pm}} run build      # Production build
{{pm}} run preview    # Preview production build
{{pm}} run test       # Run tests
{{pm}} run lint       # Linting
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── ui/           # Primitives (Button, Input, Modal)
│   ├── forms/        # Form components
│   └── layout/       # Layout components (Header, Footer)
├── pages/            # Page components (route views)
├── hooks/            # Custom hooks
├── context/          # React Context providers
├── services/         # API calls and external services
├── utils/            # Helper functions
├── types/            # TypeScript types/interfaces
├── styles/           # Global styles
├── constants/        # Constants and config
└── App.tsx           # Root component
```

## Code Conventions

- Functional components only, no class components.
- Props typed with `interface`, not `type`.
- Named exports always. Default export only for pages.
- One component per file. Filename = component name.
- Custom hooks in `hooks/` with `use` prefix.
- Absolute imports with alias (`@/`, `~/`).

## State Management

```
Local State:     useState for component-specific state
Form State:      React Hook Form for forms
Server State:    React Query/SWR for API data
Global State:    Context/Redux/Zustand for app-wide state
URL State:       useSearchParams for shareable state
```

## Project Patterns

{{customPatterns}}

- **Component Structure**: Props → Hooks → Handlers → Render
- **Data Fetching**: React Query with query keys pattern
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router with lazy loading

## Component Template

```tsx
interface ComponentProps {
  // Props definition
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Derived state
  const computed = useMemo(() => ..., [deps]);

  // 3. Effects
  useEffect(() => { ... }, [deps]);

  // 4. Handlers
  const handleClick = () => { ... };

  // 5. Render
  return ( ... );
}
```

## Key Files

{{keyFiles}}

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component |
| `src/main.tsx` | Entry point |
| `src/routes.tsx` | Route definitions |
| `src/context/AuthContext.tsx` | Auth state |
| `.env.local` | Environment variables (DO NOT READ) |

## Critical Rules

1. NEVER read `.env`, `.env.local` or files in `secrets/`.
2. ALWAYS run linting and type-check before committing.
3. ALWAYS memoize expensive computations and callbacks.
4. NEVER mutate state directly, always use setState.
5. Atomic commits: one logical change per commit.

## Dependencies

| Package | Version | Use |
|---------|---------|-----|
| react | ^18.x | UI |
| react-router-dom | ^6.x | Routing |
| @tanstack/react-query | ^5.x | Server state |
| react-hook-form | ^7.x | Forms |

## Testing

- **Unit**: {{testFramework}} for hooks and utils
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
