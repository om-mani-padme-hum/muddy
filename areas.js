/** Configure Area object */
module.exports.configArea = (world) => {
  return {
    tableName: `areas`,
    className: `Area`,
    properties: [
      { name: `author`, type: `varchar`, length: 32, default: `Anonymous` },
      { name: `created`, type: `datetime`, default: new Date() },
      { name: `deployments`, type: `array`, arrayOf: { instanceOf: `Deployment` } },
      { name: `description`, type: `varchar`, length: 512, default: `This area is totally boring, who would visit here?` },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `id`, type: `int` },
      { name: `itemPrototypes`, type: `array`, arrayOf: { instanceOf: `ItemPrototype` } },
      { name: `level`, type: `int` },
      { name: `mobilePrototypes`, type: `array`, arrayOf: { instanceOf: `MobilePrototype` } },
      { name: `name`, type: `varchar`, length: 32, default: `a boring area` },
      { name: `rooms`, type: `Array`, arrayOf: { instanceOf: `Room` } }
    ]
  };
};
