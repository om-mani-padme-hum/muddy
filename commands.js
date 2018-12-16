/** Configure Command object */
module.exports.configCommand = (world) => {
  return {
    className: `Command`,
    properties: [
      { name: `execute`, type: `function` },
      { name: `name`, type: `varchar`, length: 16 },
      { name: `priority`, type: `int` }
    ]
  };
};
