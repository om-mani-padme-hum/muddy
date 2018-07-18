/** Configure Exit object */
module.exports.configExit = (world) => {
  return {
    tableName: `exits`,
    className: `Exit`,
    properties: [
      { name: `id`, type: `int` },
      { name: `direction`, type: `int` },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `target`, instanceOf: `Room`, loadTransform: x => new world.Room({ id: x }) },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } }
    ]
  };
};
