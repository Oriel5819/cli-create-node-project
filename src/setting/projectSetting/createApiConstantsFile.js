import fs from 'fs';
import chalk from 'chalk';
import { promisify } from 'util';
import path from 'path';

const writeFile = promisify(fs.writeFile);

const createApiConstantsFile = async options => {
  try {
    await writeFile(
      path.join(
        `${options.targetDirectory}/${options.projectName}/api/src/config`,
        'constants.ts'
      ),
      options.database === 'none'
        ? `import { config } from "dotenv";
        config({ path: "./src/.env" });
        const { PORT, NODE_ENV } = process.env;
        export { PORT, NODE_ENV };`
        : options.database === 'mysql'
        ? `import { config } from "dotenv";
        config({ path: "./src/.env" });
        const { PORT, MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } =
          process.env;
        export { PORT, MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE };`
        : `import { config } from "dotenv";
        config({ path: "./src/.env" });
        const { PORT, NODE_ENV, MONGO_URI } =
          process.env;
        export { PORT, NODE_ENV, MONGO_URI };`,
      err => {
        if (err) console.log(err);
        console.log(chalk.green.bold('Success'), 'constants.ts created, OK');
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export { createApiConstantsFile };
