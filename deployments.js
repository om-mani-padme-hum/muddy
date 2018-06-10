/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure item object */
module.exports.configDeployment = (world) => {
  return {
    tableName: `deployments`,
    className: `Deployment`,
    properties: [
      { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
      { name: `type`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `objectId`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `targetId`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `quantity`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) }
    ]
  };
};
