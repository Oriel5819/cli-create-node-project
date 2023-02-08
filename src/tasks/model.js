import chalk from 'chalk';
import { Listr } from 'listr2';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const createModelProcess = async options => {
  let targetDirectory = path.resolve();
  let fileExistance = false;
  let fileName = '';
  let defaultModelContent = `import mongoose from "mongoose";

const ${options.modelName}Schema = new mongoose.Schema(
  {
    // here your code

    // categoryLabel: { type: String, trim: true, required: true },
    //linkId: { type: mongoose.Types.ObjectId, ref: "Link", required: true },
  },
  { timestamps: true }
);

const ${options.modelName} = mongoose.model("${options.modelName}s", ${options.modelName}Schema);
export default ${options.modelName};\n`;

  // checking model folder permission
  const checkPermission = async targetDirectory => {
    try {
      await access(targetDirectory, fs.constants.R_OK);
    } catch (error) {
      console.error('%s Invalid template name', chalk.red.bold('Error'));
      process.exit(1);
    }
  };

  // checking model folder permission
  const checkFile = async (options, targetDirectory) => {
    return fs.promises
      .access(
        `${targetDirectory}/${options.modelName}.models${
          options.language === 'TypeScript' ? '.ts' : '.js'
        }`,
        fs.constants.F_OK
      )
      .then(() => (fileExistance = true))
      .catch(() => (fileExistance = false));
  };

  const writtingFile = async (options, targetDirectory) => {
    // IF THE FILE ALREADY EXISTS
    let stringToPaste = '';
    options.columns.map(column => {
      stringToPaste += JSON.stringify(column)
        .slice(1, JSON.stringify(column).length - 1)
        .concat(',');
    });

    // READING THE SPECIFIC MODEL FILE
    await readFile(
      path.join(
        targetDirectory,
        `${options.modelName}.models${
          options.language === 'TypeScript' ? '.ts' : '.js'
        }`
      ),
      'utf8',
      async function (err, data) {
        if (err) {
          return console.log(err);
        } else {
          // REPLACING THE PLACEHOLDER TO THE MODEL COLUMNS
          var result = data.replace(
            /\/\/ here your code/gi,
            `${stringToPaste}\n // here your code\n\n`
          );
          await writeFile(
            path.join(
              targetDirectory,
              `${options.modelName}.models${
                options.language === 'TypeScript' ? '.ts' : '.js'
              }`
            ),
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

  const creatingFile = async (options, targetDirectory, fileName) => {
    console.log(fileExistance);

    // // if the file is found
    // let stringToPaste = '';
    // options.columns.map(column => {
    //   stringToPaste += JSON.stringify(column)
    //     .slice(1, JSON.stringify(column).length - 1)
    //     .concat(',');
    // });
    // // reading ts config
    // await readFile(
    //   // reading tsconfig.json
    //   path.join(`${targetDirectory}`, `${options.modelName}.models.ts`),
    //   'utf8',
    //   async function (err, data) {
    //     if (err) {
    //       return console.log(err);
    //     } else {
    //       // readfile and replace
    //       var result = data.replace(
    //         /\/\/ here your code/gi,
    //         `${stringToPaste}\n // here your code\n\n`
    //       );
    //       await writeFile(
    //         path.join(`${targetDirectory}`, `${options.modelName}.models.ts`),
    //         result,
    //         'utf8',
    //         function (err) {
    //           if (err) return console.log(err);
    //         }
    //       );
    //     }
    //   }
    // );
  };

  const updateFile = async (options, targetDirectory) => {
    await appendFile(
      path.join(`${targetDirectory}/index.ts`),
      `export { default as ${
        options.modelName.charAt(0).toUpperCase() + options.modelName.slice(1)
      }s } from "./${options.modelName}.models";\n`
    );
  };

  // if model file found, open and write the file, else create a new and write file
  const writeModelFile = async (options, targetDirectory) => {
    await access(
      `${targetDirectory}/${options.modelName}.models.ts`,
      fs.F_OK,
      async err => {
        // if the file is not found
        if (err) {
          // writting file
          await writeFile(
            path.join(`${targetDirectory}`, `${options.modelName}.models.ts`),
            defaultModelContent
          );
          // reopen the file and rewrite the model
          // await writtingFile(model, targetDirectory);
          // updating model index file
          // await updateFile(model, targetDirectory);
          return 1;
        } else {
          // if the file is found
          // directly writte the file
          writtingFile(model, targetDirectory);
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
        title: 'Checking existing model file',
        task: async () => await checkFile(options, targetDirectory),
        enabled: () => targetDirectory && options.language,
      },
      {
        title: 'Writting file',
        task: async () => await writtingFile(options, targetDirectory),
        enabled: () => targetDirectory && options.language && fileExistance,
      },
      {
        title: 'Creating file',
        task: async fileName =>
          await creatingFile(options, targetDirectory, fileName),
        enabled: () => targetDirectory && options.language && !fileExistance,
      },
    ],
    { concurrent: false }
  );

  await tasks.run();

  console.log('%s Model ready', chalk.green.bold('DONE'));
  return true;
};

export { createModelProcess };
