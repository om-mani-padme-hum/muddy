/** Configure Deployment object */
module.exports.configDeployment = (world) => {
  return {
    tableName: `deployments`,
    className: `Deployment`,
    properties: [
      { name: `count`, type: `int`, default: -1 },
      { name: `interval`, type: `int`, default: -1 },
      { name: `type`, type: `int`, default: -1 },
      { name: `what`, type: `int`, default: -1 },
      { name: `where`, type: `int`, default: -1 },
    ]
  };
};
