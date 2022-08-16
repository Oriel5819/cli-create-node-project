import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

const settingRoutes = async (targetDirectoryRoutes, models) => {
  try {
    // console.log(targetDirectoryRoutes, models);
    await writeFile(
      path.join(`${targetDirectoryRoutes}`, `index.ts`),
      `// all routes\n`
    );
    models.map(async model => {
      await writeFile(
        path.join(`${targetDirectoryRoutes}`, `${model}.route.ts`),
        `import { Router } from "express";
    const ${model}Route = Router();
    import {
      get${model.charAt(0).toUpperCase() + model.slice(1)}s,
      get${model.charAt(0).toUpperCase() + model.slice(1)},
      create${model.charAt(0).toUpperCase() + model.slice(1)},
      edit${model.charAt(0).toUpperCase() + model.slice(1)},
      remove${model.charAt(0).toUpperCase() + model.slice(1)},
    } from "../controllers/${model}.controllers";
    ${model}Route.get("/", get${
          model.charAt(0).toUpperCase() + model.slice(1)
        }s);
    ${model}Route.get("/:id", get${
          model.charAt(0).toUpperCase() + model.slice(1)
        });
    ${model}Route.post("/create", create${
          model.charAt(0).toUpperCase() + model.slice(1)
        });
    ${model}Route.put("/edit/:id", edit${
          model.charAt(0).toUpperCase() + model.slice(1)
        });
    ${model}Route.delete("/remove/:id", remove${
          model.charAt(0).toUpperCase() + model.slice(1)
        });
    export default ${model}Route;\n`
      );
      await appendFile(
        path.join(`${targetDirectoryRoutes}/index.ts`),
        `export { default as ${model} } from "./${model}.route";\n`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export { settingRoutes };
