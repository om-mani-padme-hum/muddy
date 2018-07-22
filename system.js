module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `quit`,
      execute: async (world, user, buffer) => {
        world.log().info(`User ${user.name()} has quit.`);

        /** Save user */
        await user.update(world.database());
        
        /** Remove user from anywhere */
        world.characterFromAnywhere(user);

        /** Remove user from world */
        if ( world.users().indexOf(user) !== -1 )
          world.users().splice(world.users().indexOf(user), 1);

        /** Goodbye */
        user.socket().end(`Goodbye!\r\n`);

        /** Null out socket */
        user.socket(null);
      }
    }),
    new world.Command({
      name: `save`,
      execute: async (world, user, buffer) => {
        if ( user.id() == 0 )
          await user.insert(world.database());
        else
          await user.update(world.database());

        world.log().silly(`${user.name()} saved.`);
        
        user.send(`Saved.\r\n`);
      }
    })
  ];
};
