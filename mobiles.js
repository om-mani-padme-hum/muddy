/** Configure Mobile object as extension of Character */
module.exports.configMobile = (world, ext, extConfig) => {
  return {
    tableName: `mobiles`,
    className: `Mobile`,
    extends: ext,
    extendsConfig: extConfig,
    properties: [
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `scripts`, type: `Array`, arrayOf: { type: `function` } },
      { name: `equipment`, type: `Array`, arrayOf: { instanceOf: `Item` } },
      { name: `inventory`, type: `Array`, arrayOf: { instanceOf: `Item` } }
    ]
  };
};
