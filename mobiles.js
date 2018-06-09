/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Require local modules */
const characters = require(`./characters`);

/** Configure Mobile object as extension of character */
const configMobile = {
  tableName: `mobiles`,
  className: `Mobile`,
  extends: characters.Character,
  extendsConfig: characters.configCharacter,
  properties: [
  ]
};

/** Create Mobile object */
ezobjects.createObject(configMobile);

/** Export configs */
module.exports.configMobile = configMobile;

/** Export objects */
module.exports.Mobile = Mobile;
