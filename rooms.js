/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure room object */
const configRoom = {
  tableName: `rooms`,
  className: `Room`,
  properties: [
    { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
    { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
    { name: `description`, type: `string`, mysqlType: `text` },
    { name: `exits`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Exit`) ? x : null)  },
    { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    { name: `area`, type: `Area` },
    { name: `characters`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Character`) ? x : null) },
    { name: `items`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? x : null) }
  ],
  indexes: [
    { name: `name`, type: `BTREE`, columns: [ `name` ] }
  ]
};

/** Create room object */
ezobjects.createObject(configRoom);

/** Export config */
module.exports.configRoom = configRoom;

/** Export object */
module.exports.Room = Room;
