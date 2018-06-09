/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure area object */
const configArea = {
  tableName: `areas`,
  className: `Area`,
  properties: [
    { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
    { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
    { name: `author`, type: `string`, mysqlType: `varchar`, length: 32 },
    { name: `description`, type: `string`, mysqlType: `text` },
    { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    { name: `created`, type: `Date`, mysqlType: `datetime`, saveTransform: x => moment(x).format(`Y-MM-DD HH:mm:ss`), loadTransform: x => new Date(x) },
    { name: `characters`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Character`) ? null : x) },
    { name: `items`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) },
    { name: `rooms`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Room`) ? null : x) }
  ],
  indexes: [
    { name: `name`, type: `BTREE`, columns: [ `name` ] }
  ]
};

/** Create area object */
ezobjects.createObject(configArea);

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

/** Configure command object */
const configCommand = {
  className: `Command`,
  properties: [
    { name: `name`, type: `string` },
    { name: `command`, type: `function` },
    { name: `priority`, type: `number`, setTransform: x => parseInt(x) }
  ]
};

/** Create command object */
ezobjects.createObject(configCommand);

/** Configure exit object */
const configExit = {
  tableName: `exits`,
  className: `Exit`,
  properties: [
    { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
    { name: `dir`, type: `number`, mysqlType: `int` },
    { name: `to`, instanceOf: `Room` },
    { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
  ]
};

/** Create exit object */
ezobjects.createObject(configExit);

/** Configure item object */
const configItem = {
  tableName: `items`,
  className: `Item`,
  properties: [
    { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
    { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
    { name: `names`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => x.toString()), saveTransform: x => x.join(` `), loadTransform: x => x.split(` `) },
    { name: `description`, type: `string`, mysqlType: `text` },
    { name: `type`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
    { name: `slot`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
    { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    { name: `area`, instanceOf: `Area` },
    { name: `character`, instanceOf: `Character` },
    { name: `container`, instanceOf: `Item` },
    { name: `contains`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) },
    { name: `room`, instanceOf: `Room` }
  ],
  indexes: [
    { name: `name`, type: `BTREE`, columns: [ `name` ] },
    { name: `type`, type: `BTREE`, columns: [ `type` ] },
    { name: `slot`, type: `BTREE`, columns: [ `slot` ] }
  ]
};

/** Create item object */
ezobjects.createObject(configItem);

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

/** Configure room object */
const configRoom = {
  tableName: `rooms`,
  className: `Room`,
  properties: [
    { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
    { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
    { name: `description`, type: `string`, mysqlType: `text` },
    { name: `exits`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    { name: `area`, type: `Area` },
    { name: `characters`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Character`) ? null : x) },
    { name: `items`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) }
  ],
  indexes: [
    { name: `name`, type: `BTREE`, columns: [ `name` ] }
  ]
};

/** Create room object */
ezobjects.createObject(configRoom);

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

/** Export configs */
module.exports.configArea = configArea;
module.exports.configCharacter = configCharacter;
module.exports.configCommand = configCommand;
module.exports.configExit = configExit;
module.exports.configItem = configItem;
module.exports.configMobile = configMobile;
module.exports.configRoom = configRoom;
module.exports.configUser = configUser;

/** Export objects */
module.exports.Area = Area;
module.exports.Character = Character;
module.exports.Command = Command;
module.exports.Exit = Exit;
module.exports.Item = Item;
module.exports.Mobile = Mobile;
module.exports.Room = Room;
module.exports.User = User;
