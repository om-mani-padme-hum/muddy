/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure character object */
const configCharacter = {
  className: `Character`,
  properties: [
    { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
    { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
    { name: `names`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => x.toString()), saveTransform: x => x.join(` `), loadTransform: x => x.split(` `) },
    { name: `level`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
    { name: `lineage`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
    { name: `path`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
    { name: `health`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
    { name: `maxHealth`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
    { name: `mana`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
    { name: `maxMana`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
    { name: `energy`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
    { name: `maxEnergy`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
    { name: `affects`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    { name: `socket`, type: `Socket` },
    { name: `room`, instanceOf: `Room` },
    { name: `state`, type: `number`, setTransform: x => parseInt(x) },
    { name: `equipment`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? x : null) },
    { name: `inventory`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? x : null) }
  ],
  indexes: [
    { name: `name`, type: `BTREE`, columns: [ `name` ] }
  ]
};

/** Create character object */
ezobjects.createObject(configCharacter);

/** Export config */
module.exports.configCharacter = configCharacter;

/** Export object */
module.exports.Character = Character;
