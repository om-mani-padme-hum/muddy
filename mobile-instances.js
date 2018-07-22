/** Configure MobileInstance object as extension of Mobile */
module.exports.configMobileInstance = (world, ext, extConfig) => {
  return {
    tableName: `mobile_instances`,
    className: `MobileInstance`,
    extends: ext,
    extendsConfig: extConfig,
    properties: [
      { name: `description`, type: `varchar`, length: 512 },
      { name: `roomDescription`, type: `varchar`, length: 80 },
      { name: `prototype`, instanceOf: `Mobile`, loadTransform: x => new world.Mobile({ id: x }) },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 } },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `equipment`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `inventory`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } }
    ]
  };
};
