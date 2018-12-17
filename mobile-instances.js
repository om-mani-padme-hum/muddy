/** Configure MobileInstance object as extension of Mobile */
module.exports.configMobileInstance = (world, ext, extConfig) => {
  return {
    tableName: `mobile_instances`,
    className: `MobileInstance`,
    extends: ext,
    extendsConfig: extConfig,
    properties: [
      { name: `description`, type: `varchar`, length: 512, default: `They look like the most boring person you could possibly imagine.` },
      { name: `equipment`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `inventory`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 }, default: [`person`] },
      { name: `prototype`, instanceOf: `MobilePrototype`, loadTransform: x => new world.MobilePrototype({ id: x }) },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `roomDescription`, type: `varchar`, length: 80, default: `a boring person stands here` }
    ]
  };
};
