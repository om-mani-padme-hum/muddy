/** Configure Command object */
module.exports.configCommand = (world) => {
  return {
    className: `Command`,
    properties: [
      { name: `execute`, type: `function` },
      { name: `name`, type: `varchar`, length: 16 },
      { name: `positions`, type: `Array`, arrayOf: { type: `int` } },
      { name: `priority`, type: `int` }
    ]
  };
};
