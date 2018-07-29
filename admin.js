const util = require(`util`);

module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `astat`,
      execute: async (world, user, buffer, args) => {
        const depth = world.parseDepth(user, args, 0);
        
        if ( depth >= 0 )
          user.send(`${util.inspect(user.room().area(), { depth: depth })}\r\n`);
      }
    }),
    new world.Command({
      name: `goto`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
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
      }
    }),
    new world.Command({
      name: `ilist`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Ilist what? [prototypes|instances]\r\n`);
        } else if ( `prototypes`.startsWith(args[0]) ) {
          let firstArea = true;
          
          world.areas().forEach((area) => {
            /** If there are no items, don't bother */
            if ( area.itemPrototypes().length == 0 )
              return;
            
            if ( !firstArea )
              user.send(`\r\n`);
            
            firstArea = false;
            
            user.send(`${area.name()}\r\n`);
            user.send(`*`.repeat(area.name().length) + `\r\n`);
            
            const idLength = Math.max(...area.itemPrototypes().map(x => x.id())).toString().length;

            area.itemPrototypes().forEach((item) => {
              user.send(`  [${item.id().toString().padEnd(idLength)}] ${item.name()}\r\n`);
            });
          });
        } else if ( `instances`.startsWith(args[0]) ) {
          const recursiveItemContents = (item, depth) => {
            const idLength = Math.max(...item.contents().map(x => x.id())).toString().length;
            
            item.contents().forEach((content) => {
              user.send(` `.repeat(depth) + `[${content.id().toString().padEnd(idLength)}] ${content.name()} (Contents)\r\n`);

              recursiveItemContents(content, depth + 2);
            });
          };
          
          let firstArea = true;
          
          world.areas().forEach((area) => {
            /** If there are no items, don't bother */
            if ( area.rooms().every(x => x.items().length == 0 && !x.mobiles().some(y => y.inventory().length > 0) 
              && !x.mobiles().some(y => y.equipment().length > 0) && !x.users().some(y => y.inventory().length > 0) 
              && !x.users().some(y => y.equipment().length > 0)) )
              return;
            
            if ( !firstArea )
              user.send(`\r\n`);
            
            firstArea = false;
            
            user.send(`Area: [${area.id()}] ${area.name()}\r\n`);
            user.send(`******` + `*`.repeat(area.id().toString().length + 3 + area.name().length) + `\r\n`);
            
            area.rooms().forEach((room) => {
              /** If there are no items, don't bother */
              if ( room.items().length == 0 && !room.mobiles().some(x => x.inventory().length > 0) 
                && !room.mobiles().some(x => x.equipment().length > 0) && !room.users().some(x => x.inventory().length > 0) 
                && !room.users().some(x => x.equipment().length > 0) )
                return;
                
              user.send(`\r\n  Room: [${room.id()}] ${room.name()}\r\n`);
              user.send(`  ======` + `=`.repeat(room.id().toString().length + 3 + room.name().length) + `\r\n`);

              const idLength = Math.max(...room.items().map(x => x.id())).toString().length;
              
              if ( room.items().length > 0 )
                user.send(`\r\n    Room Items:\r\n`);
              
              room.items().forEach((item) => {
                user.send(`      [${item.id().toString().padEnd(idLength)}] ${item.name()}\r\n`);
                
                recursiveItemContents(item, 6);
              });
              
              room.users().forEach((other) => {
                if ( other.equipment().length == 0 && other.inventory().length == 0 )
                  return;
                
                other.send(`\r\n    User: ${other.name()}\r\n`);
                          
                const idLength = Math.max(...other.inventory().map(x => x.id()).concat(other.equipment().map(x => x.id()))).toString().length;

                other.equipment().forEach((item) => {
                  user.send(`      [${item.id().toString().padEnd(idLength)}] ${item.name()} (Equipment)\r\n`);
                  
                  recursiveItemContents(item, 6);
                });
                
                other.inventory().forEach((item) => {
                  user.send(`      [${item.id().toString().padEnd(idLength)}] ${item.name()} (Inventory)\r\n`);
                  
                  recursiveItemContents(item, 6);
                });
              });
              
              room.mobiles().forEach((mobile) => {
                if ( mobile.equipment().length == 0 && mobile.inventory().length == 0 )
                  return;
                
                user.send(`\r\n    Mobile: [${mobile.id()}] ${mobile.name()}\r\n`);
                          
                const idLength = Math.max(...mobile.inventory().map(x => x.id()).concat(mobile.equipment().map(x => x.id()))).toString().length;

                mobile.equipment().forEach((item) => {
                  user.send(`      [${item.id().toString().padEnd(idLength)}] ${item.name()} (Equipment)\r\n`);
                  
                  recursiveItemContents(item, 6);
                });
                
                mobile.inventory().forEach((item) => {
                  user.send(`       [${item.id().toString().padEnd(idLength)}] ${item.name()} (Inventory)\r\n`);
                  
                  recursiveItemContents(item, 6);
                });
              });
            });
          });
        } else {
          user.send(`You don't know how to istat that.\r\n`);
        }
      }
    }),
    new world.Command({
      name: `istat`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Istat what?\r\n`);
          return;
        }
        
        const [name, count] = world.parseName(user, args, 0);
        const depth = world.parseDepth(user, args, 1);
        
        if ( depth >= 0 ) {
          let items = [];

          items = items.concat(user.equipment().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase()))));
          items = items.concat(user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase()))));
          items = items.concat(user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase()))));

          if ( items.length < count )
            user.send(`You can't find that item anywhere.\r\n`);
          else
            user.send(`${util.inspect(items[count - 1], { depth: depth })}\r\n`);
        }
      }
    }),
    new world.Command({
      name: `mstat`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
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
      }
    }),
    new world.Command({
      name: `mlist`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Mlist what? [prototypes|instances]\r\n`);
        } else if ( `prototypes`.startsWith(args[0]) ) {
          let firstArea = true;
          
          world.areas().forEach((area) => {
            /** If there are no mobiles, don't bother */
            if ( area.mobilePrototypes().length == 0 )
              return;
            
            if ( !firstArea )
              user.send(`\r\n`);
            
            firstArea = false;
            
            user.send(`${area.name()}\r\n`);
            user.send(`*`.repeat(area.name().length) + `\r\n`);
            
            const idLength = Math.max(...area.mobilePrototypes().map(x => x.id())).toString().length;

            area.mobilePrototypes().forEach((mobile) => {
              user.send(`  [${mobile.id().toString().padEnd(idLength)}] ${mobile.name()}\r\n`);
            });
          });
        } else if ( `instances`.startsWith(args[0]) ) {
          let firstArea = true;
          
          world.areas().forEach((area) => {
            /** If there are no items, don't bother */
            if ( area.rooms().every(x => x.mobiles().length == 0) )
              return;
            
            if ( !firstArea )
              user.send(`\r\n`);
            
            firstArea = false;
            
            user.send(`Area: [${area.id()}] ${area.name()}\r\n`);
            user.send(`******` + `*`.repeat(area.id().toString().length + 3 + area.name().length) + `\r\n`);
            
            area.rooms().forEach((room) => {
              /** If there are no items, don't bother */
              if ( room.mobiles().length == 0 )
                return;
                
              user.send(`\r\n  Room: [${room.id()}] ${room.name()}\r\n`);
              user.send(`  ======` + `=`.repeat(room.id().toString().length + 3 + room.name().length) + `\r\n`);

              const idLength = Math.max(...room.mobiles().map(x => x.id())).toString().length;
              
              room.mobiles().forEach((mobile) => {
                user.send(`    [${mobile.id().toString().padEnd(idLength)}] ${mobile.name()}\r\n`);
              });
            });
          });
        } else {
          user.send(`You don't know how to istat that.\r\n`);
        }
      }
    }),
    new world.Command({
      name: `rstat`,
      execute: async (world, user, buffer, args) => { 
        const depth = world.parseDepth(user, args, 0);
        
        if ( depth >= 0 )
          user.send(`${util.inspect(user.room(), { depth: depth })}\r\n`);
      }
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
      }
    }),
    new world.Command({
      name: `ustat`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
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
      }
    }),
  ];
};
