import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const settingQueries = async (targetDirectoryRoutes, models, databaseType) => {
  try {
    if (databaseType === 'mysql') {
      models.map(async model => {
        await writeFile(
          path.join(`${targetDirectoryRoutes}`, `${model}.queries.ts`),
          `import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database/databaseConnect";

const select${model.charAt(0).toUpperCase() + model.slice(1)}s = async () => {
  const [rows] = await pool.query<ResultSetHeader>(
    \`SELECT * FROM ${model}\`
  );
  return rows;
};

const select${
            model.charAt(0).toUpperCase() + model.slice(1)
          } = async (id: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    \`SELECT * FROM ${model} WHERE id = ?\`,
    [id]
  );
  return rows[0];
};

const insert${model.charAt(0).toUpperCase() + model.slice(1)} = async (
  /* attributes */
) => {
  const [result] = await pool.query<ResultSetHeader>(
    \`   INSERT INTO ${model} (/* columns */)
        VALUES (?, ?, ?, ?, ?)
      \`,
    [ /* attributes */]
  );

  return result.affectedRows;
};

const update${model.charAt(0).toUpperCase() + model.slice(1)} = async (
  /* attributes */
  id: string
) => {
  const [result] = await pool.query<ResultSetHeader>(
    \`
    UPDATE ${model} 
    SET /* columns = ? */
    WHERE id = ?
  \`,
    [/* attributes */, id]
  );
  return result.affectedRows;
};

const delete${
            model.charAt(0).toUpperCase() + model.slice(1)
          } = async (id: string) => {
  const [result] = await pool.query<ResultSetHeader>(
    ``DELETE FROM ${model} WHERE id = ?\`,
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
    } else if (databaseType === 'mongo' || databaseType === 'mongodb') {
      models.map(async model => {
        await writeFile(
          path.join(`${targetDirectoryRoutes}`, `${model}.queries.ts`),
          `import { ${
            model.charAt(0).toUpperCase() + model.slice(1)
          }s } from "../models";


const select${model.charAt(0).toUpperCase() + model.slice(1)}s = async () => {
  const result = await ${
    model.charAt(0).toUpperCase() + model.slice(1)
  }s.find();
  return result;
};

const select${
            model.charAt(0).toUpperCase() + model.slice(1)
          } = async (id: string) => {
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
  id: string
) => {
    const result = await ${
      model.charAt(0).toUpperCase() + model.slice(1)
    }s.findByIdAndUpdate(id, { /* attributes */ });
    return result
};

const delete${
            model.charAt(0).toUpperCase() + model.slice(1)
          } = async (id: string) => {
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
    }
  } catch (error) {
    console.log(error);
  }
};

export { settingQueries };
