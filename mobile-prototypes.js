/** Configure MobilePrototype object as extension of Character */
module.exports.configMobilePrototype = (world, ext, extConfig) => {
  return {
    tableName: `mobile_prototypes`,
    className: `MobilePrototype`,
    extends: ext,
    extendsConfig: extConfig,
    properties: [
      { name: `created`, type: `datetime` },
      { name: `description`, type: `varchar`, length: 512 },
      { name: `equipment`, type: `Array`, arrayOf: { instanceOf: `ItemPrototype` } },
      { name: `inventory`, type: `Array`, arrayOf: { instanceOf: `ItemPrototype` } },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 } },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `roomDescription`, type: `varchar`, length: 80 },
      { name: `scripts`, type: `Array`, arrayOf: { type: `function` } }
    ]
  };
};
