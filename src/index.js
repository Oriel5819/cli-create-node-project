import { createProjectProcess } from './tasks/project.js';
import { createModelProcess } from './tasks/model.js';
import {
  parseCreateProjectArgumentIntoOptions,
  promptForMissingOptions,
} from './cmd/create-project.js';
import {
  parseCreateModelsArgumentIntoOptions,
  promptForMissingModelOptions,
  formatModelOptionColumns,
} from './cmd/create-model.js';

const createProject = async args => {
  let options = parseCreateProjectArgumentIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProjectProcess(options);
};

const createModel = async args => {
  let modelOptions = parseCreateModelsArgumentIntoOptions(args);
  modelOptions = await promptForMissingModelOptions(modelOptions);
  modelOptions = await formatModelOptionColumns(modelOptions);
  await createModelProcess(modelOptions);
};

export { createProject, createModel };
