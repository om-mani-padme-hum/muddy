module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `quit`,
      execute: async (world, user, buffer) => {
        world.log().info(`User ${user.name()} has quit.`);

        /** Remove user from room */
        if ( user.room() )
          user.room().characters().splice(user.room().characters().indexOf(user), 1);

        /** Remove user from world */
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

        user.send(`Saved.\r\n`);
      }
    })
  ];
};
