/** Configure Character object */
module.exports.configCharacter = (world) => {
  return {
    className: `Character`,
    properties: [
      { name: `affects`, type: `Array`, arrayOf: { type: `int` } },
      { name: `dodge`, type: `double`, default: 10 },
      { name: `energy`, type: `int`, default: 100 },
      { name: `fighting`, instanceOf: `Character`, store: false },
      { name: `health`, type: `int`, default: 100 },
      { name: `id`, type: `int` },
      { name: `level`, type: `int`, default: 1 },
      { name: `lineage`, type: `int` },
      { name: `mana`, type: `int`, default: 100 },
      { name: `maxEnergy`, type: `int`, default: 100 },
      { name: `maxHealth`, type: `int`, default: 100 },
      { name: `maxMana`, type: `int`, default: 100 },
      { name: `name`, type: `varchar`, length: 32, default: `a boring person` },
      { name: `path`, type: `int` },
      { name: `position`, type: `int` }
    ]
  };
};
