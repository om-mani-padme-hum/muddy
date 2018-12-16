/** Configure ItemPrototype object */
module.exports.configItemPrototype = (world) => {
  return {
    tableName: `item_prototypes`,
    className: `ItemPrototype`,
    properties: [
      { name: `contents`, type: `Array`, arrayOf: { instanceOf: `ItemPrototype` } },
      { name: `created`, type: `datetime` },
      { name: `description`, type: `varchar`, length: 512 },
      { name: `details`, type: `object` },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32 },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 } },
      { name: `roomDescription`, type: `varchar`, length: 80 },
      { name: `slot`, type: `int` },
      { name: `type`, type: `int` }
    ]
  };
};
