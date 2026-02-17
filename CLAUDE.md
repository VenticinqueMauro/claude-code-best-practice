# CLAUDE.md

> Context guide for Claude Code in this project.

## Project

- **Name**: @mauro25qe/claude-code-setup
- **Description**: CLI tool to configure Claude Code with best practices, auto-detection, templates, and plugin support
- **Repo**: https://github.com/VenticinqueMauro/claude-code-best-practice

## Stack

- **Type**: Node.js CLI Tool
- **Language**: JavaScript (ES Modules)
- **Package Manager**: npm
- **Publish**: npmjs.com

## Main Commands

```bash
# Development / Testing
node bin/cli.js --help              # Show help
node bin/cli.js --dry-run           # Test without changes
node bin/cli.js --dry-run --yes     # Full auto flow test

# Publishing
npm version patch                   # Bump version
npm publish --access public         # Publish to npm
```

## Project Structure

```
bin/
├── cli.js                # CLI entry point, argument parsing

lib/
├── installer.js          # Main installer flow (7 steps)
├── detector.js           # Auto-detection of project stack
├── templates.js          # CLAUDE.md template processing
├── wizard.js             # Interactive configuration wizard
├── plugins.js            # Official plugin integration
├── prompts.js            # Inquirer.js prompts
├── utils.js              # Helper functions

templates/
├── global-settings.json      # ~/.claude/settings.json template
├── project-settings.json     # .claude/settings.json template
├── project-CLAUDE.md         # Fallback CLAUDE.md
├── commands/rpi/             # RPI workflow commands
├── rules/                    # Code rules (5 files)
└── claude-md/                # Stack-specific templates
    ├── nextjs.md
    ├── express.md
    ├── react.md
    ├── python.md
    └── minimal.md
```

## Code Conventions

- ES Modules (`import`/`export`), no CommonJS
- Async/await for all async operations
- Functions should be pure when possible
- Use chalk for colored output, ora for spinners
- inquirer.js for interactive prompts

## Key Files

| File | Purpose |
|------|---------|
| `bin/cli.js` | CLI entry point, parses arguments |
| `lib/installer.js` | Main 7-step installation flow |
| `lib/detector.js` | Detects framework, TS, package manager, etc. |
| `lib/templates.js` | Processes CLAUDE.md templates with placeholders |
| `lib/wizard.js` | Quick/Full/Expert configuration modes |
| `lib/plugins.js` | Official plugin installation |
| `package.json` | Package config, version, dependencies |

## Critical Rules

1. NEVER break backward compatibility with existing CLI flags
2. ALWAYS test with `--dry-run` before publishing
3. ALWAYS verify syntax with `node --check <file>` for new modules
4. Keep approved plugins list curated (5k+ downloads, official only)
5. Templates must work with minimal data (graceful fallbacks)

## Architecture

```
User runs CLI
      ↓
bin/cli.js (parse args)
      ↓
lib/installer.js (orchestrates flow)
      ↓
  ┌───┴───┬───────┬─────────┬──────────┐
  ↓       ↓       ↓         ↓          ↓
detector templates wizard prompts  plugins
```

## 7-Step Installation Flow

1. **Detect Stack** - Analyze package.json, lock files, tsconfig
2. **Select Mode** - Quick / Full / Expert
3. **Choose Template** - Recommended based on detection
4. **Configure CLAUDE.md** - Interactive questions
5. **Select Plugins** - Official only (5k+ downloads)
6. **Install** - Copy files, process templates
7. **Summary** - Personalized next steps

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
- **Date**: 2026-02-17
- **Feature in progress**: UX Improvement System
- **Status**: Complete - ready to publish
- **Next step**: Commit and push to GitHub + npm

### Recent Technical Decisions
- Implemented 4 major features: auto-detection, wizard, plugins, templates
- Created 5 CLAUDE.md templates (nextjs, express, react, python, minimal)
- Used dogfooding - installed our own tool on this project

### Known Issues
- None

---

## Skills

### Business Domain
- Claude Code CLI tool ecosystem
- Developer experience (DX) for AI-assisted coding
- Project scaffolding and configuration management

### Custom Patterns
- Template placeholders: `{{variableName}}` replaced at runtime
- Detection confidence scoring (0-100%)
- Graceful fallbacks when detection fails
