import inquirer from 'inquirer';
import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { WIZARD_MODES, formatWizardModeChoice } from './wizard.js';
import { formatTemplateChoice, listAvailableTemplates } from './templates.js';
import { formatPluginChoice, getRecommendedPlugins } from './plugins.js';

/**
 * Ask user what they want to install
 */
export async function askInstallationType(options) {
  // If flags provided, skip prompt
  if (options.globalOnly) {
    return { installType: 'global' };
  }
  if (options.projectOnly) {
    return { installType: 'project' };
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'installType',
      message: 'What do you want to install?',
      choices: [
        {
          name: 'Both (global config + project setup) - Recommended for first time',
          value: 'both'
        },
        {
          name: 'Global config only (~/.claude/settings.json)',
          value: 'global'
        },
        {
          name: 'Project setup only (current directory)',
          value: 'project'
        }
      ],
      default: 'both'
    }
  ]);

  return answers;
}

/**
 * Ask for project directory
 */
export async function askProjectDirectory(options) {
  // If project path provided via flag, use it
  if (options.projectPath) {
    return { projectPath: options.projectPath };
  }

  // Check if current directory looks like a project
  const cwd = process.cwd();
  const hasPackageJson = existsSync(join(cwd, 'package.json'));
  const hasGit = existsSync(join(cwd, '.git'));
  const hasPyproject = existsSync(join(cwd, 'pyproject.toml'));
  const hasRequirements = existsSync(join(cwd, 'requirements.txt'));
  const isLikelyProject = hasPackageJson || hasGit || hasPyproject || hasRequirements;

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useCurrentDir',
      message: `Detected ${isLikelyProject ? 'project' : 'directory'} in current location. Setup here?\n  ${chalk.gray(cwd)}`,
      default: isLikelyProject
    },
    {
      type: 'input',
      name: 'customPath',
      message: 'Enter the absolute path to your project:',
      when: (answers) => !answers.useCurrentDir,
      validate: (input) => {
        if (!input) return 'Please provide a path';
        if (!existsSync(input)) return 'Directory does not exist';
        return true;
      }
    }
  ]);

  return {
    projectPath: answers.useCurrentDir ? cwd : answers.customPath
  };
}

/**
 * Ask about overwriting existing files
 */
export async function askOverwriteConfirmations(projectPath) {
  const claudeMdExists = existsSync(join(projectPath, 'CLAUDE.md'));
  const settingsExists = existsSync(join(projectPath, '.claude', 'settings.json'));
  const rulesExist = existsSync(join(projectPath, '.claude', 'rules'));

  const questions = [];

  if (claudeMdExists) {
    questions.push({
      type: 'confirm',
      name: 'overwriteCLAUDE',
      message: chalk.yellow('CLAUDE.md already exists. Overwrite?'),
      default: false
    });
  }

  if (settingsExists) {
    questions.push({
      type: 'confirm',
      name: 'overwriteSettings',
      message: chalk.yellow('.claude/settings.json already exists. Overwrite?'),
      default: false
    });
  }

  if (rulesExist) {
    questions.push({
      type: 'confirm',
      name: 'overwriteRules',
      message: chalk.yellow('.claude/rules/ already exists. Overwrite?'),
      default: false
    });
  }

  if (questions.length === 0) {
    return { overwriteAll: true };
  }

  const answers = await inquirer.prompt(questions);
  return {
    overwriteCLAUDE: answers.overwriteCLAUDE ?? true,
    overwriteSettings: answers.overwriteSettings ?? true,
    overwriteRules: answers.overwriteRules ?? true
  };
}

/**
 * Ask for wizard mode (Quick/Full/Expert)
 */
export async function askWizardMode(options) {
  // Check for mode flags
  if (options.quick) return 'quick';
  if (options.full) return 'full';
  if (options.expert) return 'expert';

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Configuration mode:',
      choices: [
        formatWizardModeChoice('quick'),
        formatWizardModeChoice('full'),
        formatWizardModeChoice('expert')
      ],
      default: 'full'
    }
  ]);

  return answers.mode;
}

/**
 * Ask for template selection
 * @param {import('./detector.js').StackDetection} detection
 * @param {string} recommended - Recommended template ID
 */
export async function askTemplateSelection(detection, recommended, options) {
  // If template specified via flag, use it
  if (options.template) {
    return options.template;
  }

  const templates = listAvailableTemplates();
  const choices = templates.map(t => formatTemplateChoice(t, recommended));

  // Sort to put recommended first
  choices.sort((a, b) => {
    if (a.value === recommended) return -1;
    if (b.value === recommended) return 1;
    return 0;
  });

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'CLAUDE.md template:',
      choices,
      default: recommended
    }
  ]);

  return answers.template;
}

/**
 * Ask for plugin selection
 * @param {import('./detector.js').StackDetection} detection
 * @param {string} mode - Wizard mode
 */
export async function askPluginSelection(detection, mode, options) {
  // Skip if flag is set
  if (options.skipPlugins) {
    return [];
  }

  const plugins = getRecommendedPlugins(detection, mode);
  const choices = plugins.map(p => formatPluginChoice(p));

  console.log('');
  console.log(chalk.blue('Plugins'));
  console.log(chalk.gray('Official plugins with 5k+ downloads. Use space to select.'));
  console.log('');

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'plugins',
      message: 'Select plugins to install:',
      choices,
      pageSize: 10
    }
  ]);

  return answers.plugins;
}

/**
 * Show summary and ask for final confirmation
 */
export async function askFinalConfirmation(summary) {
  console.log('');
  console.log(chalk.blue('═══════════════════════════════════════'));
  console.log(chalk.blue.bold('  Installation Summary'));
  console.log(chalk.blue('═══════════════════════════════════════'));
  console.log('');

  if (summary.global) {
    console.log(chalk.green('✓ Global config:'));
    console.log(chalk.gray(`  → ~/.claude/settings.json`));
    console.log('');
  }

  if (summary.project) {
    console.log(chalk.green('✓ Project setup:'));
    console.log(chalk.gray(`  → ${summary.projectPath}/.claude/`));
    console.log(chalk.gray(`  → Commands: /research, /plan, /implement`));
    console.log(chalk.gray(`  → Rules: 5 files (vibe-coding, commits, etc)`));
    if (summary.createCLAUDE) {
      console.log(chalk.gray(`  → CLAUDE.md (${summary.template || 'default'} template)`));
    }
    console.log('');
  }

  // Show template info
  if (summary.template) {
    console.log(chalk.green('✓ Template:'));
    console.log(chalk.gray(`  → ${summary.template}`));
    console.log('');
  }

  // Show detection info
  if (summary.detection) {
    console.log(chalk.green('✓ Detected stack:'));
    if (summary.detection.framework) {
      console.log(chalk.gray(`  → Framework: ${summary.detection.framework}`));
    }
    console.log(chalk.gray(`  → Language: ${summary.detection.typescript ? 'TypeScript' : summary.detection.language}`));
    console.log(chalk.gray(`  → Package Manager: ${summary.detection.packageManager}`));
    console.log('');
  }

  // Show plugins
  if (summary.plugins && summary.plugins.length > 0) {
    console.log(chalk.green('✓ Plugins to install:'));
    for (const plugin of summary.plugins) {
      console.log(chalk.gray(`  → ${plugin}`));
    }
    console.log('');
  }

  if (summary.dryRun) {
    console.log(chalk.yellow('DRY RUN MODE - No files will be modified'));
    console.log('');
  }

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: summary.dryRun ? 'Show detailed plan?' : 'Proceed with installation?',
      default: true
    }
  ]);

  return answers.proceed;
}

/**
 * Ask if user wants to skip detection
 */
export async function askSkipDetection(options) {
  if (options.skipDetection) {
    return true;
  }
  return false;
}
