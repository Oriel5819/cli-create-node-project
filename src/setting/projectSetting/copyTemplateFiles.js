import ncp from 'ncp';
import { promisify } from 'util';

const copy = promisify(ncp);

const copyTemplateFiles = options => {
  try {
    const targetDirectory = `${options.targetDirectory}/${options.projectName}`;
    return copy(options.templateDirectory, targetDirectory, {
      clobber: false,
    });
  } catch (error) {
    console.error(
      chalk.red.bold('Error'),
      'Error ocurred while copying template file.'
    );
    process.exit(1);
  }
};

export { copyTemplateFiles };
