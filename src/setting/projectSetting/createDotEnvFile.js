import fs from 'fs';
import chalk from 'chalk';
import { promisify } from 'util';
import path from 'path';

const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

const createDotEnvFile = async (options, sourceApiTargetDirectory) => {
  const [apiPort, uiPort] = options.ports;

  try {
    await writeFile(
      path.join(`${sourceApiTargetDirectory}`, '.env'),
      options.database === 'none'
        ? `PORT=${apiPort}`
        : options.database === 'mysql'
        ? `PORT=${apiPort}\nNODE_ENV=developpment\nMYSQL_HOST=\nMYSQL_USER=\nMYSQL_PASSWORD=\nMYSQL_DATABASE=`
        : `PORT=${apiPort}\nNODE_ENV=developpment\nMONGO_URI=`,
      err => {
        if (err) console.log(err);
        console.log(chalk.green.bold('Success'), '.env created, OK');
      }
    );

    if (uiPort !== '3000') {
      await writeFile(
        path.join(
          `${options.targetDirectory}/${options.projectName}/ui/src`,
          '.env'
        ),
        `PORT=${uiPort}`,
        err => {
          if (err) console.log(err);
          console.log(chalk.green.bold('Success'), '.env created, OK');
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export { createDotEnvFile };
