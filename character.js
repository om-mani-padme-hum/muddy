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
    { name: `affects`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    { name: `socket`, type: `Socket` },
    { name: `state`, type: `number`, setTransform: x => parseInt(x) },
    { name: `stats`, type: `object`, mysqlType: `text`, saveTransform: x => JSON.stringify(x), loadTransform: x => JSON.parse(x) },
    { name: `equipment`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) },
    { name: `inventory`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) }
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
