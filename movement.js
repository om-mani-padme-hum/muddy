/** Create template for all direction commands */
module.exports.createCommands = (world) => {
  const dirCommand = (dir) => {
    return new world.Command({
      name: dir,
      execute: async (world, user, buffer) => {
        /** Look for an exit in that direction */
        const exit = user.room().exits().find(x => world.constants().dirNames[x.dir()] == dir);

        if ( exit ) {
          /** If it exists, get the room it goes to */
          const room = world.rooms().find(x => x.id() == exit.target());

          if ( room ) {
            /** If room exists, move user to room and look */
            user.room(room);

            /** Find the look command and execute it for this user */
            this.commands(`look`).execute()(world, user, ``);
          } else {
            /** If room doesn`t exist, notify imps and send user an error message */
            world.log().info(`Bad exit: direction ${dir} from room ${user.room().id()}.`);

            user.send(`Some kind of invisible force is blocking your way.\r\n`);
          }
        } else {
          /** If it doesn`t exist, send error message */
          user.send(`You cannot go that way.\r\n`);
        }
      },
      priority: [`northeast`, `southeast`, `southwest`, `northwest`].includes(dir) ? 0 : 999
    });
  };

  return [
    dirCommand(`north`),
    dirCommand(`northeast`),
    dirCommand(`ne`),
    dirCommand(`east`),
    dirCommand(`southeast`),
    dirCommand(`se`),
    dirCommand(`south`),
    dirCommand(`southwest`),
    dirCommand(`sw`),
    dirCommand(`west`),
    dirCommand(`northwest`),
    dirCommand(`nw`),
    dirCommand(`up`),
    dirCommand(`down`)
  ];
};
