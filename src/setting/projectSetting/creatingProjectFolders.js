import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const createProjectFolders = async options => {
  try {
    if (options.projectName) {
      const projectFolder = `${options.targetDirectory}/${options.projectName}`;
      const apiProjectFolder = `${options.targetDirectory}/${options.projectName}/${options.projectName}-api`;
      const srcApiProjectFolder = `${options.targetDirectory}/${options.projectName}/${options.projectName}-api/src`;

      fs.mkdirSync(
        path.join(options.targetDirectory, `${options.projectName}`)
      );

      fs.mkdirSync(path.join(projectFolder, `${options.projectName}-api`));
      fs.mkdirSync(path.join(projectFolder, `${options.projectName}-client`));

      fs.mkdirSync(path.join(apiProjectFolder, `src`));

      fs.mkdirSync(path.join(srcApiProjectFolder, `config`));
      fs.mkdirSync(path.join(srcApiProjectFolder, `database`));
      fs.mkdirSync(path.join(srcApiProjectFolder, `controllers`));
      fs.mkdirSync(path.join(srcApiProjectFolder, `routes`));
      fs.mkdirSync(path.join(srcApiProjectFolder, `models`));
      fs.mkdirSync(path.join(srcApiProjectFolder, `queries`));
    }
    return {
      ...options,
      targetDirectory: `${options.targetDirectory}/${options.projectName}`,
    };
  } catch (error) {
    console.error(chalk.red.bold('Error'), error.message);
    process.exit(1);
  }
};

export { createProjectFolders };
