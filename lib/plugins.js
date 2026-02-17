import { spawn } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Approved plugins list
 * Criteria: Official plugins or 5k+ downloads
 */
export const APPROVED_PLUGINS = [
  {
    id: '@anthropics/claude-code-plugins/frontend-design',
    name: 'Frontend Design',
    author: '@anthropics',
    downloads: '65k+',
    description: 'Production-grade UI components and design systems',
    tags: ['frontend', 'ui', 'design', 'react', 'nextjs'],
    recommended: ['nextjs', 'react', 'react-vite', 'react-cra', 'vue', 'svelte']
  },
  {
    id: '@anthropics/claude-code-plugins/feature-dev',
    name: 'Feature Development',
    author: '@anthropics',
    downloads: '65k+',
    description: 'Complete workflow for feature implementation',
    tags: ['workflow', 'development', 'planning'],
    recommended: ['all']
  },
  {
    id: '@anthropics/claude-code-plugins/code-review',
    name: 'Code Review',
    author: '@anthropics',
    downloads: '65k+',
    description: 'Automated code review and quality checks',
    tags: ['review', 'quality', 'best-practices'],
    recommended: ['all']
  },
  {
    id: '@EveryInc/every-marketplace/compound-engineering',
    name: 'Compound Engineering',
    author: '@EveryInc',
    downloads: '8.9k',
    description: '29 specialized agents for advanced development workflows',
    tags: ['agents', 'advanced', 'workflow'],
    recommended: ['expert']
  }
];

/**
 * Get recommended plugins based on stack detection
 * @param {import('./detector.js').StackDetection} detection - Detection result
 * @param {string} mode - Wizard mode (quick, full, expert)
 * @returns {Array} List of recommended plugins with isRecommended flag
 */
export function getRecommendedPlugins(detection, mode = 'full') {
  const framework = detection.framework;

  return APPROVED_PLUGINS.map(plugin => {
    let isRecommended = false;

    // Check if plugin is recommended for this framework
    if (plugin.recommended.includes('all')) {
      isRecommended = true;
    } else if (plugin.recommended.includes('expert') && mode === 'expert') {
      isRecommended = true;
    } else if (framework && plugin.recommended.includes(framework)) {
      isRecommended = true;
    }

    // Frontend plugins are recommended for frontend frameworks
    if (plugin.tags.includes('frontend')) {
      const frontendFrameworks = ['nextjs', 'react', 'react-vite', 'react-cra', 'vue', 'nuxt', 'svelte', 'sveltekit', 'astro'];
      if (frontendFrameworks.includes(framework)) {
        isRecommended = true;
      }
    }

    return {
      ...plugin,
      isRecommended
    };
  });
}

/**
 * Install a plugin using npx claude-plugins install
 * @param {string} pluginId - Plugin ID to install
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function installPlugin(pluginId) {
  return new Promise((resolve) => {
    const spinner = ora(`Installing ${pluginId}...`).start();

    // Use npx to run claude-plugins install command
    const child = spawn('npx', ['claude-plugins', 'install', pluginId], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        spinner.succeed(`Installed ${pluginId}`);
        resolve({ success: true, message: stdout });
      } else {
        spinner.fail(`Failed to install ${pluginId}`);
        resolve({ success: false, message: stderr || stdout });
      }
    });

    child.on('error', (error) => {
      spinner.fail(`Failed to install ${pluginId}`);
      resolve({ success: false, message: error.message });
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      child.kill();
      spinner.fail(`Installation timed out for ${pluginId}`);
      resolve({ success: false, message: 'Installation timed out' });
    }, 60000);
  });
}

/**
 * Install multiple plugins
 * @param {string[]} pluginIds - Array of plugin IDs to install
 * @returns {Promise<{installed: string[], failed: string[]}>}
 */
export async function installPlugins(pluginIds) {
  const results = {
    installed: [],
    failed: []
  };

  console.log('');
  console.log(chalk.blue('Installing plugins...'));
  console.log('');

  for (const pluginId of pluginIds) {
    const result = await installPlugin(pluginId);
    if (result.success) {
      results.installed.push(pluginId);
    } else {
      results.failed.push(pluginId);
    }
  }

  return results;
}

/**
 * Display available plugins
 * @param {Array} plugins - List of plugins (with isRecommended flag)
 */
export function displayPlugins(plugins) {
  console.log('');
  console.log(chalk.blue('╭──────────────────────────────────────────╮'));
  console.log(chalk.blue('│  ') + chalk.bold('Available Plugins') + '                        ' + chalk.blue('│'));
  console.log(chalk.blue('╰──────────────────────────────────────────╯'));
  console.log('');

  for (const plugin of plugins) {
    const recommended = plugin.isRecommended ? chalk.green(' (Recommended)') : '';
    console.log(`  ${chalk.white.bold(plugin.name)}${recommended}`);
    console.log(`  ${chalk.gray(plugin.description)}`);
    console.log(`  ${chalk.gray(`by ${plugin.author} • ${plugin.downloads} downloads`)}`);
    console.log('');
  }
}

/**
 * Format plugin for inquirer checkbox
 * @param {Object} plugin - Plugin object
 * @returns {Object} Inquirer choice object
 */
export function formatPluginChoice(plugin) {
  const badge = plugin.isRecommended ? chalk.green(' ★') : '';
  const downloads = chalk.gray(` (${plugin.downloads})`);

  return {
    name: `${plugin.name}${badge}${downloads} - ${plugin.description}`,
    value: plugin.id,
    short: plugin.name,
    checked: plugin.isRecommended
  };
}

/**
 * Get plugin by ID
 * @param {string} pluginId - Plugin ID
 * @returns {Object|null} Plugin object or null
 */
export function getPluginById(pluginId) {
  return APPROVED_PLUGINS.find(p => p.id === pluginId) || null;
}

/**
 * Check if plugin is approved
 * @param {string} pluginId - Plugin ID
 * @returns {boolean}
 */
export function isApprovedPlugin(pluginId) {
  return APPROVED_PLUGINS.some(p => p.id === pluginId);
}
