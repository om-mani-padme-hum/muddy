/** Require local modules */
const commands = require(`./commands`);

module.exports = [
  new commands.Command(this, {
    name: `quit`,
    command: (world, user, buffer) => {
      console.log(`User ${user.name()} has quit.`);

      /** Remove user from room */
      if ( user.room() )
        user.room().users().splice(user.room().users().indexOf(user), 1);

      /** Remove user from world */
      world.users().splice(world.users().indexOf(user), 1);

      /** Goodbye */
      user.socket().end(`Goodbye!\r\n`);
    }
  }),
  new commands.Command(this, {
    name: `save`,
    command: (world, user, buffer) => {
      user.save(world.database());

      user.send(`Saved.\r\n`);
    }
  })
];
