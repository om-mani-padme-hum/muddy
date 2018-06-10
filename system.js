/** Require local modules */
const commands = require(`./commands`);

module.exports = [
  new commands.Command({
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
  new commands.Command({
    name: `save`,
    execute: async (world, user, buffer) => {
      await user.save(world.database());

      user.send(`Saved.\r\n`);
    }
  })
];
