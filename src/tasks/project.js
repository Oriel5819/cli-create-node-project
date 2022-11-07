import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { execa } from 'execa';
import { Listr } from 'listr2';
import { projectInstall } from 'pkg-install';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { createProjectFolders } from '../setting/projectSetting/creatingProjectFolders.js';
import { copyTemplateFiles } from '../setting/projectSetting/copyTemplateFiles.js';
import { createDotEnvFile } from '../setting/projectSetting/createDotEnvFile.js';
import { createApiConstantsFile } from '../setting/projectSetting/createApiConstantsFile.js';
import { settingRoutes } from '../setting/projectSetting/settingRoutes.js';
import { settingControllers } from '../setting/projectSetting/settingControllers.js';
import { settingQueries } from '../setting/projectSetting/settingQueries.js';
import { settingModels } from '../setting/projectSetting/settingModels.js';
import { settingDatabase } from '../setting/projectSetting/settingDatabase.js';
import { creatingAppTS } from '../setting/projectSetting/creatingAppTS.js';
import {
  editPackage,
  editTypescriptConfig,
} from '../setting/projectSetting/editApiFiles.js';

const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);

const checkTemplateName = async templateName => {
  try {
    await access(templateName, fs.constants.R_OK);
  } catch (error) {
    console.error('%s Invalid template name', chalk.red.bold('Error'));
    process.exit(1);
  }
};

const checkDatabaseType = async databaseType => {
  if (
    databaseType === 'mongo' ||
    databaseType === 'mongodb' ||
    databaseType === 'mysql' ||
    databaseType === 'none'
  )
    return true;
  else {
    console.error('%s Invalid database name', chalk.red.bold('Error'));
  }
};

const initializingGit = async (options, targetDirectory) => {
  try {
    const result = await execa('git', ['init'], {
      cwd: targetDirectory,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const initializingNode = async (options, targetDirectory) => {
  try {
    let result = await execa('npm', ['init', '--yes'], {
      cwd: targetDirectory,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const initializingDependencies = async (options, targetDirectory) => {
  try {
    let result;
    if (options.database === 'mongo' || options.database === 'mongodb') {
      result = await execa(
        'npm',
        [
          'install',
          '--save',
          'express',
          'cors',
          'helmet',
          'dotenv',
          'mongoose',
          'consola',
          'nodemon',
          'pm2',
        ],
        {
          cwd: targetDirectory,
        }
      );
    } else if (options.database === 'mysql') {
      result = await execa(
        'npm',
        [
          'install',
          '--save',
          'express',
          'cors',
          'helmet',
          'dotenv',
          'mysql2',
          'consola',
          'nodemon',
          'pm2',
        ],
        {
          cwd: targetDirectory,
        }
      );
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

const initializingTypescriptDependencies = async (options, targetDirectory) => {
  try {
    let result;
    if (
      (options.language === 'TypeScript' && options.database === 'mongo') ||
      options.database === 'mongodb'
    ) {
      result = await execa(
        'npm',
        [
          'install',
          '--save-dev',
          'typescript@latest',
          'ts-node@latest',
          '@types/node',
          '@types/express',
          '@types/cors',
          '@types/mongoose',
        ],
        {
          cwd: targetDirectory,
        }
      );
    } else if (
      options.language === 'TypeScript' &&
      options.database === 'mysql'
    ) {
      result = await execa(
        'npm',
        [
          'install',
          '--save-dev',
          'typescript@latest',
          'ts-node@latest',
          '@types/node',
          '@types/express',
          '@types/cors',
        ],
        {
          cwd: targetDirectory,
        }
      );
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

const initializingTypescriptTSConfig = async (options, targetDirectory) => {
  try {
    if (options.language === 'TypeScript') {
      const result = await execa('tsc', ['--init'], {
        cwd: targetDirectory,
      });
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

const createProjectProcess = async options => {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../../../templates',
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  const targetDirectory = `${options.targetDirectory}/${options.projectName}`;
  const apiTargetDirectory = `${options.targetDirectory}/${options.projectName}/api`;
  const sourceApiTargetDirectory = `${options.targetDirectory}/${options.projectName}/api/src`;
  const routesApiTargetDirectory = `${options.targetDirectory}/${options.projectName}/api/src/routes`;
  const controllersApiTargetDirectory = `${options.targetDirectory}/${options.projectName}/api/src/controllers`;
  const queriesApiTargetDirectory = `${options.targetDirectory}/${options.projectName}/api/src/queries`;
  const modelsApiTargetDirectory = `${options.targetDirectory}/${options.projectName}/api/src/models`;
  const databaseApiTargetDirectory = `${options.targetDirectory}/${options.projectName}/api/src/database`;

  const tasks = new Listr(
    [
      {
        title: 'Check template existance',
        task: async () => await checkTemplateName(options.templateDirectory),
      },
      {
        title: 'Check database type existance',
        task: async () => await checkDatabaseType(options.database),
      },
      {
        title: 'Create project folder',
        task: async () => await createProjectFolders(options),
      },
      {
        title: 'Initializing git',
        task: async () => await initializingGit(options, targetDirectory),
        enabled: () => options.git || options.skipPrompts,
      },
      {
        title: 'Copy Template file',
        task: async () => await copyTemplateFiles(options),
      },
      {
        title: 'Configurating api file',
        task: (_, tasks) =>
          tasks.newListr(
            [
              {
                title: 'Configuring dotenv files.',
                task: async () => {
                  await createDotEnvFile(options, sourceApiTargetDirectory);
                },
              },
              {
                title: 'Configuring constant.ts file',
                task: async () => {
                  await createApiConstantsFile(options);
                },
              },
              {
                title: 'Configuring routes',
                task: async () => {
                  await settingRoutes(options, routesApiTargetDirectory);
                },
              },
              {
                title: 'Configuring controllers',
                task: async () => {
                  await settingControllers(
                    options,
                    controllersApiTargetDirectory
                  );
                },
              },
              {
                title: 'Configuring queries',
                task: async () => {
                  await settingQueries(options, queriesApiTargetDirectory);
                },
              },
              {
                title: 'Configuring models',
                task: async () => {
                  await settingModels(options, modelsApiTargetDirectory);
                },
              },
              {
                title: 'Configuring database',
                task: async () => {
                  await settingDatabase(options, databaseApiTargetDirectory);
                },
              },
              {
                title:
                  options.language === 'TypeScript'
                    ? 'Creating app.ts'
                    : 'Creating app.js',
                task: async () => {
                  await creatingAppTS(options, sourceApiTargetDirectory);
                },
              },
            ],
            { concurrent: false }
          ),
      },
      {
        title: 'Initializing node',
        task: async () => await initializingNode(options, apiTargetDirectory),
      },
      {
        title: 'Initializing Dependencies',
        task: async () =>
          await initializingDependencies(options, apiTargetDirectory),
      },
      {
        title: 'Initializing Typescript Dependencies',
        task: async () =>
          await initializingTypescriptDependencies(options, apiTargetDirectory),
        enabled: () => options.language === 'TypeScript',
      },
      {
        title: 'Initializing Typescript ts.config',
        task: async () =>
          await initializingTypescriptTSConfig(options, apiTargetDirectory),
        enabled: () => options.language === 'TypeScript',
      },
      {
        title: 'Install dependencies',
        task: async () => await projectInstall({ cwd: apiTargetDirectory }),
        skip: () =>
          !options.runInstall
            ? 'Pass --install to automatically install dependencies'
            : undefined,
      },
      {
        title: 'Editing Scripts package json files',
        task: async () => await editPackage(options, apiTargetDirectory),
      },
      {
        title: 'Editing rootDir package json files',
        task: async () =>
          await editTypescriptConfig(options, apiTargetDirectory),
        enabled: () => options.language === 'TypeScript',
      },
    ],
    { concurrent: false }
  );

  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
};

export { createProjectProcess };
