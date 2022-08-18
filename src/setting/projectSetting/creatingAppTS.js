import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

const creatingAppTS = async (options, apiTargetDirectory) => {
  await writeFile(
    path.join(`${apiTargetDirectory}`, `app.ts`),
    `import express, { Application, Request, Response } from "express";
    import consola from "consola";
  import cors from "cors";
  import helmet from "helmet";
  import { PORT } from "./config/constants";\n`
  );
  // appending import routes
  if (options.models) {
    options.models.map(async (model, index) => {
      await appendFile(
        path.join(`${apiTargetDirectory}/app.ts`),
        `import ${model}  from "./routes/${model}.route";\n`
      );
    });
  }
  // appending other default setting
  await appendFile(
    path.join(`${apiTargetDirectory}/app.ts`),
    `
  import { databaseConnection } from "./database/databaseConnect";\n
  const app: Application = express();
  const port: number | string = PORT || 8080;
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());\n
  // database
  const connection = async () => {
  await databaseConnection();
};
connection();

  \n
  app.get("/", (request: Request, response: Response) => {
      response.status(200).json({msg:"Hello Oriel"});
  });
  // routes\n`
  );
  // appending routes
  if (options.models) {
    options.models.map(async (model, index) => {
      await appendFile(
        path.join(`${apiTargetDirectory}/app.ts`),
        `app.use("/${model}", ${model});\n`
      );
    });
  }
  // appending listener
  await appendFile(
    path.join(`${apiTargetDirectory}/app.ts`),
    `\napp.listen(port, () => {
    consola.success({ badge: true, message: \`Server is runnig on port \${port}\` });
  });`
  );
};

export { creatingAppTS };
