module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `kill`,
      execute: async (world, user, buffer, args) => {
      },
      priority: 999
    })
  ];
};
