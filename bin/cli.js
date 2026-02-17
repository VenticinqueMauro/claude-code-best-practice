#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import { runInstaller } from '../lib/installer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse CLI arguments
const args = process.argv.slice(2);
const options = {
  // Existing flags
  dryRun: args.includes('--dry-run'),
  globalOnly: args.includes('--global-only'),
  projectOnly: args.includes('--project-only') || args.includes('--project'),
  yes: args.includes('--yes') || args.includes('-y'),
  version: args.includes('--version') || args.includes('-v'),
  help: args.includes('--help') || args.includes('-h'),
  projectPath: null,

  // New wizard mode flags
  quick: args.includes('--quick'),
  full: args.includes('--full'),
  expert: args.includes('--expert'),

  // New skip flags
  skipPlugins: args.includes('--skip-plugins'),
  skipDetection: args.includes('--skip-detection'),

  // Template flag
  template: null
};

// Extract project path if provided
const projectPathIndex = args.findIndex(arg => arg === '--project-path');
if (projectPathIndex !== -1 && args[projectPathIndex + 1]) {
  options.projectPath = args[projectPathIndex + 1];
}

// Extract template if provided
const templateIndex = args.findIndex(arg => arg === '--template');
if (templateIndex !== -1 && args[templateIndex + 1]) {
  options.template = args[templateIndex + 1];
}

// Show version
if (options.version) {
  const packageJson = await import('../package.json', { with: { type: 'json' } });
  console.log(`v${packageJson.default.version}`);
  process.exit(0);
}

// Show help
if (options.help) {
  console.log(`
${chalk.blue.bold('Claude Code Setup')} - Automated installer with stack detection

${chalk.yellow('Usage:')}
  npx @mauro25qe/claude-code-setup [options]

${chalk.yellow('Installation Options:')}
  --global-only        Install only global config (~/.claude/settings.json)
  --project-only       Install only project setup (current directory)
  --project            Alias for --project-only
  --project-path PATH  Install in specific project directory

${chalk.yellow('Wizard Modes:')}
  --quick              Quick mode: just name + description
  --full               Full mode: all sections with stack confirmation (default)
  --expert             Expert mode: full control with custom patterns

${chalk.yellow('Template Options:')}
  --template TYPE      Use specific template (nextjs, express, react, python, minimal)

${chalk.yellow('Skip Options:')}
  --skip-plugins       Skip plugin selection
  --skip-detection     Skip auto-detection of stack

${chalk.yellow('Other Options:')}
  --yes, -y            Skip all prompts, use defaults
  --dry-run            Show what would be installed without copying files
  --version, -v        Show version
  --help, -h           Show this help

${chalk.yellow('Examples:')}
  ${chalk.gray('# Interactive install (recommended)')}
  npx @mauro25qe/claude-code-setup

  ${chalk.gray('# Quick setup with auto-detection')}
  npx @mauro25qe/claude-code-setup --quick

  ${chalk.gray('# Full wizard with all options')}
  npx @mauro25qe/claude-code-setup --full

  ${chalk.gray('# Expert mode for advanced users')}
  npx @mauro25qe/claude-code-setup --expert

  ${chalk.gray('# Use specific template')}
  npx @mauro25qe/claude-code-setup --template nextjs

  ${chalk.gray('# Skip plugins and use defaults')}
  npx @mauro25qe/claude-code-setup --yes --skip-plugins

  ${chalk.gray('# Install global config only')}
  npx @mauro25qe/claude-code-setup --global-only

  ${chalk.gray('# Setup project in current directory')}
  cd my-project
  npx @mauro25qe/claude-code-setup --project

  ${chalk.gray('# Test without making changes')}
  npx @mauro25qe/claude-code-setup --dry-run

${chalk.yellow('Available Templates:')}
  ${chalk.white('nextjs')}    - Next.js 14+ with App Router, Server Components
  ${chalk.white('express')}   - Node.js API with routes/controllers/services
  ${chalk.white('react')}     - React SPA with Vite, state management
  ${chalk.white('python')}    - FastAPI/Django/Flask with type hints
  ${chalk.white('minimal')}   - Universal minimal template

${chalk.yellow('Plugins:')}
  Official plugins with 5k+ downloads are available:
  • @anthropics/claude-code-plugins/frontend-design (65k+)
  • @anthropics/claude-code-plugins/feature-dev (65k+)
  • @anthropics/claude-code-plugins/code-review (65k+)
  • @EveryInc/every-marketplace/compound-engineering (8.9k)

${chalk.yellow('Documentation:')}
  https://github.com/VenticinqueMauro/claude-code-best-practice
`);
  process.exit(0);
}

// Print header
console.log(chalk.blue('╔══════════════════════════════════════════╗'));
console.log(chalk.blue('║  Claude Code - Setup Optimizado          ║'));
console.log(chalk.blue('╚══════════════════════════════════════════╝'));
console.log('');

// Run installer
try {
  await runInstaller(options);
} catch (error) {
  console.error(chalk.red('\n✗ Installation failed:'), error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
}
