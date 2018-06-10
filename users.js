/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Require local modules */
const characters = require(`./characters`);
const constants = require(`./constants`);

/** Configure user object as extension of character */
const configUser = {
  tableName: `users`,
  className: `User`,
  extends: characters.Character,
  extendsConfig: characters.configCharacter,
  properties: [
    { name: `lastAddress`, type: `string`, mysqlType: `text` },
    { name: `lastRoom`, type: `number`, mysqlType: `int` },
    { name: `password`, type: `string`, mysqlType: `text` },
    { name: `salt`, type: `string`, mysqlType: `text` },
    { name: `state`, type: `number`, default: constants.STATE_NAME, setTransform: x => parseInt(x) },
    { name: `health`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
    { name: `mana`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
    { name: `energy`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) }
  ],
  stringSearchField: `name`
};

/** Create user object */
ezobjects.createObject(configUser);

User.prototype.save = async function (db) {
  if ( this.id() == 0 )
    await this.insert(db);
  else
    await this.update(db);
};

/** Export config */
module.exports.configUser = configUser;

/** Export object */
module.exports.User = User;
