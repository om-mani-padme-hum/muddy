/** Configure MobileInstance object as extension of Mobile */
module.exports.configMobileInstance = (world, ext, extConfig) => {
  return {
    tableName: `mobile_instances`,
    className: `MobileInstance`,
    extends: ext,
    extendsConfig: extConfig,
    properties: [
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `prototype`, instanceOf: `Mobile`, loadTransform: x => new world.Mobile({ id: x }) },
      { name: `equipment`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `inventory`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } }
    ]
  };
};
