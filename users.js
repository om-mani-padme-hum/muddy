/** Configure user object as extension of character */
module.exports.configUser = (world, ext, extConfig) => {
  return {
    tableName: `users`,
    className: `User`,
    extends: ext,
    extendsConfig: extConfig,
    properties: [
      { name: `addresses`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => typeof x == `string` ? `` : x), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
      { name: `lastRoom`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `password`, type: `string`, mysqlType: `text` },
      { name: `salt`, type: `string`, mysqlType: `text` },
      { name: `experience`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `health`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
      { name: `mana`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
      { name: `energy`, type: `number`, mysqlType: `int`, default: 100, setTransform: x => parseInt(x) },
      { name: `area`, instanceOf: `Area` },
      { name: `socket`, instanceOf: `Socket` },
      { name: `state`, type: `number`, default: world.constants().STATE_NAME, setTransform: x => parseInt(x) }
    ],
    indexes: [
      { name: `name`, type: `BTREE`, columns: [ `name` ] }
    ],
    stringSearchField: `name`
  };
};
