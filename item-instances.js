/** Configure ItemInstance object */
module.exports.configItemInstance = (world) => {
  return {
    tableName: `item_instances`,
    className: `ItemInstance`,
    properties: [
      { name: `character`, instanceOf: `Character`, store: false },
      { name: `container`, instanceOf: `ItemInstance`, store: false },
      { name: `contents`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `description`, type: `varchar`, length: 512, default: `It looks like a wieghtless and translucent spherical form of bound energy.` },
      { name: `details`, type: `object` },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32, default: `a translucent sphere of energy` },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 }, default: [`sphere`, `energy`] },
      { name: `prototype`, instanceOf: `ItemPrototype`, loadTransform: x => new world.ItemPrototype({ id: x }) },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `roomDescription`, type: `varchar`, length: 80, default: `a translucent sphere of energy` },
      { name: `slot`, type: `int`, default: world.constants().SLOT_NONE },
      { name: `type`, type: `int`, default: world.constants().ITEM_OTHER }
    ]
  };
};
