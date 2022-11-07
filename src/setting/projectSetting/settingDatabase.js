import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const settingDatabase = async (options, targetDirectoryRoutes) => {
  try {
    await writeFile(
      path.join(
        `${targetDirectoryRoutes}`,
        `databaseConnect.${options.language === 'TypeScript' ? 'ts' : 'js'}`
      ),
      options.database === 'mysql'
        ? ` ${
            options.language === 'TypeScript'
              ? 'import { Response } from "express";'
              : ''
          } 
        import { createPool } from "mysql2";
import {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} from "../config/constants${options.language === 'TypeScript' ? '' : '.js'}";

const pool = createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
}).promise();

export { pool };\n`
        : options.database.includes('mongo')
        ? `import { connect } from "mongoose";
import {
  MONGO_URI
} from "../config/constants${options.language === 'TypeScript' ? '' : '.js'}";

const databaseConnection = () => {
    connect(${
      options.language === 'TypeScript'
        ? 'MONGO_URI as string'
        : 'string(MONGO_URI)'
    }, {})
  .then(() => console.log(\`Connected to \${MONGO_URI}\`))
  .catch((error${
    options.language === 'TypeScript' ? ': any' : ''
  }) => console.log(error.message));
}

export {databaseConnection}

\n`
        : `\n`
    );
  } catch (error) {
    console.log(error);
  }
};

export { settingDatabase };
