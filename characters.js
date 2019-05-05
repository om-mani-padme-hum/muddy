/** Configure Character object */
module.exports.configCharacter = (world) => {
  return {
    className: `Character`,
    properties: [
      { name: `air`, type: `int`, default: 1, store: false },
      { name: `accuracy`, type: `int`, default: 1, store: false },
      { name: `affects`, type: `Array`, arrayOf: { type: `int` } },
      { name: `armor`, type: `int`, default: 1, store: false },
      { name: `dodge`, type: `int`, default: 1, store: false },
      { name: `deflection`, type: `int`, default: 1, store: false },
      { name: `earth`, type: `int`, default: 1, store: false },
      { name: `energy`, type: `int`, default: 100 },
      { name: `fighting`, instanceOf: `Character`, store: false },
      { name: `fire`, type: `int`, default: 1, store: false },
      { name: `health`, type: `int`, default: 100 },
      { name: `id`, type: `int` },
      { name: `level`, type: `int`, default: 1 },
      { name: `life`, type: `int`, default: 1, store: false },
      { name: `mana`, type: `int`, default: 100 },
      { name: `maxEnergy`, type: `int`, default: 100, store: false },
      { name: `maxHealth`, type: `int`, default: 100, store: false },
      { name: `maxMana`, type: `int`, default: 100, store: false },
      { name: `name`, type: `varchar`, length: 32, default: `a boring person` },
      { name: `path`, type: `int` },
      { name: `position`, type: `int` },
      { name: `power`, type: `int`, default: 1, store: false },
      { name: `race`, type: `int` },
      { name: `sex`, type: `tinyint` },
      { name: `speed`, type: `int`, default: 1, store: false },
      { name: `water`, type: `int`, default: 1, store: false },
    ]
  };
};
