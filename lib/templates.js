import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { getPackageRoot } from './utils.js';

/**
 * Available template types
 */
export const TEMPLATE_TYPES = {
  nextjs: {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Next.js 14+ with App Router, Server Components, and modern patterns',
    frameworks: ['nextjs'],
    file: 'nextjs.md'
  },
  express: {
    id: 'express',
    name: 'Express/Node.js API',
    description: 'Node.js backend with routes, controllers, services layers',
    frameworks: ['express', 'fastify', 'hono', 'nestjs'],
    file: 'express.md'
  },
  react: {
    id: 'react',
    name: 'React SPA',
    description: 'React SPA with Vite, state management, and component patterns',
    frameworks: ['react', 'react-vite', 'react-cra'],
    file: 'react.md'
  },
  python: {
    id: 'python',
    name: 'Python',
    description: 'FastAPI/Django/Flask with type hints and best practices',
    frameworks: ['fastapi', 'django', 'flask', 'starlette'],
    file: 'python.md'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Universal minimal template for any project type',
    frameworks: [],
    file: 'minimal.md'
  }
};

/**
 * Get recommended template based on stack detection
 * @param {import('./detector.js').StackDetection} detection - Detection result
 * @returns {string} Template type ID
 */
export function getRecommendedTemplate(detection) {
  const framework = detection.framework;
  const language = detection.language;

  // Check each template for matching frameworks
  for (const [templateId, template] of Object.entries(TEMPLATE_TYPES)) {
    if (template.frameworks.includes(framework)) {
      return templateId;
    }
  }

  // Fallback based on language
  if (language === 'python') {
    return 'python';
  }

  // Default to minimal
  return 'minimal';
}

/**
 * Process template by replacing placeholders with actual data
 * @param {string} templateType - Template type ID
 * @param {Object} data - Data to replace placeholders
 * @returns {string} Processed template content
 */
export function processTemplate(templateType, data) {
  const template = TEMPLATE_TYPES[templateType];
  if (!template) {
    throw new Error(`Unknown template type: ${templateType}`);
  }

  const packageRoot = getPackageRoot();
  const templatePath = join(packageRoot, 'templates', 'claude-md', template.file);

  if (!existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  let content = readFileSync(templatePath, 'utf8');

  // Replace all placeholders
  const placeholders = {
    '{{projectName}}': data.projectName || 'my-project',
    '{{description}}': data.description || 'Project description',
    '{{repoUrl}}': data.repoUrl || 'https://github.com/user/repo',
    '{{framework}}': data.framework || 'Not specified',
    '{{language}}': data.typescript ? 'TypeScript' : (data.language || 'JavaScript'),
    '{{packageManager}}': data.packageManager || 'npm',
    '{{pm}}': data.packageManager || 'npm',
    '{{testFramework}}': data.testFramework || 'Not configured',
    '{{database}}': data.database || 'Not configured',
    '{{styling}}': data.styling || 'CSS',
    '{{auth}}': data.auth || 'Not configured',
    '{{deployTarget}}': data.deployTarget || 'Not specified',
    '{{date}}': new Date().toISOString().split('T')[0],
    '{{customPatterns}}': data.customPatterns || '',
    '{{keyFiles}}': data.keyFiles || '',
    '{{externalApis}}': data.externalApis || ''
  };

  for (const [placeholder, value] of Object.entries(placeholders)) {
    content = content.replace(new RegExp(escapeRegex(placeholder), 'g'), value);
  }

  return content;
}

/**
 * List available templates with descriptions
 * @returns {Array} List of templates
 */
export function listAvailableTemplates() {
  return Object.values(TEMPLATE_TYPES).map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    frameworks: template.frameworks
  }));
}

/**
 * Format template for inquirer list choice
 * @param {Object} template - Template object
 * @param {string} recommended - Recommended template ID
 * @returns {Object} Inquirer choice object
 */
export function formatTemplateChoice(template, recommended) {
  const isRecommended = template.id === recommended;
  const badge = isRecommended ? chalk.green(' (Recommended)') : '';
  const desc = chalk.gray(` - ${template.description}`);

  return {
    name: `${template.name}${badge}${desc}`,
    value: template.id,
    short: template.name
  };
}

/**
 * Get template by ID
 * @param {string} templateId - Template ID
 * @returns {Object|null} Template object or null
 */
export function getTemplateById(templateId) {
  return TEMPLATE_TYPES[templateId] || null;
}

/**
 * Display available templates
 */
export function displayTemplates() {
  console.log('');
  console.log(chalk.blue('╭──────────────────────────────────────────╮'));
  console.log(chalk.blue('│  ') + chalk.bold('Available Templates') + '                      ' + chalk.blue('│'));
  console.log(chalk.blue('╰──────────────────────────────────────────╯'));
  console.log('');

  for (const template of Object.values(TEMPLATE_TYPES)) {
    console.log(`  ${chalk.white.bold(template.name)}`);
    console.log(`  ${chalk.gray(template.description)}`);
    if (template.frameworks.length > 0) {
      console.log(`  ${chalk.gray(`Frameworks: ${template.frameworks.join(', ')}`)}`);
    }
    console.log('');
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get template content directly (for fallback/default)
 * @param {string} templateType - Template type ID
 * @returns {string|null} Template content or null
 */
export function getTemplateContent(templateType) {
  const template = TEMPLATE_TYPES[templateType];
  if (!template) return null;

  const packageRoot = getPackageRoot();
  const templatePath = join(packageRoot, 'templates', 'claude-md', template.file);

  if (!existsSync(templatePath)) return null;

  return readFileSync(templatePath, 'utf8');
}

/**
 * Validate that all template files exist
 * @returns {{valid: boolean, missing: string[]}}
 */
export function validateTemplates() {
  const packageRoot = getPackageRoot();
  const missing = [];

  for (const template of Object.values(TEMPLATE_TYPES)) {
    const templatePath = join(packageRoot, 'templates', 'claude-md', template.file);
    if (!existsSync(templatePath)) {
      missing.push(template.file);
    }
  }

  return {
    valid: missing.length === 0,
    missing
  };
}
