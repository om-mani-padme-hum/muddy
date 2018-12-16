/** Create template for all directionection commands */
module.exports.createCommands = (world) => {
  const directionCommand = (direction) => {
    return new world.Command({
      name: direction,
      execute: async (world, user, buffer) => {
        /** Look for an exit in that direction */
        const exit = user.room().exits().find(x => x.direction() == world.constants().directions[direction]);

        if ( exit ) {
          /** If room exists, move user to room and look */
          await world.characterToRoom(user, exit.target());

          /** Find the look command and execute it for this user */
          world.commands().find(x => x.name() == `look`).execute()(world, user, ``, []);
        } else {
          /** If it doesn`t exist, send error message */
          user.send(`You cannot go that way.\r\n`);
        }
      },
      priority: [`se`, `sw`, `ne`, `nw`, `northeast`, `southeast`, `southwest`, `northwest`].includes(direction) ? 0 : 999
    });
  };

  return [
    directionCommand(`north`),
    directionCommand(`northeast`),
    directionCommand(`ne`),
    directionCommand(`east`),
    directionCommand(`southeast`),
    directionCommand(`se`),
    directionCommand(`south`),
    directionCommand(`southwest`),
    directionCommand(`sw`),
    directionCommand(`west`),
    directionCommand(`northwest`),
    directionCommand(`nw`),
    directionCommand(`up`),
    directionCommand(`down`)
  ];
};
