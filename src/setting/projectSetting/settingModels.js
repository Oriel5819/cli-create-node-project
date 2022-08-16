import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

const settingModels = async (targetDirectoryModels, models) => {
  try {
    await writeFile(
      path.join(`${targetDirectoryModels}`, `index.ts`),
      `//all models\n`
    );

    await models.map(async model => {
      await writeFile(
        path.join(`${targetDirectoryModels}`, `${model}.models.ts`),
        `import mongoose from "mongoose";

const ${model}Schema = new mongoose.Schema(
  {

    // here your code

    // ${model}Label: { type: String, trim: true, required: true },
    //linkId: { type: mongoose.Types.ObjectId, ref: "Link", required: true },
  },
  { timestamps: true }
);

const ${model} = mongoose.model("${
          model.charAt(0).toUpperCase() + model.slice(1)
        }s", ${model}Schema);
export default ${model};\n`
      );

      await appendFile(
        path.join(`${targetDirectoryModels}/index.ts`),
        `export { default as ${
          model.charAt(0).toUpperCase() + model.slice(1)
        }s } from "./${model}.models";\n`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export { settingModels };
