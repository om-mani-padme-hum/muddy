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

/** Configure user object as extension of character */
const configUser = {
  tableName: `users`,
  className: `User`,
  extends: Character,
  extendsConfig: configCharacter,
  properties: [
    { name: `password`, type: `string`, mysqlType: `text` }
  ]
};

/** Create user object */
ezobjects.createObject(configUser);

/** Create table if it doesn't exist */
ezobjects.createTable(configUser);

/** Configure Mobile object as extension of character */
const configMobile = {
  tableName: `mobiles`,
  className: `Mobile`,
  extends: Character,
  extendsConfig: configCharacter,
  properties: [
  ]
};

/** Create Mobile object */
ezobjects.createObject(configMobile);

/** Create table if it doesn't exist */
ezobjects.createTable(configMobile);

/** Export configs*/
module.exports.configCharacter = configCharacter;
module.exports.configMobile = configMobile;
module.exports.configUser = configUser;

/** Export objects */
module.exports.Character = Character;
module.exports.Mobile = Mobile;
module.exports.User = User;
