/** Require external modules */
const ezobjects = require(`ezobjects`);
const moment = require(`moment`);

/** Configure area object */
module.exports.configArea = (world) => {
  return {
    tableName: `areas`,
    className: `Area`,
    properties: [
      { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
      { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
      { name: `author`, type: `string`, mysqlType: `varchar`, length: 32 },
      { name: `description`, type: `string`, mysqlType: `text` },
      { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
      { name: `created`, type: `Date`, mysqlType: `datetime`, saveTransform: x => moment(x).format(`Y-MM-DD HH:mm:ss`), loadTransform: x => new Date(x) },
      { name: `characters`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Character`) ? x : null) },
      { name: `items`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? x : null) },
      { name: `rooms`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Room`) ? x : null) }
    ],
    indexes: [
      { name: `name`, type: `BTREE`, columns: [ `name` ] }
    ]
  };
};

