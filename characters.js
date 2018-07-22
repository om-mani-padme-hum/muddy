/** Configure Character object */
module.exports.configCharacter = (world) => {
  return {
    className: `Character`,
    properties: [
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32 },
      { name: `level`, type: `int`, default: 1 },
      { name: `lineage`, type: `int` },
      { name: `path`, type: `int` },
      { name: `health`, type: `int`, default: 100 },
      { name: `mana`, type: `int`, default: 100 },
      { name: `energy`, type: `int`, default: 100 },
      { name: `maxHealth`, type: `int`, default: 100 },
      { name: `maxMana`, type: `int`, default: 100 },
      { name: `maxEnergy`, type: `int`, default: 100 },
      { name: `affects`, type: `Array`, arrayOf: { type: `int` } }
    ]
  };
};
