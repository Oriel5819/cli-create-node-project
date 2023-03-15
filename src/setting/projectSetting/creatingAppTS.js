import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

const creatingAppTS = async (options, apiTargetDirectory) => {
  await writeFile(
    path.join(
      `${apiTargetDirectory}`,
      `app.${options.language === 'TypeScript' ? 'ts' : 'js'}`
    ),
    `import express  ${
      options.language === 'TypeScript'
        ? ', { Application, Request, Response }'
        : ''
    } from "express";
import consola from "consola";
import cors from "cors";
import helmet from "helmet";
import { PORT } from "./config/constants${
      options.language === 'TypeScript' ? '' : '.js'
    }";\n`
  );
  // appending import routes
  if (options.models) {
    options.models.map(async (model, index) => {
      await appendFile(
        path.join(
          `${apiTargetDirectory}/app.${
            options.language === 'TypeScript' ? 'ts' : 'js'
          }`
        ),
        `import ${model}  from "./routes/${model}.route${
          options.language === 'TypeScript' ? '' : '.js'
        }";\n`
      );
    });
  }
  // appending other default setting
  await appendFile(
    path.join(
      `${apiTargetDirectory}/app.${
        options.language === 'TypeScript' ? 'ts' : 'js'
      }`
    ),
    `
  import { ${
    options.database === 'mysql' ? 'pool' : 'databaseConnection'
  } } from "./database/databaseConnect${
      options.language === 'TypeScript' ? '' : '.js'
    }";\n
  const app${
    options.language === 'TypeScript' ? ': Application' : ''
  } = express();
  const port${
    options.language === 'TypeScript' ? ': number | string' : ''
  } = PORT || 8080;
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  // database
  ${options.database === 'mysql' ? 'pool;' : 'databaseConnection;'}
  app.get("/", ( ${
    options.language === 'TypeScript'
      ? 'request: Request, response: Response'
      : 'request, response'
  }) => {
      response.status(200).json({msg:"Hello Oriel"});
  });
  // routes\n`
  );
  // appending routes
  if (options.models) {
    options.models.map(async (model, index) => {
      await appendFile(
        path.join(
          `${apiTargetDirectory}/app.${
            options.language === 'TypeScript' ? 'ts' : 'js'
          }`
        ),
        `app.use("/${model}", ${model});\n`
      );
    });
  }
  // appending listener
  await appendFile(
    path.join(
      `${apiTargetDirectory}/app.${
        options.language === 'TypeScript' ? 'ts' : 'js'
      }`
    ),
    `\napp.listen(port, () => {
    consola.success({ badge: true, message: \`Server is runnig on port \${port}\` });
  });`
  );
};

export { creatingAppTS };
