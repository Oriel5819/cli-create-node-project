import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const settingDatabase = async (
  projectName,
  targetDirectoryRoutes,
  databaseType
) => {
  try {
    await writeFile(
      path.join(`${targetDirectoryRoutes}`, `databaseConnect.ts`),
      databaseType === 'mysql'
        ? `import { Response } from "express";
        import { createPool } from "mysql2";
import {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} from "../config/constants";

const pool = createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
}).promise();

export { pool };\n`
        : databaseType === 'none'
        ? `\n`
        : `import { connect } from "mongoose";
import { MONGO_URI } from "../config/constants";

const databaseConnection = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await connect(MONGO_URI as string, {
        dbName: ${projectName},
      });

      if (connection) {
        console.log(\`Connected to \${MONGO_URI}\`);
        resolve(connection);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export { databaseConnection };

\n`
    );
  } catch (error) {
    console.log(error);
  }
};

export { settingDatabase };
