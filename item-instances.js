/** Configure ItemInstance object */
module.exports.configItemInstance = (world) => {
  return {
    tableName: `item_instances`,
    className: `ItemInstance`,
    properties: [
      { name: `character`, instanceOf: `Character`, store: false },
      { name: `container`, instanceOf: `ItemInstance`, store: false },
      { name: `contents`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `description`, type: `varchar`, length: 512 },
      { name: `details`, type: `object` },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32 },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 } },
      { name: `prototype`, instanceOf: `Item`, loadTransform: x => new world.Item({ id: x }) },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `roomDescription`, type: `varchar`, length: 80 },
      { name: `slot`, type: `int` },
      { name: `type`, type: `int` }
    ]
  };
};
