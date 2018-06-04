/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure exit object */
const configExit = {
  tableName: `exits`,
  className: `Exit`,
  properties: [
    { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
    { name: `dir`, type: `number`, mysqlType: `int` },
    { name: `to`, instanceOf: `Room` },
    { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
  ],
  indexes: [
    { name: `name`, type: `BTREE`, columns: [ `name` ] }
  ]
};

/** Create exit object */
ezobjects.createObject(configExit);

/** Export configs*/
module.exports.configExit = configExit;

/** Export objects */
module.exports.Exit = Exit;
