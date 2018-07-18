module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `goto`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != 'string' ) {
          user.send(`Goto where?`);
          return;
        }
        
        const room = world.rooms().find(x => x.id() == args[0]);
        
        if ( room ) {
          user.send(`Your body evaporates away only to coalesce elsewhere.\r\n`);
          world.characterToRoom(user, room);
          world.commands().find(x => x.name() == `look`).execute()(world, user, ``, []);
        } else {
          user.send(`That room does not exist.\r\n`);
        }
      },
      priority: 0
    })
  ];
};
