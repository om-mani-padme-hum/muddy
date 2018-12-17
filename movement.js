/** Create template for all directionection commands */
module.exports.createCommands = (world) => {
  const directionCommand = (direction) => {
    return new world.Command({
      name: direction,
      execute: async (world, user, buffer) => {
        /** Find exit in the direction specified, if one exists */
        const exit = user.room().exits().find(x => x.direction() == world.constants().directions[direction]);

        /** If the exit exists... */
        if ( exit ) {
          /** Move character to exit target room */
          await world.characterToRoom(user, exit.target());

          /** Find the look command and execute it for this user */
          world.commands().find(x => x.name() == `look`).execute()(world, user, ``, []);
        } 
        
        /** Otherwise, send error */
        else {
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
