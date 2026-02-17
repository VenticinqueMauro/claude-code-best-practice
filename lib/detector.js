import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

/**
 * Stack detection result structure
 * @typedef {Object} StackDetection
 * @property {string} projectName - Project name from package.json
 * @property {string|null} framework - Detected framework (nextjs, react, vue, express, fastapi, django, flask, etc.)
 * @property {boolean} typescript - Whether TypeScript is used
 * @property {string} packageManager - Detected package manager (npm, pnpm, yarn)
 * @property {string|null} testFramework - Detected test framework
 * @property {string|null} database - Detected database/ORM
 * @property {string|null} styling - Detected styling solution
 * @property {string|null} auth - Detected auth solution
 * @property {string} language - Primary language (javascript, typescript, python)
 * @property {number} confidence - Detection confidence (0-100)
 * @property {Object} raw - Raw detection data
 */

/**
 * Detect the tech stack of a project
 * @param {string} projectPath - Path to the project
 * @returns {Promise<StackDetection>} Detection result
 */
export async function detectStack(projectPath) {
  const detection = {
    projectName: 'my-project',
    framework: null,
    typescript: false,
    packageManager: 'npm',
    testFramework: null,
    database: null,
    styling: null,
    auth: null,
    language: 'javascript',
    confidence: 0,
    raw: {
      dependencies: {},
      devDependencies: {},
      files: []
    }
  };

  // Detect package.json data
  const packageJsonPath = join(projectPath, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      detection.projectName = packageJson.name || 'my-project';
      detection.raw.dependencies = packageJson.dependencies || {};
      detection.raw.devDependencies = packageJson.devDependencies || {};
      detection.confidence += 30;
    } catch {
      // Invalid package.json, continue with defaults
    }
  }

  const allDeps = {
    ...detection.raw.dependencies,
    ...detection.raw.devDependencies
  };

  // Detect TypeScript
  detection.typescript = detectTypeScript(projectPath, allDeps);
  if (detection.typescript) {
    detection.language = 'typescript';
    detection.confidence += 10;
  }

  // Detect package manager
  detection.packageManager = detectPackageManager(projectPath);
  detection.confidence += 10;

  // Detect framework
  detection.framework = detectFramework(projectPath, allDeps);
  if (detection.framework) {
    detection.confidence += 20;
  }

  // Detect test framework
  detection.testFramework = detectTestFramework(allDeps);
  if (detection.testFramework) {
    detection.confidence += 10;
  }

  // Detect database/ORM
  detection.database = detectDatabase(allDeps);
  if (detection.database) {
    detection.confidence += 10;
  }

  // Detect styling
  detection.styling = detectStyling(allDeps);
  if (detection.styling) {
    detection.confidence += 5;
  }

  // Detect auth
  detection.auth = detectAuth(allDeps);
  if (detection.auth) {
    detection.confidence += 5;
  }

  // Check for Python project
  if (!detection.framework) {
    const pythonDetection = detectPythonProject(projectPath);
    if (pythonDetection.isPython) {
      detection.language = 'python';
      detection.framework = pythonDetection.framework;
      detection.packageManager = pythonDetection.packageManager;
      detection.confidence += 30;
    }
  }

  // Cap confidence at 100
  detection.confidence = Math.min(detection.confidence, 100);

  return detection;
}

/**
 * Detect if TypeScript is used
 */
function detectTypeScript(projectPath, deps) {
  // Check for tsconfig.json
  if (existsSync(join(projectPath, 'tsconfig.json'))) {
    return true;
  }

  // Check for typescript in dependencies
  if (deps.typescript) {
    return true;
  }

  return false;
}

/**
 * Detect package manager
 */
function detectPackageManager(projectPath) {
  if (existsSync(join(projectPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (existsSync(join(projectPath, 'yarn.lock'))) {
    return 'yarn';
  }
  if (existsSync(join(projectPath, 'bun.lockb'))) {
    return 'bun';
  }
  // Default to npm
  return 'npm';
}

/**
 * Detect framework
 */
function detectFramework(projectPath, deps) {
  // Next.js
  if (deps.next) {
    return 'nextjs';
  }

  // Nuxt
  if (deps.nuxt) {
    return 'nuxt';
  }

  // Vue
  if (deps.vue) {
    return 'vue';
  }

  // React (check after Next.js)
  if (deps.react) {
    // Check if it's a Vite project
    if (deps.vite) {
      return 'react-vite';
    }
    // Check for Create React App
    if (deps['react-scripts']) {
      return 'react-cra';
    }
    return 'react';
  }

  // Express
  if (deps.express) {
    return 'express';
  }

  // Fastify
  if (deps.fastify) {
    return 'fastify';
  }

  // NestJS
  if (deps['@nestjs/core']) {
    return 'nestjs';
  }

  // Hono
  if (deps.hono) {
    return 'hono';
  }

  // Svelte/SvelteKit
  if (deps['@sveltejs/kit']) {
    return 'sveltekit';
  }
  if (deps.svelte) {
    return 'svelte';
  }

  // Astro
  if (deps.astro) {
    return 'astro';
  }

  // Remix
  if (deps['@remix-run/react']) {
    return 'remix';
  }

  return null;
}

/**
 * Detect test framework
 */
function detectTestFramework(deps) {
  if (deps.vitest) {
    return 'vitest';
  }
  if (deps.jest) {
    return 'jest';
  }
  if (deps['@playwright/test']) {
    return 'playwright';
  }
  if (deps.cypress) {
    return 'cypress';
  }
  if (deps.mocha) {
    return 'mocha';
  }
  if (deps.ava) {
    return 'ava';
  }
  return null;
}

/**
 * Detect database/ORM
 */
function detectDatabase(deps) {
  if (deps['@prisma/client'] || deps.prisma) {
    return 'prisma';
  }
  if (deps.mongoose) {
    return 'mongoose';
  }
  if (deps['drizzle-orm']) {
    return 'drizzle';
  }
  if (deps.sequelize) {
    return 'sequelize';
  }
  if (deps.typeorm) {
    return 'typeorm';
  }
  if (deps['@supabase/supabase-js']) {
    return 'supabase';
  }
  if (deps.firebase || deps['firebase-admin']) {
    return 'firebase';
  }
  if (deps.pg) {
    return 'postgresql';
  }
  if (deps.mysql2 || deps.mysql) {
    return 'mysql';
  }
  return null;
}

/**
 * Detect styling solution
 */
function detectStyling(deps) {
  if (deps.tailwindcss) {
    return 'tailwind';
  }
  if (deps['styled-components']) {
    return 'styled-components';
  }
  if (deps['@emotion/react'] || deps['@emotion/styled']) {
    return 'emotion';
  }
  if (deps.sass || deps['node-sass']) {
    return 'sass';
  }
  if (deps['@chakra-ui/react']) {
    return 'chakra';
  }
  if (deps['@mantine/core']) {
    return 'mantine';
  }
  if (deps['@mui/material']) {
    return 'mui';
  }
  return null;
}

/**
 * Detect auth solution
 */
function detectAuth(deps) {
  if (deps['next-auth'] || deps['@auth/core']) {
    return 'next-auth';
  }
  if (deps['@clerk/nextjs'] || deps['@clerk/clerk-react']) {
    return 'clerk';
  }
  if (deps['@supabase/auth-helpers-nextjs'] || deps['@supabase/auth-helpers-react']) {
    return 'supabase-auth';
  }
  if (deps.passport) {
    return 'passport';
  }
  if (deps['firebase-admin'] && deps.firebase) {
    return 'firebase-auth';
  }
  if (deps['@auth0/nextjs-auth0'] || deps['@auth0/auth0-react']) {
    return 'auth0';
  }
  return null;
}

/**
 * Detect Python project
 */
function detectPythonProject(projectPath) {
  const result = {
    isPython: false,
    framework: null,
    packageManager: 'pip'
  };

  // Check for Python project files
  const hasPyproject = existsSync(join(projectPath, 'pyproject.toml'));
  const hasRequirements = existsSync(join(projectPath, 'requirements.txt'));
  const hasSetupPy = existsSync(join(projectPath, 'setup.py'));
  const hasPipfile = existsSync(join(projectPath, 'Pipfile'));
  const hasPoetryLock = existsSync(join(projectPath, 'poetry.lock'));

  if (!hasPyproject && !hasRequirements && !hasSetupPy && !hasPipfile) {
    return result;
  }

  result.isPython = true;

  // Detect package manager
  if (hasPoetryLock || (hasPyproject && existsSync(join(projectPath, 'poetry.lock')))) {
    result.packageManager = 'poetry';
  } else if (hasPipfile) {
    result.packageManager = 'pipenv';
  } else if (existsSync(join(projectPath, 'uv.lock'))) {
    result.packageManager = 'uv';
  }

  // Try to detect framework from requirements or pyproject
  let requirements = '';
  if (hasRequirements) {
    try {
      requirements = readFileSync(join(projectPath, 'requirements.txt'), 'utf8').toLowerCase();
    } catch {
      // Ignore read errors
    }
  }

  if (hasPyproject) {
    try {
      const pyproject = readFileSync(join(projectPath, 'pyproject.toml'), 'utf8').toLowerCase();
      requirements += ' ' + pyproject;
    } catch {
      // Ignore read errors
    }
  }

  // Detect Python framework
  if (requirements.includes('fastapi')) {
    result.framework = 'fastapi';
  } else if (requirements.includes('django')) {
    result.framework = 'django';
  } else if (requirements.includes('flask')) {
    result.framework = 'flask';
  } else if (requirements.includes('starlette')) {
    result.framework = 'starlette';
  } else if (requirements.includes('tornado')) {
    result.framework = 'tornado';
  }

  return result;
}

/**
 * Display detection summary with chalk formatting
 * @param {StackDetection} detection - Detection result
 */
export function displayDetectionSummary(detection) {
  console.log('');
  console.log(chalk.blue('╭──────────────────────────────────────────╮'));
  console.log(chalk.blue('│  ') + chalk.bold('Stack Detection') + '                          ' + chalk.blue('│'));
  console.log(chalk.blue('╰──────────────────────────────────────────╯'));
  console.log('');

  const items = [
    { label: 'Project', value: detection.projectName, icon: '📦' },
    { label: 'Framework', value: formatFramework(detection.framework), icon: '🚀' },
    { label: 'Language', value: detection.typescript ? 'TypeScript' : capitalizeFirst(detection.language), icon: '📝' },
    { label: 'Package Manager', value: detection.packageManager, icon: '📋' }
  ];

  if (detection.testFramework) {
    items.push({ label: 'Testing', value: capitalizeFirst(detection.testFramework), icon: '🧪' });
  }
  if (detection.database) {
    items.push({ label: 'Database', value: capitalizeFirst(detection.database), icon: '🗄️' });
  }
  if (detection.styling) {
    items.push({ label: 'Styling', value: formatStyling(detection.styling), icon: '🎨' });
  }
  if (detection.auth) {
    items.push({ label: 'Auth', value: formatAuth(detection.auth), icon: '🔐' });
  }

  for (const item of items) {
    const label = chalk.gray(`${item.label}:`);
    const value = item.value ? chalk.white(item.value) : chalk.gray('Not detected');
    console.log(`  ${item.icon} ${label.padEnd(25)} ${value}`);
  }

  console.log('');
  const confidenceColor = detection.confidence >= 70 ? chalk.green : detection.confidence >= 40 ? chalk.yellow : chalk.red;
  console.log(`  ${chalk.gray('Confidence:')} ${confidenceColor(detection.confidence + '%')}`);
  console.log('');
}

/**
 * Format framework name for display
 */
function formatFramework(framework) {
  const names = {
    'nextjs': 'Next.js',
    'react': 'React',
    'react-vite': 'React + Vite',
    'react-cra': 'Create React App',
    'vue': 'Vue.js',
    'nuxt': 'Nuxt',
    'express': 'Express.js',
    'fastify': 'Fastify',
    'nestjs': 'NestJS',
    'hono': 'Hono',
    'sveltekit': 'SvelteKit',
    'svelte': 'Svelte',
    'astro': 'Astro',
    'remix': 'Remix',
    'fastapi': 'FastAPI',
    'django': 'Django',
    'flask': 'Flask',
    'starlette': 'Starlette',
    'tornado': 'Tornado'
  };
  return names[framework] || framework;
}

/**
 * Format styling solution for display
 */
function formatStyling(styling) {
  const names = {
    'tailwind': 'Tailwind CSS',
    'styled-components': 'styled-components',
    'emotion': 'Emotion',
    'sass': 'Sass/SCSS',
    'chakra': 'Chakra UI',
    'mantine': 'Mantine',
    'mui': 'Material UI'
  };
  return names[styling] || styling;
}

/**
 * Format auth solution for display
 */
function formatAuth(auth) {
  const names = {
    'next-auth': 'NextAuth.js',
    'clerk': 'Clerk',
    'supabase-auth': 'Supabase Auth',
    'passport': 'Passport.js',
    'firebase-auth': 'Firebase Auth',
    'auth0': 'Auth0'
  };
  return names[auth] || auth;
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get template recommendation based on detection
 * @param {StackDetection} detection
 * @returns {string} Recommended template type
 */
export function getRecommendedTemplateType(detection) {
  const framework = detection.framework;

  // Next.js family
  if (framework === 'nextjs') {
    return 'nextjs';
  }

  // React family
  if (framework === 'react' || framework === 'react-vite' || framework === 'react-cra') {
    return 'react';
  }

  // Backend Node.js
  if (framework === 'express' || framework === 'fastify' || framework === 'hono' || framework === 'nestjs') {
    return 'express';
  }

  // Python
  if (detection.language === 'python') {
    return 'python';
  }

  // Default to minimal
  return 'minimal';
}
