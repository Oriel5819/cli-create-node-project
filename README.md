# cli-create-node-ts-project

This package is for generating a node typescript project and/or adding models automatically through Command Line Interface.

Before using, make sure that you have typescript in your machine with **sudo apt install node-typescript**

## Create a node project with CLI

To create a node project, use the command line "create-project" following by a project name and some options.

create-project _projectName_

options:
--template _templateName_ or
-t _templateName_
(you can choose template from template options).

--models _modelName-modelName_
-m _modelName-modelName_
(you can use many models as you want. don't forget to use **dash (-)** to separate each model).

--port _apiPort_:_clientPort_ or
-p _apiPort_:_clientPort_
(the first port is for the node api while the second is for the client).

--database _databaseType_
or -d _databaseType_
(you can choose from **mongo**, **mongodb** or **mysql** database).

--install or -i
(this command is for installing automatically all necessary dependencies).

--git
(this command is to initialize git).

example:
`create-project --template crud --models user-category-model --port 3000:5000 --database mongodb --install --git`

## Create a node models with CLI

To generate or updating a model, use the command "create-model" following by model name and all columns

create-model _modelName_

options:

--columns _columnName_
(this command is use to create a column).

example:
`create-model model --columns "id:string:required:trim:default=carotte-label:string:trimmed:required"`
(use **comma (:)** to separate each attribute and equal sign for default.)

PS: while creating a model, if the model is already exists, it will only update the model content, otherwise it will create a new file
