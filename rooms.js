/** Configure Room object */
module.exports.configRoom = (world) => {
  return {
    tableName: `rooms`,
    className: `Room`,
    properties: [
      { name: `id`, type: `int`},
      { name: `area`, instanceOf: `Area`, store: false },
      { name: `name`, type: `varchar`, length: 64 },
      { name: `description`, type: `varchar`, length: 512 },
      { name: `details`, type: `object` },
      { name: `flags`, type: `array`, arrayOf: { type: `int` } },
      { name: `exits`, type: `array`, arrayOf: { instanceOf: `Exit` } },
      { name: `itemPrototypes`, type: `array`, arrayOf: { instanceOf: `Item` } },
      { name: `items`, type: `array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `mobilePrototypes`, type: `array`, arrayOf: { instanceOf: `Mobile` } },
      { name: `mobiles`, type: `array`, arrayOf: { instanceOf: `MobileInstance` } },
      { name: `users`, type: `array`, arrayOf: { instanceOf: `User` }, store: false }
    ]
  };
};
