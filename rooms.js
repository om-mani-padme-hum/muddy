/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure room object */
module.exports.configRoom = (world) => {
  return {
    tableName: `rooms`,
    className: `Room`,
    properties: [
      { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
      { name: `area`, type: `Area`, mysqlType: `int`, initTransform: x => typeof x == 'number' ? world.areas().find(y => y.id() == x) : x, saveTransform: x => x.id(), loadTransform: x => world.areas().find(y => y.id() == x) },
      { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
      { name: `description`, type: `string`, mysqlType: `text` },
      { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
      { name: `exits`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Exit`) ? x : null) },
      { name: `characters`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Character`) ? x : null) },
      { name: `items`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? x : null) }
    ],
    indexes: [
      { name: `name`, type: `BTREE`, columns: [ `name` ] }
    ]
  };
};
