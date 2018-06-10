/** Require local modules */
const commands = require(`./commands`);

module.exports = [
  new commands.Command({
    name: `look`,
    execute: async (world, user, buffer) => {
      /** Send room name */
      user.send(`${user.room().name()}\r\n`);

      /** Send exits */
      user.send(`[Exits:`);

      /** Count the exits to see if there are any */
      let count = 0;

      /** Loop through exits in user`s room */
      user.room().exits().forEach((exit) => {
        /** Separate exit names with spaces */
        user.send(` `);

        /** Send exit name based on direction */
        user.send(world.constants().dirNames[exit.dir()]);

        count++;
      });

      /** No exits, output none */
      if ( count == 0 )
        user.send(` None`);

      user.send(`]\r\n`);

      /** Send room description */
      user.send(`${user.room().description()}\r\n`);

      /** Send other users in the room */
      user.room().characters().forEach((other) => {
        if ( user != other )
          user.send(`${other.name()} is standing here.\r\n`);
      });

      /** Send any objets in the room */
      user.room().items().forEach((item) => {
        user.send(`    ${item.name()} sits here.\r\n`);
      });
    },
    priority: 999
  })
];
