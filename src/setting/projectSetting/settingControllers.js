import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const settingControllers = async (options, targetDirectoryRoutes) => {
  try {
    options.models.map(async model => {
      await writeFile(
        path.join(
          `${targetDirectoryRoutes}`,
          `${model}.controllers.${
            options.language === 'TypeScript' ? 'ts' : 'js'
          }`
        ),
        `${
          options.language === 'TypeScript'
            ? 'import { RequestHandler, Request, Response } from "express";'
            : ''
        }
import {
  select${model.charAt(0).toUpperCase() + model.slice(1)}s,
  select${model.charAt(0).toUpperCase() + model.slice(1)},
  insert${model.charAt(0).toUpperCase() + model.slice(1)},
  update${model.charAt(0).toUpperCase() + model.slice(1)},
  delete${model.charAt(0).toUpperCase() + model.slice(1)},
} from "../queries/${model}.queries${
          options.language === 'TypeScript' ? '' : '.js'
        }";

const get${model.charAt(0).toUpperCase() + model.slice(1)}s${
          options.language === 'TypeScript' ? ': RequestHandler' : ''
        } = async (
 ${
   options.language === 'TypeScript'
     ? 'request: Request, response: Response'
     : 'request, response'
 }
) => {
  try {
    const all_${model}s = await select${
          model.charAt(0).toUpperCase() + model.slice(1)
        }s();
    response.status(200).json({ ${model}s: all_${model}s });
  } catch (error) {
    response.status(500).json({
      message: \`Error occurred while trying to retrieve all ${
        model.charAt(0).toUpperCase() + model.slice(1)
      }s\`,
      error,
    });
  }
};

const get${model.charAt(0).toUpperCase() + model.slice(1)}${
          options.language === 'TypeScript' ? ': RequestHandler' : ''
        } = async (${
          options.language === 'TypeScript'
            ? 'request: Request, response: Response'
            : 'request, response'
        }) => {
  try {
    const { id } = request.params;
    const ${model} = await select${
          model.charAt(0).toUpperCase() + model.slice(1)
        }(id);

    response.status(200).json({ ${model}: ${model} });
  } catch (error) {
    response.status(500).json({
      message: \`Error occurred while trying to retrieve a ${model}\`,
      error,
    });
  }
};

const create${model.charAt(0).toUpperCase() + model.slice(1)}${
          options.language === 'TypeScript' ? ': RequestHandler' : ''
        } = async (${
          options.language === 'TypeScript'
            ? 'request: Request, response: Response'
            : 'request, response'
        }) => {
  try {
    const { description, valeur, unite, idequipement, idcomposant } =
      request.body;

    const inserted_${model} = await insert${
          model.charAt(0).toUpperCase() + model.slice(1)
        }(
      /* attributes */
    );

    if (inserted_${model}) {
      response.status(201).json({
        message: \`\${inserted_${model}} row has been added successfully\`,
      });
    }
  } catch (error) {
    response.status(500).json({
      message: \`Error occurred while adding a ${model}\`,
      error,
    });
  }
};

const edit${model.charAt(0).toUpperCase() + model.slice(1)}${
          options.language === 'TypeScript' ? ': RequestHandler' : ''
        } = async (${
          options.language === 'TypeScript'
            ? 'request: Request, response: Response'
            : 'request, response'
        }) => {
  try {
    const { description, valeur, unite, idequipement, idcomposant } =
      request.body;
    const { id } = request.params;
    const edited_${model} = await update${
          model.charAt(0).toUpperCase() + model.slice(1)
        }(
     /* attributes */
      id
    );

    if (edited_${model}) {
      response.status(200).json({
        message: \`\${edited_${model}} row has been updated successfully\`,
      });
    }
  } catch (error) {
    response.status(500).json({
      message: \`Error occurred while updating a ${model}\`,
      error,
    });
  }
};

const remove${model.charAt(0).toUpperCase() + model.slice(1)}${
          options.language === 'TypeScript' ? ': RequestHandler' : ''
        } = async (${
          options.language === 'TypeScript'
            ? 'request: Request, response: Response'
            : 'request, response'
        }) => {
  try {
    const { id } = request.params;
    const deleted_${model} = await delete${
          model.charAt(0).toUpperCase() + model.slice(1)
        }(id);

    if (deleted_${model}) {
      response.status(200).json({
        message: \`\${deleted_${model}} row has been removed successfully\`,
      });
    }
  } catch (error) {
    response.status(500).json({
      message: \`Error occurred while trying to remove an ${model}\`,
      error,
    });
  }
};

export {
  get${model.charAt(0).toUpperCase() + model.slice(1)}s,
  get${model.charAt(0).toUpperCase() + model.slice(1)},
  create${model.charAt(0).toUpperCase() + model.slice(1)},
  edit${model.charAt(0).toUpperCase() + model.slice(1)},
  remove${model.charAt(0).toUpperCase() + model.slice(1)},
};\n`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export { settingControllers };
