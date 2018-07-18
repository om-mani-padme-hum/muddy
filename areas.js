/** Configure Area object */
module.exports.configArea = (world) => {
  return {
    tableName: `areas`,
    className: `Area`,
    properties: [
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32 },
      { name: `author`, type: `varchar`, length: 32 },
      { name: `description`, type: `varchar`, length: 512 },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `created`, type: `datetime` },
      { name: `itemPrototypes`, type: `array`, arrayOf: { instanceOf: 'Item' } },
      { name: `items`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` }, store: false },
      { name: `mobilePrototypes`, type: `array`, arrayOf: { instanceOf: 'Mobile' } },
      { name: `mobiles`, type: `Array`, arrayOf: { instanceOf: `MobileInstance` }, store: false },
      { name: `rooms`, type: `Array`, arrayOf: { instanceOf: `Room` } },
      { name: `users`, type: `Array`, arrayOf: { instanceOf: `User` }, store: false }
    ],
    indexes: [
      { name: `name`, type: `BTREE`, columns: [ `name` ] }
    ]
  };
};
