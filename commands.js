/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure command object */
module.exports.configCommand = (world) => {
  return {
    className: `Command`,
    properties: [
      { name: `name`, type: `string` },
      { name: `execute`, type: `function` },
      { name: `priority`, type: `number`, setTransform: x => parseInt(x) }
    ]
  };
};

