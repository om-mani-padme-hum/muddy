/** Configure Mobile object as extension of character */
module.exports.configMobile = (world, ext, extConfig) => {
  return {
    tableName: `mobiles`,
    className: `Mobile`,
    extends: ext,
    extendsConfig: extConfig,
    properties: [
      { name: `area`, type: `Area`, mysqlType: `int`, setTransform: x => typeof x == 'number' ? world.areas().find(y => y.id() == x) : x, saveTransform: x => x.id(), loadTransform: x => world.areas().find(y => y.id() == x) },
      { name: `room`, instanceOf: `Room` },
      { name: `health`, type: `number`, default: 100, setTransform: x => parseInt(x) },
      { name: `mana`, type: `number`, default: 100, setTransform: x => parseInt(x) },
      { name: `energy`, type: `number`, default: 100, setTransform: x => parseInt(x) },
      { name: `scripts`, type: `Array`, setTransform: x => x.map(x => typeof x == `function` ? x : function () {}) }
    ]
  };
};
