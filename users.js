/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Require local modules */
const characters = require(`./characters`);

/** Configure user object as extension of character */
const configUser = {
  tableName: `users`,
  className: `User`,
  extends: characters.Character,
  extendsConfig: characters.configCharacter,
  properties: [
    { name: `password`, type: `string`, mysqlType: `text` }
  ]
};

/** Create user object */
ezobjects.createObject(configUser);

/** Export config */
module.exports.configUser = configUser;

/** Export object */
module.exports.User = User;
