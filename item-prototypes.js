/** Configure ItemPrototype object */
module.exports.configItemPrototype = (world) => {
  return {
    tableName: `item_prototypes`,
    className: `ItemPrototype`,
    properties: [
      { name: `author`, type: `varchar`, length: 32, default: `Anonymous` },
      { name: `contents`, type: `Array`, arrayOf: { instanceOf: `ItemPrototype` } },
      { name: `created`, type: `datetime`, default: new Date() },
      { name: `description`, type: `varchar`, length: 512, default: `It looks like a wieghtless and translucent spherical form of bound energy.` },
      { name: `details`, type: `object` },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32, default: `a translucent sphere of energy` },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 }, default: [`sphere`, `energy`] },
      { name: `roomDescription`, type: `varchar`, length: 80, default: `a translucent sphere of energy` },
      { name: `slot`, type: `int`, default: world.constants().SLOT_NONE },
      { name: `type`, type: `int`, default: world.constants().ITEM_OTHER }
    ]
  };
};
