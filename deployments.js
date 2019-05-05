/** Configure Deployment object */
module.exports.configDeployment = (world) => {
  return {
    tableName: `deployments`,
    className: `Deployment`,
    properties: [
      { name: `count`, type: `int` },
      { name: `refresh`, type: `int` },
      { name: `subject`, type: `int` },
      { name: `target`, type: `int` },
      { name: `type`, type: `int` },
    ]
  };
};
