module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `get`,
      execute: async (world, user, buffer, args) => {
      },
      priority: 0
    })
  ];
};
