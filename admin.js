module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `goto`,
      execute: async (world, user, buffer, args) => {
      },
      priority: 0
    })
  ];
};
