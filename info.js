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
        world.commands().forEach((command, index) => {
          if ( index != 0 && index % 4 == 0 )
            user.send(`\r\n`);
          
          user.send(`${command.name().padEnd(16)} `);
        });
        
        user.send(`\r\n`);
      },
      priority: 0
    })
  ];
};
