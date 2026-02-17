import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import chalk from 'chalk';

/**
 * Get home directory path
 */
export function getHomeDir() {
  return homedir();
}

/**
 * Ensure directory exists, create if not
 */
export function ensureDir(dirPath, dryRun = false) {
  if (existsSync(dirPath)) {
    return { created: false, path: dirPath };
  }

  if (!dryRun) {
    mkdirSync(dirPath, { recursive: true });
  }

  return { created: true, path: dirPath };
}

/**
 * Copy file with optional dry run
 */
export function copyFile(src, dest, dryRun = false) {
  // Ensure destination directory exists
  const destDir = dirname(dest);
  ensureDir(destDir, dryRun);

  if (!dryRun) {
    copyFileSync(src, dest);
  }

  return { copied: true, from: src, to: dest };
}

/**
 * Copy directory recursively
 */
export function copyDir(src, dest, dryRun = false) {
  const results = [];

  if (!existsSync(src)) {
    throw new Error(`Source directory does not exist: ${src}`);
  }

  ensureDir(dest, dryRun);

  const entries = readdirSync(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      const dirResults = copyDir(srcPath, destPath, dryRun);
      results.push(...dirResults);
    } else {
      copyFile(srcPath, destPath, dryRun);
      results.push({ file: entry, from: srcPath, to: destPath });
    }
  }

  return results;
}

/**
 * Update .gitignore with Claude Code entries
 */
export function updateGitignore(projectPath, dryRun = false) {
  const gitignorePath = join(projectPath, '.gitignore');
  const claudeEntry = '.claude/settings.local.json';

  if (!existsSync(gitignorePath)) {
    if (!dryRun) {
      writeFileSync(gitignorePath, `# Claude Code local settings\n${claudeEntry}\n`);
    }
    return { updated: true, created: true };
  }

  const content = readFileSync(gitignorePath, 'utf8');

  if (content.includes(claudeEntry)) {
    return { updated: false, reason: 'already_exists' };
  }

  if (!dryRun) {
    const newContent = content + `\n# Claude Code local settings\n${claudeEntry}\n`;
    writeFileSync(gitignorePath, newContent);
  }

  return { updated: true, created: false };
}

/**
 * Get templates directory path
 */
export function getTemplatesDir(rootDir) {
  return join(rootDir, 'templates');
}

/**
 * Log with color and icon
 */
export function logSuccess(message) {
  console.log(chalk.green('✓'), message);
}

export function logWarning(message) {
  console.log(chalk.yellow('⚠'), message);
}

export function logError(message) {
  console.log(chalk.red('✗'), message);
}

export function logInfo(message) {
  console.log(chalk.blue('ℹ'), message);
}

/**
 * Create spinner for long operations
 */
export function createSpinner(ora, text) {
  return ora({
    text,
    color: 'blue',
    spinner: 'dots'
  });
}

/**
 * Check if running in npm/npx context
 */
export function isNpmContext() {
  return !!process.env.npm_config_user_agent;
}

/**
 * Get package root directory (where templates/ is located)
 */
export function getPackageRoot() {
  // When running via npm/npx, __dirname points to installed package
  // When running locally, points to project root
  const currentFile = fileURLToPath(import.meta.url);

  // Go up from lib/ to root
  return join(dirname(currentFile), '..');
}

// Import fileURLToPath
import { fileURLToPath } from 'url';

/**
 * Validate Node.js version
 */
export function validateNodeVersion(requiredVersion = '18.0.0') {
  const currentVersion = process.version.slice(1); // Remove 'v' prefix
  const [reqMajor] = requiredVersion.split('.').map(Number);
  const [currMajor] = currentVersion.split('.').map(Number);

  if (currMajor < reqMajor) {
    throw new Error(
      `Node.js ${requiredVersion} or higher is required. Current: ${process.version}`
    );
  }

  return true;
}
