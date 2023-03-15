import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const settingQueries = async (options, targetDirectoryRoutes) => {
  try {
    switch (options.database) {
      case 'mysql':
        options.models.map(async model => {
          await writeFile(
            path.join(
              `${targetDirectoryRoutes}`,
              `${model}.queries.${
                options.language === 'TypeScript' ? 'ts' : 'js'
              }`
            ),
            `${
              options.language === 'TypeScript'
                ? 'import { ResultSetHeader, RowDataPacket } from "mysql2";'
                : ''
            } 
import { pool } from "../database/databaseConnect${
              options.language === 'TypeScript' ? '' : '.js'
            }";

const select${model.charAt(0).toUpperCase() + model.slice(1)}s = async () => {
  const [rows] = await pool.query${
    options.language === 'TypeScript' ? '<ResultSetHeader>' : ''
  }(
    \`SELECT * FROM ${model}\`
  );
  return rows;
};

const select${model.charAt(0).toUpperCase() + model.slice(1)} = async (id${
              options.language === 'TypeScript' ? ': string' : ''
            }) => {
  const [rows] = await pool.query${
    options.language === 'TypeScript' ? '<RowDataPacket[]>' : ''
  }(
    \`SELECT * FROM ${model} WHERE id = ?\`,
    [id]
  );
  return rows[0];
};

const insert${model.charAt(0).toUpperCase() + model.slice(1)} = async (
  /* attributes */
) => {
  const [result] = await pool.query ${
    options.language === 'TypeScript' ? '<ResultSetHeader>' : ''
  }(
    \`   INSERT INTO ${model} (/* columns */)
        VALUES (?, ?, ?, ?, ?)
      \`,
    [ /* attributes */]
  );

  return result.affectedRows;
};

const update${model.charAt(0).toUpperCase() + model.slice(1)} = async (
  /* attributes */
  id${options.language === 'TypeScript' ? ': string' : ''}
) => {
  const [result] = await pool.query${
    options.language === 'TypeScript' ? '<ResultSetHeader>' : ''
  }(
    \`
    UPDATE ${model} 
    SET /* columns = ? */
    WHERE id = ?
  \`,
    [/* attributes */, id]
  );
  return result.affectedRows;
};

const delete${model.charAt(0).toUpperCase() + model.slice(1)} = async (id${
              options.language === 'TypeScript' ? ': string' : ''
            }) => {
  const [result] = await pool.query${
    options.language === 'TypeScript' ? '<ResultSetHeader>' : ''
  }(
    \`DELETE FROM ${model} WHERE id = ?\`,
    [id]
  );
  return result.affectedRows;
};

export {
  select${model.charAt(0).toUpperCase() + model.slice(1)}s,
  select${model.charAt(0).toUpperCase() + model.slice(1)},
  insert${model.charAt(0).toUpperCase() + model.slice(1)},
  update${model.charAt(0).toUpperCase() + model.slice(1)},
  delete${model.charAt(0).toUpperCase() + model.slice(1)},
};\n`
          );
        });
        break;

      case 'mongo' || 'mongodb':
        options.models.map(async model => {
          await writeFile(
            path.join(
              `${targetDirectoryRoutes}`,
              `${model}.queries.${
                options.language === 'TypeScript' ? 'ts' : 'js'
              }`
            ),
            `import { ${
              model.charAt(0).toUpperCase() + model.slice(1)
            }s } from "../models${
              options.language === 'TypeScript' ? '' : '/index.js'
            }";


const select${model.charAt(0).toUpperCase() + model.slice(1)}s = async () => {
  const result = await ${
    model.charAt(0).toUpperCase() + model.slice(1)
  }s.find();
  return result;
};

const select${model.charAt(0).toUpperCase() + model.slice(1)} = async (id${
              options.language === 'TypeScript' ? ': string' : ''
            }) => {
   const result = await ${
     model.charAt(0).toUpperCase() + model.slice(1)
   }s.findById(id);
  return result;
};

const insert${model.charAt(0).toUpperCase() + model.slice(1)} = async (
  /* attributes */
) => {
  const result = await new ${model.charAt(0).toUpperCase() + model.slice(1)}s({
    /* datas */
  }).save();

  return result;
};

const update${model.charAt(0).toUpperCase() + model.slice(1)} = async (
  /* attributes */
  id${options.language === 'TypeScript' ? ': string' : ''}
) => {
    const result = await ${
      model.charAt(0).toUpperCase() + model.slice(1)
    }s.findByIdAndUpdate(id, { /* attributes */ });
    return result
};

const delete${model.charAt(0).toUpperCase() + model.slice(1)} = async (id${
              options.language === 'TypeScript' ? ': string' : ''
            }) => {
  const result = await ${
    model.charAt(0).toUpperCase() + model.slice(1)
  }s.findByIdAndDelete(id);
  return result;
};

export {
  select${model.charAt(0).toUpperCase() + model.slice(1)}s,
  select${model.charAt(0).toUpperCase() + model.slice(1)},
  insert${model.charAt(0).toUpperCase() + model.slice(1)},
  update${model.charAt(0).toUpperCase() + model.slice(1)},
  delete${model.charAt(0).toUpperCase() + model.slice(1)},
};\n`
          );
        });
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

export { settingQueries };
