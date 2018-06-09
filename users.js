/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Require local modules */
const characters = require(`./characters`);
const constants = require('./constants');

/** Configure user object as extension of character */
const configUser = {
  tableName: `users`,
  className: `User`,
  extends: characters.Character,
  extendsConfig: characters.configCharacter,
  properties: [
    { name: `lastAddress`, type: `string`, mysqlType: `text` },
    { name: `password`, type: `string`, mysqlType: `text` },
    { name: `salt`, type: `string`, mysqlType: 'text' },
    { name: `state`, type: `number`, default: constants.STATE_NAME, setTransform: x => parseInt(x) }
  ],
  stringSearchField: 'name'
};

/** Create user object */
ezobjects.createObject(configUser);

User.prototype.prompt = function () {
  this.send('[0xp] <1000hp 1000m 1000e> ');
};

User.prototype.send = function (buffer) {
  if ( this.socket() )
    this.socket().write(buffer);
};

/** Export config */
module.exports.configUser = configUser;

/** Export object */
module.exports.User = User;
