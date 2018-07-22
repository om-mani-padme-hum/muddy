const util = require('util');

module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `astat`,
      execute: async (world, user, buffer, args) => {
        const depth = world.parseDepth(user, args, 0);
        
        if ( depth >= 0 )
          user.send(`${util.inspect(user.room().area(), { depth: depth })}\r\n`);
      },
      priority: 0
    }),
    new world.Command({
      name: `goto`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != 'string' ) {
          user.send(`Goto where?\r\n`);
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
    }),
    new world.Command({
      name: `istat`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != 'string' ) {
          user.send(`Istat what?\r\n`);
          return;
        }
        
        const [name, count] = world.parseName(user, args, 0);
        const depth = world.parseDepth(user, args, 1);
        
        if ( depth >= 0 ) {
          let items = [];

          items = items.concat(items, user.equipment().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase()))));
          items = items.concat(items, user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase()))));
          items = items.concat(items, user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase()))));

          if ( items.length < count )
            user.send(`You can't find that item anywhere.\r\n`);
          else
            user.send(`${util.inspect(items[count - 1], { depth: depth })}\r\n`);
        }
      },
      priority: 0
    }),
    new world.Command({
      name: `mstat`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != 'string' ) {
          user.send(`Mstat who?\r\n`);
          return;
        }

        const [name, count] = world.parseName(user, args, 0);
        const depth = world.parseDepth(user, args, 1);
        
        if ( depth >= 0 ) {  
          const mobiles = user.room().mobiles().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));

          if ( mobiles.length < count )
            user.send(`You can't find that mobile anywhere.\r\n`);
          else
            user.send(`${util.inspect(mobiles[count - 1], { depth: depth })}\r\n`);
        }
      },
      priority: 0
    }),
    new world.Command({
      name: `rstat`,
      execute: async (world, user, buffer, args) => { 
        const depth = world.parseDepth(user, args, 0);
        
        if ( depth >= 0 )
          user.send(`${util.inspect(user.room(), { depth: depth })}\r\n`);
      },
      priority: 0
    }),
    new world.Command({
      name: `shutdown`,
      execute: async (world, user, buffer, args) => {        
        for ( let i = 0, i_max = world.users().length; i < i_max; i++ ) {          
          /** Save user */
          await world.users()[i].update(world.database());
          
          /** Remove user from anywhere */
          world.characterFromAnywhere(world.users()[i]);

          /** Goodbye */
          world.users()[i].socket().end(`The world fades away.. as if someone just flipped a switch on the universe.\r\n`);

          /** Null out socket */
          world.users()[i].socket(null);
        }
        
        process.exit(0);
      },
      priority: 0
    }),
    new world.Command({
      name: `ustat`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != 'string' ) {
          user.send(`Ustat who?\r\n`);
          return;
        }

        const [name, count] = world.parseName(user, args, 0);
        const depth = world.parseDepth(user, args, 1);
        
        if ( depth >= 0 ) {
          const users = user.room().users().filter(x => x.name().toLowerCase().startsWith(name.toLowerCase()));

          if ( users.length < count )
            user.send(`You can't find that user anywhere.\r\n`);
          else
            user.send(`${util.inspect(users[count - 1], { depth: depth })}\r\n`);
        }
      },
      priority: 0
    }),
  ];
};
