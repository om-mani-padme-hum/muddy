/** Configure ItemInstance object */
module.exports.configItemInstance = (world) => {
  return {
    tableName: `item_instances`,
    className: `ItemInstance`,
    properties: [
      { name: `id`, type: `int` },
      { name: `prototype`, instanceOf: `Item`, loadTransform: x => new world.Item({ id: x }) },
      { name: `name`, type: `varchar`, length: 32 },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 } },
      { name: `description`, type: `varchar`, length: 512 },
      { name: `type`, type: `int` },
      { name: `slot`, type: `int` },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `character`, instanceOf: `Character`, store: false },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `container`, instanceOf: `ItemInstance`, store: false },
      { name: `contents`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } }
    ],
    indexes: [
      { name: `type`, type: `BTREE`, columns: [ `type` ] },
      { name: `slot`, type: `BTREE`, columns: [ `slot` ] }
    ]
  };
};
