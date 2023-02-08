import inquirer from 'inquirer';
import arg from 'arg';

const parseCreateModelsArgumentIntoOptions = rawArgs => {
  const args = arg(
    {
      '--columns': String,
      '--template': String,
      '--language': String,
      '--timestamps': Boolean,
      '--yes': Boolean,
      '-c': '--columns',
      '-t': '--template',
      '-l': '--language',
      '-i': '--timestamps',
      '-y': '--yes',
    },
    { argv: rawArgs.slice(2) }
  );

  return {
    modelName: args._[0],
    template: args['--template'] || false,
    language: args['--language'] || false,
    columns: args['--columns'] ? args['--columns'].split(';') : null,
    skipPrompts: args['--yes'] || false,
    timestamps: args['--timestamps'] || true,
  };
};

const promptForMissingModelOptions = async options => {
  let questions = [];
  const templateChoises = ['mongoose', 'sequelize'];
  const languageChoises = ['TypeScript', 'JavaScript'];
  const defaultTemplate = 'mongoose';
  const defaultLanguage = 'mongoose';

  if (!options.modelName) {
    questions.push({
      type: 'input',
      name: 'modelName',
      message: 'Please give a name to your model',
      validate: input => {
        if (input === '') return 'Please, enter a model name.';
        if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
        else
          return 'Model name may only include letters, numbers, underscores and hashes.';
      },
    });
  }

  if (!options.template || templateChoises.indexOf(options.template) === -1) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose a template',
      choices: templateChoises,
      default: defaultTemplate,
    });
  }

  if (!options.language || languageChoises.indexOf(options.template) === -1) {
    questions.push({
      type: 'list',
      name: 'language',
      message: 'Please choose a coding language',
      choices: languageChoises,
      default: defaultLanguage,
    });
  }

  if (!options.columns) {
    questions.push({
      type: 'input',
      name: 'columns',
      message:
        'Please give some columns, use dash (;) to separate them and (:) to separate fields.',
      validate: input => {
        if (input === '') return 'Please, enter at least one column.';
        if (/^([A-Za-z\-\\_:;\d])+$/.test(input)) return true;
        else
          return 'Column name may only include letters, numbers, underscores and hashes.';
      },
    });
  }

  const answers = await inquirer.prompt(questions);

  // create-model home --columns id:string:required:trim:default=carotte-label:string:trim:required

  // create-model home --columns id:type=string:rquired=true:trim=false:false:default=carotte-label:type=string:trim=true:required=false

  // create-model rano --columns [{id:String:trim:required},{label:String:trim:required:default:Label},{capacity:number}] --timestamps

  return {
    ...options,
    modelName: options.modelName || answers.modelName,
    template: options.template || answers.template,
    language: options.language || answers.language,
    columns: options.columns || answers.columns.split(';'),
  };
};

const formatModelOptionColumns = async options => {
  let arrayArrayTempColumn = [];
  options.columns.map(column => {
    let object = {};
    let insideObject = {};
    column.split(':').map(attribute => {
      switch (attribute) {
        case 'string':
          insideObject['type'] =
            attribute.charAt(0).toUpperCase() +
            attribute.slice(1, attribute.length);
          break;

        case 'number':
          insideObject['type'] =
            attribute.charAt(0).toUpperCase() +
            attribute.slice(1, attribute.length);
          break;

        case 'required':
          insideObject['required'] = true;
          break;

        case 'trim':
          insideObject['trim'] = true;
          break;

        case 'trimmed':
          insideObject['trim'] = true;
          break;

        default:
          break;
      }

      if (attribute.slice(0, 7) === 'default') {
        insideObject['default'] = attribute.split('=')[1];
      }
    });
    column.split(':').map((attribute, attributeIndex) => {
      if (attributeIndex === 0) {
        object[`${attribute}`] = insideObject;
      }
    });
    arrayArrayTempColumn.push(object);
  });

  return { ...options, columns: arrayArrayTempColumn };
};

export {
  parseCreateModelsArgumentIntoOptions,
  promptForMissingModelOptions,
  formatModelOptionColumns,
};
