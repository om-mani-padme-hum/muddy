/** Configure Command object */
module.exports.configCommand = (world) => {
  return {
    className: `Command`,
    properties: [
      { name: `name`, type: `varchar`, length: 16 },
      { name: `execute`, type: `function` },
      { name: `priority`, type: `int` }
    ]
  };
};
