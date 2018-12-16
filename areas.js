/** Configure Area object */
module.exports.configArea = (world) => {
  return {
    tableName: `areas`,
    className: `Area`,
    properties: [
      { name: `author`, type: `varchar`, length: 32 },
      { name: `created`, type: `datetime` },
      { name: `description`, type: `varchar`, length: 512 },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `id`, type: `int` },
      { name: `itemPrototypes`, type: `array`, arrayOf: { instanceOf: `ItemPrototype` } },
      { name: `mobilePrototypes`, type: `array`, arrayOf: { instanceOf: `MobilePrototype` } },
      { name: `name`, type: `varchar`, length: 32 },
      { name: `rooms`, type: `Array`, arrayOf: { instanceOf: `Room` } }
    ]
  };
};
