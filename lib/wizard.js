import inquirer from 'inquirer';
import chalk from 'chalk';

/**
 * Wizard modes
 */
export const WIZARD_MODES = {
  quick: {
    id: 'quick',
    name: 'Quick',
    description: 'Just the essentials (name + description)',
    questions: ['projectName', 'description']
  },
  full: {
    id: 'full',
    name: 'Full',
    description: 'All sections with stack confirmation',
    questions: ['projectName', 'description', 'repoUrl', 'confirmStack', 'deployTarget']
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    description: 'Full control with custom patterns',
    questions: ['projectName', 'description', 'repoUrl', 'confirmStack', 'deployTarget', 'customPatterns', 'keyFiles', 'externalApis']
  }
};

/**
 * Run the wizard based on mode
 * @param {string} mode - Wizard mode (quick, full, expert)
 * @param {import('./detector.js').StackDetection} detection - Stack detection result
 * @returns {Promise<Object>} Wizard answers
 */
export async function runWizard(mode, detection) {
  const wizardMode = WIZARD_MODES[mode] || WIZARD_MODES.full;

  console.log('');
  console.log(chalk.blue('╭──────────────────────────────────────────╮'));
  console.log(chalk.blue('│  ') + chalk.bold(`Configuration (${wizardMode.name} Mode)`) + '              '.slice(0, 15 - wizardMode.name.length) + chalk.blue('│'));
  console.log(chalk.blue('╰──────────────────────────────────────────╯'));
  console.log('');

  switch (mode) {
    case 'quick':
      return runQuickWizard(detection);
    case 'expert':
      return runExpertWizard(detection);
    default:
      return runFullWizard(detection);
  }
}

/**
 * Run quick wizard - only name and description
 * @param {import('./detector.js').StackDetection} detection
 * @returns {Promise<Object>}
 */
export async function runQuickWizard(detection) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: detection.projectName,
      validate: (input) => input.trim() ? true : 'Project name is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Brief description:',
      default: `A ${formatFrameworkName(detection.framework)} project`,
      validate: (input) => input.trim() ? true : 'Description is required'
    }
  ]);

  // Merge with detection data
  return {
    ...answers,
    framework: formatFrameworkName(detection.framework),
    typescript: detection.typescript,
    language: detection.language,
    packageManager: detection.packageManager,
    testFramework: detection.testFramework,
    database: detection.database,
    styling: detection.styling,
    auth: detection.auth,
    repoUrl: '',
    deployTarget: '',
    customPatterns: '',
    keyFiles: '',
    externalApis: ''
  };
}

/**
 * Run full wizard - all main sections
 * @param {import('./detector.js').StackDetection} detection
 * @returns {Promise<Object>}
 */
export async function runFullWizard(detection) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: detection.projectName,
      validate: (input) => input.trim() ? true : 'Project name is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Brief description:',
      default: `A ${formatFrameworkName(detection.framework)} project`,
      validate: (input) => input.trim() ? true : 'Description is required'
    },
    {
      type: 'input',
      name: 'repoUrl',
      message: 'Repository URL (optional):',
      default: ''
    },
    {
      type: 'confirm',
      name: 'confirmStack',
      message: () => {
        const stackSummary = buildStackSummary(detection);
        return `Detected stack:\n${stackSummary}\n  Is this correct?`;
      },
      default: true
    },
    {
      type: 'list',
      name: 'deployTarget',
      message: 'Deploy target:',
      choices: getDeployTargets(detection),
      default: getDefaultDeployTarget(detection)
    }
  ]);

  // If stack is incorrect, ask for manual input
  if (!answers.confirmStack) {
    const stackAnswers = await askManualStack(detection);
    return {
      ...answers,
      ...stackAnswers,
      customPatterns: '',
      keyFiles: '',
      externalApis: ''
    };
  }

  return {
    ...answers,
    framework: formatFrameworkName(detection.framework),
    typescript: detection.typescript,
    language: detection.language,
    packageManager: detection.packageManager,
    testFramework: detection.testFramework,
    database: detection.database,
    styling: detection.styling,
    auth: detection.auth,
    customPatterns: '',
    keyFiles: '',
    externalApis: ''
  };
}

/**
 * Run expert wizard - full control with custom patterns
 * @param {import('./detector.js').StackDetection} detection
 * @returns {Promise<Object>}
 */
export async function runExpertWizard(detection) {
  // First get full wizard answers
  const baseAnswers = await runFullWizard(detection);

  console.log('');
  console.log(chalk.yellow('Expert Options'));
  console.log('');

  const expertAnswers = await inquirer.prompt([
    {
      type: 'editor',
      name: 'customPatterns',
      message: 'Custom patterns (markdown, one per line):',
      default: getDefaultPatterns(detection)
    },
    {
      type: 'editor',
      name: 'keyFiles',
      message: 'Key files (markdown table format):',
      default: getDefaultKeyFiles(detection)
    },
    {
      type: 'editor',
      name: 'externalApis',
      message: 'External APIs (markdown list format):',
      default: '- API Name: endpoint, auth method, docs URL'
    }
  ]);

  return {
    ...baseAnswers,
    ...expertAnswers
  };
}

/**
 * Ask for manual stack configuration
 */
async function askManualStack(detection) {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Framework:',
      choices: [
        { name: 'Next.js', value: 'Next.js' },
        { name: 'React', value: 'React' },
        { name: 'Vue.js', value: 'Vue.js' },
        { name: 'Express.js', value: 'Express.js' },
        { name: 'FastAPI', value: 'FastAPI' },
        { name: 'Django', value: 'Django' },
        { name: 'Flask', value: 'Flask' },
        { name: 'Other', value: 'Other' }
      ],
      default: formatFrameworkName(detection.framework)
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Using TypeScript?',
      default: detection.typescript
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager:',
      choices: ['npm', 'pnpm', 'yarn', 'bun', 'pip', 'poetry'],
      default: detection.packageManager
    },
    {
      type: 'input',
      name: 'database',
      message: 'Database/ORM (optional):',
      default: detection.database || ''
    },
    {
      type: 'input',
      name: 'styling',
      message: 'Styling solution (optional):',
      default: detection.styling || ''
    },
    {
      type: 'input',
      name: 'auth',
      message: 'Auth solution (optional):',
      default: detection.auth || ''
    }
  ]);

  return {
    ...answers,
    language: answers.typescript ? 'typescript' : 'javascript',
    testFramework: detection.testFramework
  };
}

/**
 * Build stack summary string
 */
function buildStackSummary(detection) {
  const items = [];

  if (detection.framework) {
    items.push(`  ${chalk.gray('•')} Framework: ${chalk.white(formatFrameworkName(detection.framework))}`);
  }
  items.push(`  ${chalk.gray('•')} Language: ${chalk.white(detection.typescript ? 'TypeScript' : capitalizeFirst(detection.language))}`);
  items.push(`  ${chalk.gray('•')} Package Manager: ${chalk.white(detection.packageManager)}`);

  if (detection.testFramework) {
    items.push(`  ${chalk.gray('•')} Testing: ${chalk.white(capitalizeFirst(detection.testFramework))}`);
  }
  if (detection.database) {
    items.push(`  ${chalk.gray('•')} Database: ${chalk.white(capitalizeFirst(detection.database))}`);
  }
  if (detection.styling) {
    items.push(`  ${chalk.gray('•')} Styling: ${chalk.white(formatStyling(detection.styling))}`);
  }
  if (detection.auth) {
    items.push(`  ${chalk.gray('•')} Auth: ${chalk.white(formatAuth(detection.auth))}`);
  }

  return items.join('\n');
}

/**
 * Get deploy targets based on detection
 */
function getDeployTargets(detection) {
  const framework = detection.framework;

  const targets = [
    { name: 'Vercel', value: 'Vercel' },
    { name: 'Netlify', value: 'Netlify' },
    { name: 'AWS', value: 'AWS' },
    { name: 'Railway', value: 'Railway' },
    { name: 'Fly.io', value: 'Fly.io' },
    { name: 'Docker/Self-hosted', value: 'Docker' },
    { name: 'Other', value: 'Other' },
    { name: 'Not decided yet', value: 'Not specified' }
  ];

  // Reorder based on framework
  if (framework === 'nextjs') {
    // Vercel is already first, good
  } else if (framework === 'express' || framework === 'fastify' || detection.language === 'python') {
    // Put Railway/Fly.io first for backend
    return [
      { name: 'Railway', value: 'Railway' },
      { name: 'Fly.io', value: 'Fly.io' },
      { name: 'Docker/Self-hosted', value: 'Docker' },
      { name: 'AWS', value: 'AWS' },
      { name: 'Vercel', value: 'Vercel' },
      { name: 'Other', value: 'Other' },
      { name: 'Not decided yet', value: 'Not specified' }
    ];
  }

  return targets;
}

/**
 * Get default deploy target
 */
function getDefaultDeployTarget(detection) {
  if (detection.framework === 'nextjs') return 'Vercel';
  if (detection.framework === 'express' || detection.framework === 'fastify') return 'Railway';
  if (detection.language === 'python') return 'Railway';
  return 'Not specified';
}

/**
 * Get default patterns based on detection
 */
function getDefaultPatterns(detection) {
  const patterns = [];

  if (detection.framework === 'nextjs') {
    patterns.push('- **Data Fetching**: Server Components with fetch. Client-side with React Query.');
    patterns.push('- **Forms**: React Hook Form + Zod for validation.');
    patterns.push('- **Error Handling**: Error boundaries per route. Try/catch in server actions.');
    patterns.push('- **API Pattern**: Route handlers in `app/api/` return `NextResponse.json()`.');
  } else if (detection.framework === 'react' || detection.framework === 'react-vite') {
    patterns.push('- **State**: Context for global, useState for local, React Query for server state.');
    patterns.push('- **Forms**: React Hook Form + Zod for validation.');
    patterns.push('- **Routing**: React Router with lazy loading.');
  } else if (detection.framework === 'express') {
    patterns.push('- **Architecture**: routes → controllers → services → repositories.');
    patterns.push('- **Validation**: Zod/Joi middleware for request validation.');
    patterns.push('- **Error Handling**: Centralized error handler middleware.');
  } else if (detection.language === 'python') {
    patterns.push('- **Type Hints**: Use type hints everywhere, Pydantic for validation.');
    patterns.push('- **Architecture**: routers → services → repositories.');
    patterns.push('- **Async**: Prefer async functions for I/O operations.');
  }

  return patterns.join('\n') || '- Add your project-specific patterns here';
}

/**
 * Get default key files based on detection
 */
function getDefaultKeyFiles(detection) {
  const files = [];

  files.push('| File | Purpose |');
  files.push('|------|---------|');

  if (detection.framework === 'nextjs') {
    files.push('| `src/lib/db.ts` | Database connection |');
    files.push('| `src/lib/auth.ts` | Auth configuration |');
    files.push('| `middleware.ts` | Next.js middleware |');
  } else if (detection.framework === 'express') {
    files.push('| `src/app.js` | Express app setup |');
    files.push('| `src/routes/index.js` | Route definitions |');
    files.push('| `src/config/database.js` | Database config |');
  } else if (detection.language === 'python') {
    files.push('| `app/main.py` | Application entry |');
    files.push('| `app/config.py` | Configuration |');
    files.push('| `app/database.py` | Database setup |');
  } else {
    files.push('| `src/index.js` | Entry point |');
    files.push('| `src/config.js` | Configuration |');
  }

  files.push('| `.env.local` | Environment vars (DO NOT READ) |');

  return files.join('\n');
}

/**
 * Format framework name for display
 */
function formatFrameworkName(framework) {
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
    'flask': 'Flask'
  };
  return names[framework] || framework || 'Not detected';
}

/**
 * Format styling name
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
 * Format auth name
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
 * Format wizard mode for inquirer choice
 */
export function formatWizardModeChoice(mode) {
  const modeConfig = WIZARD_MODES[mode];
  return {
    name: `${modeConfig.name} - ${chalk.gray(modeConfig.description)}`,
    value: mode,
    short: modeConfig.name
  };
}
