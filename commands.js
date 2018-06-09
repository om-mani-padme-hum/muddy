/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure command object */
const configCommand = {
  className: `Command`,
  properties: [
    { name: `name`, type: `string` },
    { name: `execute`, type: `function` },
    { name: `priority`, type: `number`, setTransform: x => parseInt(x) }
  ]
};

/** Create command object */
ezobjects.createObject(configCommand);

/** Export config */
module.exports.configCommand = configCommand;

/** Export object */
module.exports.Command = Command;
