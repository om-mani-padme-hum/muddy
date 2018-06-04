/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure command object */
const configCommand = {
  className: `Command`,
  properties: [
    { name: `name`, type: `string` },
    { name: `command`, type: `function` },
    { name: `priority`, type: `number`, setTransform: x => parseInt(x) }
  ]
};

/** Create command object */
ezobjects.createObject(configCommand);

/** Export configs*/
module.exports.configCommand = configCommand;

/** Export objects */
module.exports.Command = Command;
