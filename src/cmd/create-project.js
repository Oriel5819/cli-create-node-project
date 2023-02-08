import inquirer from 'inquirer';
import arg from 'arg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const parseCreateProjectArgumentIntoOptions = rawArgs => {
  const args = arg(
    {
      '--language': String,
      '--template': String,
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '--models': String,
      '--ports': String,
      '--database': String,
      '-l': '--language',
      '-t': '--template',
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
      '-m': '--models',
      '-p': '--ports',
      '-d': '--database',
    },
    { argv: rawArgs.slice(2) }
  );

  return {
    projectName: args._[0],
    language: args['--language'],
    template: args['--template'],
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    runInstall: args['--install'] || false,
    ports: args['--ports'] ? args['--ports'].split(':') : ['5000', '3000'],
    models: args['--models'] ? args['--models'].split('-') : null,
    database: args['--database'],
  };
};

const promptForMissingOptions = async options => {
  const defaultLanguage = 'JavaScript';
  const defaultTemplate = 'simple-crud';
  const defaultDatabase = 'mongo';
  if (options.skipPrompts) {
    return {
      ...options,
      language: options.language || defaultLanguage,
      template: options.template || defaultTemplate,
      database: options.database || defaultDatabase,
    };
  }
  const questions = [];
  const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
  const CHOICES = fs.readdirSync(`${DIRNAME}/../../templates`); // read rirectory

  if (!options.projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Please give a name to your project',
      validate: input => {
        if (input === '') return 'Please, enter a project name.';
        if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
        else
          return 'Project name may only include letters, numbers, underscores and hashes.';
      },
    });
  }

  if (!options.language) {
    questions.push({
      type: 'list',
      name: 'language',
      message: 'Please choose which programming language to use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultLanguage,
    });
  }

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: CHOICES,
      default: defaultTemplate,
    });
  }

  if (!options.database) {
    questions.push({
      type: 'list',
      name: 'database',
      message: 'Please choose which project database to use',
      choices: ['mongo', 'mysql', 'none'],
      default: defaultDatabase,
    });
  }

  if (!options.models) {
    questions.push({
      type: 'input',
      name: 'models',
      message:
        'Leave models empty? Either enter some model names. Use dash (-) as name separator',
    });
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false,
    });
  }

  if (!options.runInstall) {
    questions.push({
      type: 'confirm',
      name: 'runInstall',
      message: 'installing automatically dependecies?',
      default: false,
    });
  }
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    projectName: options.projectName || answers.projectName,
    language: options.language || answers.language,
    template: options.template || answers.template,
    git: options.git || answers.git,
    database: options.database || answers.database,
    models: options.models
      ? options.models
      : answers.models === ''
      ? null
      : answers.models.split('-'),
    runInstall: options.runInstall || answers.runInstall,
  };
};

export { parseCreateProjectArgumentIntoOptions, promptForMissingOptions };
