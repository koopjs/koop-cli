const fs = require('fs');

exports.options = (yargs) => {
  yargs
    .positional('type', {
      describe: 'project type',
      type: 'string',
      choices: ['app', 'provider']
    })
    .positional('name', {
      describe: 'project name',
      type: 'string'
    })
}

exports.handler = (argv) => {
  const projectType = argv.type;
  const projectName = argv.name;
  const templatePath = `${__dirname}/../templates/${projectType}`;

  fs.mkdirSync(`${process.cwd()}/${projectName}`);
  createDirectoryContents(templatePath, projectName);
}

function createDirectoryContents (templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');
      const writePath = `${process.cwd()}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${process.cwd()}/${newProjectPath}/${file}`);

      // recursive call
      createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  });
}
