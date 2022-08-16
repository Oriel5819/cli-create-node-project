import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const editPackage = async (options, targetDirectory) => {
  // reading package json
  readFile(
    // reading package.json
    path.join(`${targetDirectory}/package.json`),
    'utf8',
    function (err, data) {
      if (err) {
        return console.log(err);
      }

      // replace scripts in package json
      var result = data
        .replace(
          /"test": "echo \\"Error: no test specified\\" && exit 1"/gi,
          `"build": "npx tsc && nodemon build/app.js", "server":"nodemon src/app.ts"`
        )
        .replace(/"myname"/gi, `"MIASA VILLA ORIEL"`);

      writeFile(
        path.join(`${targetDirectory}/package.json`),
        result,
        'utf8',
        function (err) {
          if (err) return console.log(err);
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
