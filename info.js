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
        /** Loop through each command in world */
        world.commands().forEach((command, index) => {
          /** If this is the fifth command on this line, send new line */
          if ( index != 0 && index % 4 == 0 )
            user.send(`\r\n`);
          
          /** Send command name */
          user.send(`${command.name().padEnd(16)} `);
        });
        
        /** Send new line */
        user.send(`\r\n`);
      },
      priority: 0
    })
  ];
};
