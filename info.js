module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `character`,
      execute: async (world, user, buffer, args) => {
      },
      priority: 0
    }),
    new world.Command({
      name: `commands`,
      execute: async (world, user, buffer, args) => {
        let text = ``;
        
        world.commands().forEach((command) => {
          text += `${command.name()} `;
        });
        
        user.send(world.terminalWrap(`${text}\r\n`));
      },
      priority: 0
    })
  ];
};
