# Create a node project with CLI

This package is for generating a node project and adding models automatically through Command Line Interface.



- To create a node project, use the command line "create-project" following by a project name and some options.

create-project <projectName> 

options:
	--language <language> or 
    -l <language> 
    (you can choose the coding language from JavaScript and TypeScript).

    --template <templateName> or 
    -t <templateName> 
    (you can choose template from template options).

    --models <modelName-modelName> or 
    -m <modelName-modelName> 
    (you can use many models as you want. don't forget to use "dash (-)" to separate each model).

    --port 5000:3000 or 
    -p 5000:3000 
    (the first port is for the node api while the second is for the client).

    --database <databaseType> 
    or -d <databaseType> 
    (you can choose from "mongo", "mongodb" or "mysql" database).

    --install or -i
    (this command is for installing automatically all necessary dependencies).

    --git
    (this command is to initialize git).



- To generate or updating a model, use the command "create-model" following by model name and all columns

create-model <modelName> 

options:

    --columns <columnName> 
    (this command is use to create a column).
    
    example of columns: "id:string:required:trim:default=carotte-label:string:trimmed:required"
    (use comma to separate each attribute and equal sign for default.)

    PS: while creating a model, if the model is already exists, it will only update the model content, otherwise it will create a new file
