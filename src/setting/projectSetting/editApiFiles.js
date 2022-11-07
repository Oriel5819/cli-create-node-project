import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readFileSync = promisify(fs.readFileSync);

const editPackage = async (options, targetDirectory) => {
  // reading package json
  readFile(
    // reading package.json
    path.join(`${targetDirectory}/package.json`),
    'utf8',
    async function (err, data) {
      if (err) {
        return console.log(err);
      }

      // replace scripts in package json
      var result = data
        .replace(
          /"test": "echo \\"Error: no test specified\\" && exit 1"/gi,
          ` ${
            options.language === 'TypeScript'
              ? '"build": "npx tsc && nodemon build/app.js",\n'
              : ''
          }  "server":"nodemon src/app.${
            options.language === 'TypeScript' ? 'ts' : 'js'
          }"`
        )
        .replace(/"myname"/gi, `"MIASA VILLA ORIEL"`);

      writeFile(
        path.join(`${targetDirectory}/package.json`),
        result,
        'utf8',
        async function (err) {
          if (err) return console.log(err);

          if (options.language === 'JavaScript') {
            var fileData = fs
              .readFileSync(path.join(`${targetDirectory}/package.json`))
              .toString()
              .split(',');
            fileData.splice(4, 0, '"type": "module"');
            var text = fileData.join(',');

            writeFile(
              path.join(`${targetDirectory}/package.json`),
              text,
              'utf-8',
              function (err) {
                if (err) return console.log(err);
              }
            );
          }
        }
      );
    }
  );
};

const editTypescriptConfig = async (options, targetDirectory) => {
  // reading ts config
  readFile(
    // reading tsconfig.json
    path.join(`${targetDirectory}/tsconfig.json`),
    'utf8',
    function (err, data) {
      if (err) {
        return console.log(err);
      }

      // replace scripts in ts config
      var result = data
        .replace(/\/\/ "rootDir": ".\/"/gi, `"rootDir": "./src"`)
        .replace(/\/\/ "outDir": ".\/"/gi, `"outDir": "./build"`);

      writeFile(
        path.join(`${targetDirectory}/tsconfig.json`),
        result,
        'utf8',
        function (err) {
          if (err) return console.log(err);
        }
      );
    }
  );
};

export { editPackage, editTypescriptConfig };
