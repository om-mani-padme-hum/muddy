/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Require local modules */
const character = require('./character');

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

/** Export configs */
module.exports.configMobile = configMobile;

/** Export objects */
module.exports.Mobile = Mobile;
