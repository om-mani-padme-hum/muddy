/** Configure Room object */
module.exports.configRoom = (world) => {
  return {
    tableName: `rooms`,
    className: `Room`,
    properties: [
      { name: `area`, instanceOf: `Area`, store: false },
      { name: `author`, type: `varchar`, length: 32, default: `Anonymous` },
      { name: `created`, type: `datetime`, default: new Date() },
      { name: `description`, type: `varchar`, length: 512, default: `This room looks quite boring, just plain everything.` },
      { name: `details`, type: `object` },
      { name: `exits`, type: `array`, arrayOf: { instanceOf: `Exit` } },
      { name: `flags`, type: `array`, arrayOf: { type: `int` } },
      { name: `id`, type: `int`},
      { name: `items`, type: `array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `mobiles`, type: `array`, arrayOf: { instanceOf: `MobileInstance` } },
      { name: `name`, type: `varchar`, length: 64, default: `An empty room` },
      { name: `users`, type: `array`, arrayOf: { instanceOf: `User` }, store: false }
    ]
  };
};
