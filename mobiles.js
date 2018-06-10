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
    { name: `scripts`, type: `Array`, setTransform: x => x.map(x => typeof x == `function` ? x : function () {}) },
    { name: `health`, type: `number`, default: 100, setTransform: x => parseInt(x) },
    { name: `mana`, type: `number`, default: 100, setTransform: x => parseInt(x) },
    { name: `energy`, type: `number`, default: 100, setTransform: x => parseInt(x) }
  ]
};

/** Create Mobile object */
ezobjects.createObject(configMobile);

/** Export config */
module.exports.configMobile = configMobile;

/** Export objects */
module.exports.Mobile = Mobile;
