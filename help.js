/** Configure Help object */
module.exports.configHelp = (world) => {
  return {
    className: `Help`,
    tableName: `help`,
    properties: [
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32 },
      { name: `text`, type: `text` }
    ]
  };
};
