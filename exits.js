/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure exit object */
module.exports.configExit = (world) => {
  return {
    tableName: `exits`,
    className: `Exit`,
    properties: [
      { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
      { name: `room`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `direction`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `target`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
      { name: `from`, instanceOf: `Room` },
      { name: `to`, instanceOf: `Room` }
    ]
  };
};
