/** Configure ItemInstance object */
module.exports.configItemInstance = (world) => {
  return {
    tableName: `item_instances`,
    className: `ItemInstance`,
    properties: [
      { name: `accuracy`, type: `int` },
      { name: `armor`, type: `int` },
      { name: `character`, instanceOf: `Character`, store: false },
      { name: `container`, instanceOf: `ItemInstance`, store: false },
      { name: `contents`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `deflection`, type: `int` },
      { name: `deployment`, type: `Deployment`, store: false },
      { name: `description`, type: `varchar`, length: 512, default: `It looks like a wieghtless and translucent spherical form of bound energy.` },
      { name: `details`, type: `object` },
      { name: `dodge`, type: `int` },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32, default: `a translucent sphere of energy` },
      { name: `names`, type: `Array`, default: [`sphere`, `energy`], arrayOf: { type: `varchar`, length: 32 } },
      { name: `power`, type: `int` },
      { name: `prototype`, instanceOf: `ItemPrototype`, loadTransform: x => new world.ItemPrototype({ id: x }) },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `roomDescription`, type: `varchar`, length: 80, default: `a translucent sphere of energy is floating here` },
      { name: `slot`, type: `int`, default: world.constants().SLOT_NONE },
      { name: `speed`, type: `int` },
      { name: `type`, type: `int`, default: world.constants().ITEM_OTHER }
    ]
  };
};
