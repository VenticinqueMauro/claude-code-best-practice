import { join } from 'path';
import { existsSync, readdirSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';

// Prompts
import {
  askInstallationType,
  askProjectDirectory,
  askOverwriteConfirmations,
  askFinalConfirmation,
  askWizardMode,
  askTemplateSelection,
  askPluginSelection
} from './prompts.js';

// Utils
import {
  getHomeDir,
  ensureDir,
  copyFile,
  updateGitignore,
  getPackageRoot,
  logInfo,
  validateNodeVersion
} from './utils.js';

// New modules
import { detectStack, displayDetectionSummary, getRecommendedTemplateType } from './detector.js';
import { getRecommendedTemplate, processTemplate } from './templates.js';
import { runWizard } from './wizard.js';
import { installPlugins } from './plugins.js';

/**
 * Main installer function - New 7-step flow
 *
 * 1. Detect Stack (automatic)
 * 2. Select Mode (Quick/Full/Expert)
 * 3. Choose Template (recommended based on detection)
 * 4. Configure CLAUDE.md (interactive questions)
 * 5. Select Plugins (official only)
 * 6. Install (Global + Project + Plugins)
 * 7. Summary (personalized next steps)
 */
export async function runInstaller(options) {
  // Validate Node.js version
  try {
    validateNodeVersion('18.0.0');
  } catch (error) {
    console.error(chalk.red('✗'), error.message);
    process.exit(1);
  }

  const dryRun = options.dryRun || false;
  const autoYes = options.yes || false;

  if (dryRun) {
    logInfo('Running in DRY RUN mode - no files will be modified');
    console.log('');
  }

  // Step 1: Ask what to install (global, project, or both)
  let installType;
  if (autoYes) {
    if (options.projectOnly) {
      installType = 'project';
    } else if (options.globalOnly) {
      installType = 'global';
    } else {
      installType = 'both'; // Default to both when --yes is used
    }
  } else {
    const answer = await askInstallationType(options);
    installType = answer.installType;
  }

  const shouldInstallGlobal = installType === 'global' || installType === 'both';
  const shouldInstallProject = installType === 'project' || installType === 'both';

  // Initialize summary
  const summary = {
    global: shouldInstallGlobal,
    project: shouldInstallProject,
    projectPath: null,
    createCLAUDE: false,
    template: null,
    detection: null,
    wizardData: null,
    plugins: [],
    dryRun
  };

  // Variables for project setup
  let projectPath = null;
  let detection = null;
  let wizardMode = 'full';
  let templateType = 'minimal';
  let wizardData = null;
  let selectedPlugins = [];
  let overwriteOptions = { overwriteAll: true };

  // Project-specific steps
  if (shouldInstallProject) {
    // Get project path
    const projectAnswers = autoYes
      ? { projectPath: options.projectPath || process.cwd() }
      : await askProjectDirectory(options);

    projectPath = projectAnswers.projectPath;
    summary.projectPath = projectPath;
    summary.createCLAUDE = !existsSync(join(projectPath, 'CLAUDE.md'));

    // STEP 1: Auto-detect stack (unless skipped)
    if (!options.skipDetection) {
      const spinner = ora('Detecting project stack...').start();
      try {
        detection = await detectStack(projectPath);
        spinner.succeed('Stack detected');
        displayDetectionSummary(detection);
        summary.detection = detection;
      } catch (error) {
        spinner.warn('Could not detect stack, using defaults');
        detection = {
          projectName: 'my-project',
          framework: null,
          typescript: false,
          packageManager: 'npm',
          testFramework: null,
          database: null,
          styling: null,
          auth: null,
          language: 'javascript',
          confidence: 0
        };
      }
    } else {
      detection = {
        projectName: 'my-project',
        framework: null,
        typescript: false,
        packageManager: 'npm',
        testFramework: null,
        database: null,
        styling: null,
        auth: null,
        language: 'javascript',
        confidence: 0
      };
    }

    // STEP 2: Select wizard mode (unless auto-yes)
    if (!autoYes) {
      wizardMode = await askWizardMode(options);
    } else {
      wizardMode = options.quick ? 'quick' : options.expert ? 'expert' : 'full';
    }

    // STEP 3: Choose template
    const recommendedTemplate = getRecommendedTemplate(detection);
    if (!autoYes) {
      templateType = await askTemplateSelection(detection, recommendedTemplate, options);
    } else {
      templateType = options.template || recommendedTemplate;
    }
    summary.template = templateType;

    // STEP 4: Run wizard to configure CLAUDE.md
    if (!autoYes) {
      wizardData = await runWizard(wizardMode, detection);
      summary.wizardData = wizardData;
    } else {
      // Use detection data for auto mode
      wizardData = {
        projectName: detection.projectName,
        description: `A ${detection.framework || 'project'}`,
        framework: detection.framework,
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

    // STEP 5: Select plugins (unless skipped or auto-yes)
    if (!autoYes && !options.skipPlugins) {
      selectedPlugins = await askPluginSelection(detection, wizardMode, options);
      summary.plugins = selectedPlugins;
    }

    // Ask about overwrites if not auto-yes
    if (!autoYes && !dryRun) {
      overwriteOptions = await askOverwriteConfirmations(projectPath);
    }
  }

  // STEP 6: Show summary and ask for confirmation
  if (!autoYes) {
    const proceed = await askFinalConfirmation(summary);
    if (!proceed) {
      console.log(chalk.yellow('\nInstallation cancelled.'));
      process.exit(0);
    }
  }

  console.log('');

  // STEP 6: Install
  // Install global config
  if (shouldInstallGlobal) {
    await installGlobalConfig(dryRun);
  }

  // Install project setup
  if (shouldInstallProject) {
    await installProjectSetup(
      projectPath,
      overwriteOptions,
      dryRun,
      templateType,
      wizardData
    );
  }

  // Install plugins
  if (selectedPlugins.length > 0 && !dryRun) {
    console.log('');
    const pluginResults = await installPlugins(selectedPlugins);

    if (pluginResults.failed.length > 0) {
      console.log('');
      console.log(chalk.yellow('Some plugins failed to install:'));
      for (const failed of pluginResults.failed) {
        console.log(chalk.gray(`  • ${failed}`));
      }
      console.log(chalk.gray('You can install them manually with: npx claude-plugins install <plugin-id>'));
    }
  }

  // STEP 7: Show next steps
  showNextSteps(shouldInstallGlobal, shouldInstallProject, projectPath, dryRun, selectedPlugins, wizardData);
}

/**
 * Install global configuration
 */
async function installGlobalConfig(dryRun) {
  const spinner = ora('Installing global configuration...').start();

  try {
    const homeDir = getHomeDir();
    const claudeDir = join(homeDir, '.claude');
    const settingsPath = join(claudeDir, 'settings.json');
    const packageRoot = getPackageRoot();
    const templatePath = join(packageRoot, 'templates', 'global-settings.json');

    // Check if template exists
    if (!existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    ensureDir(claudeDir, dryRun);

    const existed = existsSync(settingsPath);

    if (!dryRun) {
      copyFile(templatePath, settingsPath, dryRun);
    }

    spinner.succeed(
      existed
        ? 'Global config updated: ~/.claude/settings.json'
        : 'Global config created: ~/.claude/settings.json'
    );
  } catch (error) {
    spinner.fail('Failed to install global config');
    throw error;
  }
}

/**
 * Install project setup with template processing
 */
async function installProjectSetup(projectPath, overwriteOptions, dryRun, templateType, wizardData) {
  const spinner = ora(`Setting up project: ${projectPath}`).start();

  try {
    const packageRoot = getPackageRoot();
    const templatesDir = join(packageRoot, 'templates');

    // Create .claude directory structure
    const claudeDir = join(projectPath, '.claude');
    const commandsDir = join(claudeDir, 'commands', 'rpi');
    const rulesDir = join(claudeDir, 'rules');
    const plansDir = join(projectPath, 'rpi', 'plans');

    spinner.text = 'Creating directory structure...';
    ensureDir(commandsDir, dryRun);
    ensureDir(rulesDir, dryRun);
    ensureDir(plansDir, dryRun);

    // Copy project settings
    spinner.text = 'Copying configuration files...';
    const settingsTemplate = join(templatesDir, 'project-settings.json');
    const settingsDest = join(claudeDir, 'settings.json');

    if (overwriteOptions.overwriteSettings || !existsSync(settingsDest)) {
      copyFile(settingsTemplate, settingsDest, dryRun);
    }

    // Copy RPI commands
    spinner.text = 'Copying RPI commands...';
    const commandsTemplate = join(templatesDir, 'commands', 'rpi');
    const commandFiles = ['research.md', 'plan.md', 'implement.md'];

    for (const cmdFile of commandFiles) {
      const src = join(commandsTemplate, cmdFile);
      const dest = join(commandsDir, cmdFile);
      if (existsSync(src)) {
        copyFile(src, dest, dryRun);
      }
    }

    // Copy rules
    spinner.text = 'Copying code rules...';
    if (overwriteOptions.overwriteRules || !existsSync(rulesDir) || readdirSync(rulesDir).length === 0) {
      const rulesTemplate = join(templatesDir, 'rules');
      const ruleFiles = ['vibe-coding.md', 'micro-tasks.md', 'commits.md', 'nextjs.md', 'context.md'];

      for (const ruleFile of ruleFiles) {
        const src = join(rulesTemplate, ruleFile);
        const dest = join(rulesDir, ruleFile);
        if (existsSync(src)) {
          copyFile(src, dest, dryRun);
        }
      }
    }

    // Generate CLAUDE.md from template
    spinner.text = 'Creating CLAUDE.md...';
    const claudeMdDest = join(projectPath, 'CLAUDE.md');

    if (overwriteOptions.overwriteCLAUDE || !existsSync(claudeMdDest)) {
      try {
        // Process template with wizard data
        const claudeMdContent = processTemplate(templateType, wizardData || {});

        if (!dryRun) {
          writeFileSync(claudeMdDest, claudeMdContent, 'utf8');
        }
      } catch (templateError) {
        // Fallback to default template if processing fails
        spinner.text = 'Using fallback template...';
        const claudeMdTemplate = join(templatesDir, 'project-CLAUDE.md');
        if (existsSync(claudeMdTemplate)) {
          copyFile(claudeMdTemplate, claudeMdDest, dryRun);
        }
      }
    }

    // Update .gitignore
    spinner.text = 'Updating .gitignore...';
    const gitignoreResult = updateGitignore(projectPath, dryRun);

    spinner.succeed(`Project setup complete: ${projectPath}`);

    // Show what was installed
    console.log(chalk.gray('  ✓ .claude/settings.json'));
    console.log(chalk.gray('  ✓ .claude/commands/rpi/ (3 commands)'));
    console.log(chalk.gray('  ✓ .claude/rules/ (5 rules)'));
    if (overwriteOptions.overwriteCLAUDE || !existsSync(claudeMdDest)) {
      console.log(chalk.gray(`  ✓ CLAUDE.md (${templateType} template)`));
    }
    if (gitignoreResult.updated) {
      console.log(chalk.gray('  ✓ .gitignore updated'));
    }
  } catch (error) {
    spinner.fail('Failed to setup project');
    throw error;
  }
}

/**
 * Show next steps after installation
 */
function showNextSteps(installedGlobal, installedProject, projectPath, dryRun, plugins = [], wizardData = null) {
  if (dryRun) {
    console.log('');
    console.log(chalk.yellow('═══════════════════════════════════════'));
    console.log(chalk.yellow.bold('  DRY RUN COMPLETE'));
    console.log(chalk.yellow('═══════════════════════════════════════'));
    console.log('');
    console.log('No files were modified. Run without --dry-run to install.');
    return;
  }

  console.log('');
  console.log(chalk.blue('╭──────────────────────────────────────────╮'));
  console.log(chalk.blue('│  ') + chalk.bold('Installation Complete!') + '                     ' + chalk.blue('│'));
  console.log(chalk.blue('╰──────────────────────────────────────────╯'));
  console.log('');

  if (installedProject) {
    console.log(chalk.yellow.bold('Next Steps:'));
    console.log('');
    console.log(chalk.white('  1. Review and customize CLAUDE.md:'));
    console.log(chalk.gray(`     cd ${projectPath}`));
    console.log(chalk.gray('     code CLAUDE.md  # or your preferred editor'));
    console.log('');
    console.log(chalk.white('  2. Start Claude Code:'));
    console.log(chalk.gray('     claude'));
    console.log('');
    console.log(chalk.white('  3. Try the RPI workflow:'));
    console.log(chalk.gray('     /research <feature-description>'));
    console.log(chalk.gray('     /plan'));
    console.log(chalk.gray('     /implement'));
    console.log('');
  }

  // Show plugin info
  if (plugins.length > 0) {
    console.log(chalk.yellow.bold('Installed Plugins:'));
    for (const plugin of plugins) {
      console.log(chalk.gray(`  • ${plugin}`));
    }
    console.log('');
  }

  console.log(chalk.yellow.bold('Useful Commands:'));
  console.log(chalk.gray('  /config          → View/edit configuration'));
  console.log(chalk.gray('  /memory          → View memory files'));
  console.log(chalk.gray('  /help            → Show all commands'));
  console.log('');

  // Show personalized tip based on detection
  if (wizardData && wizardData.framework) {
    console.log(chalk.yellow.bold(`${wizardData.framework} Tips:`));
    if (wizardData.framework === 'Next.js' || wizardData.framework === 'nextjs') {
      console.log(chalk.gray('  • Use Server Components by default'));
      console.log(chalk.gray('  • Run npx tsc --noEmit before commits'));
    } else if (wizardData.framework === 'Express.js' || wizardData.framework === 'express') {
      console.log(chalk.gray('  • Follow routes → controllers → services pattern'));
      console.log(chalk.gray('  • Use centralized error handling'));
    }
    console.log('');
  }

  console.log(chalk.blue('Documentation:'));
  console.log(chalk.gray('  https://github.com/VenticinqueMauro/claude-code-best-practice'));
  console.log('');
  console.log(chalk.green('✅ Setup completed successfully!'));
}
