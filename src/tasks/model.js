import chalk from 'chalk';
import { Listr } from 'listr2';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const createModelProcess = async model => {
  let targetDirectory = path.resolve();
  let defaultModelContent = `import mongoose from "mongoose";

const ${model.modelName}Schema = new mongoose.Schema(
  {
    // here your code

    // categoryLabel: { type: String, trim: true, required: true },
    //linkId: { type: mongoose.Types.ObjectId, ref: "Link", required: true },
  },
  { timestamps: true }
);

const ${model.modelName} = mongoose.model("${model.modelName}s", ${model.modelName}Schema);
export default ${model.modelName};\n`;

  // checking model folder permission
  const checkPermission = async targetDirectory => {
    try {
      await access(targetDirectory, fs.constants.R_OK);
    } catch (error) {
      console.error('%s Invalid template name', chalk.red.bold('Error'));
      process.exit(1);
    }
  };

  const writtingFile = async (model, targetDirectory) => {
    // if the file is found
    let stringToPaste = '';

    model.columns.map(column => {
      stringToPaste += JSON.stringify(column)
        .slice(1, JSON.stringify(column).length - 1)
        .concat(',');
    });

    // reading ts config
    await readFile(
      // reading tsconfig.json
      path.join(`${targetDirectory}`, `${model.modelName}.models.ts`),
      'utf8',
      async function (err, data) {
        if (err) {
          return console.log(err);
        } else {
          // readfile and replace
          var result = data.replace(
            /\/\/ here your code/gi,
            `${stringToPaste}\n // here your code\n\n`
          );

          await writeFile(
            path.join(`${targetDirectory}`, `${model.modelName}.models.ts`),
            result,
            'utf8',
            function (err) {
              if (err) return console.log(err);
            }
          );
        }
      }
    );
  };

  const updateFile = async (model, targetDirectory) => {
    await appendFile(
      path.join(`${targetDirectory}/index.ts`),
      `export { default as ${
        model.modelName.charAt(0).toUpperCase() + model.modelName.slice(1)
      }s } from "./${model.modelName}.models";\n`
    );
  };

  // if model file found, open and write the file, else create a new and write file
  const writeModelFile = async (model, targetDirectory) => {
    // Open file demo.txt in read mode
    // ${modelName}.models.ts

    fs.access(
      `${targetDirectory}/${model.modelName}.models.ts`,
      fs.F_OK,
      async err => {
        // if the file is not found
        if (err) {
          // writting file
          await writeFile(
            path.join(`${targetDirectory}`, `${model.modelName}.models.ts`),
            defaultModelContent
          );
          // reopen the file and rewrite the model
          await writtingFile(model, targetDirectory);
          // updating model index file
          await updateFile(model, targetDirectory);
          return 1;
        } else {
          // if the file is found
          // directly writte the file
          await writtingFile(model, targetDirectory);
        }
      }
    );
  };

  const tasks = new Listr(
    [
      {
        title: 'Checking model folder permission',
        task: async () => await checkPermission(targetDirectory),
        enabled: () => targetDirectory,
      },
      {
        title: 'Finding model file',
        task: async () => await writeModelFile(model, targetDirectory),
        enabled: () => targetDirectory,
      },
    ],
    { concurrent: false }
  );

  await tasks.run();

  console.log('%s Model ready', chalk.green.bold('DONE'));
  return true;
};

export { createModelProcess };
