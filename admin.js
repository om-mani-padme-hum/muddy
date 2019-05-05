/** Require external modules */
const util = require(`util`);

module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `alist`,
      execute: async (world, user, buffer, args) => {
        /** Determine length of longest area id number */
        const idLength = Math.max(...world.areas().map(x => x.id())).toString().length;
        
        /** Send area id and name*/
        user.send(`Areas:\r\n`);

        /** Loop through each area in the world... */
        world.areas().forEach((area) => {
          /** Send area id and name*/
          user.send(`  [${area.id().toString().padEnd(idLength)}] ${area.name()}\r\n`);
        });
      }
    }),
    new world.Command({
      name: `astat`,
      execute: async (world, user, buffer, args) => {
        /** Parse depth of argument for util inspect */
        const depth = world.parseDepth(user, args, 0);
        
        /** If depth was parsed successfully, send util inspect of area */
        if ( depth >= 0 )
          user.send(`${util.inspect(user.room().area(), { depth: depth })}\r\n`);
      }
    }),
    new world.Command({
      name: `dlist`,
      execute: async (world, user, buffer, args) => {
        /** Determine length of longest area id number */
        const areaIdLength = Math.max(...world.areas().map(x => x.id())).toString().length;
        
        /** Create array of all areas in the world with deployments */
        const areas = world.areas().filter(x => x.deployments().length > 0);
        
        /** Loop through each area... */
        areas.forEach((area, index) => {
          /** If this is not the first area, send new line */
          if ( index > 0 )
            user.send(`\r\n`);

          /** Send area id and name */
          user.send(`Area: [${area.id().toString().padEnd(areaIdLength)}] ${area.name()}\r\n`);
          user.send(`******` + `*`.repeat(areaIdLength + 3 + area.name().length) + `\r\n`);
          
          /** Determine length of longest room id number */
          const deploymentIdLength = Math.max(...area.deployments().map(x => x.id())).toString().length;

          /** Loop through each deployment in the area... */
          area.deployments().forEach((deployment) => {
            user.send(`  [${deployment.id().toString().padEnd(deploymentIdLength)}] ${world.constants().deploymentNames[deployment.type()]} - (${deployment.count()}) of subject ID #${deployment.subject()} to target ID #${deployment.target()} - ${deployment.refresh()}s refresh\r\n`);
          });
        });
        
        /** If there were no areas with rooms, send error */
        if ( areas.length == 0 )
          user.send(`There are no deployments in this world.\r\n`);
      }
    }),
    new world.Command({
      name: `dstat`,
      execute: async (world, user, buffer, args) => {
        /** If no argument was provided, send error and return */
        if ( typeof args[0] != `string` )
          return user.send(`Dstat what?\r\n`);
        
        /** Parse name and count of first argument */
        const [name, count] = world.parseName(user, args, 0);
        
        /** Parse depth of second argument for util inspect */
        const depth = world.parseDepth(user, args, 1);
        
        /** If depth was parsed successfully... */
        if ( depth >= 0 ) {
          /** If the number of items is less than the count, send error */
          if ( world.deployments().length < count )
            user.send(`You can't find a reference to that deployment anywhere.\r\n`);
          
          /** Otherwise, send util inspect of item */
          else
            user.send(`${util.inspect(world.deployments()[count - 1], { depth: depth })}\r\n`);
        }
      }
    }),
    new world.Command({
      name: `goto`,
      execute: async (world, user, buffer, args) => {
        /** If no argument was provided, send error and return */
        if ( typeof args[0] != `string` )
          return user.send(`Goto where?\r\n`);
        
        /** Find target room in world by id argument if it exists */
        const room = world.rooms().find(x => x.id() == args[0]);
        
        /** If the room exists... */
        if ( room ) {
          /** Send action to user */
          user.send(`Your body evaporates away only to coalesce elsewhere.\r\n`);
          
          /** Send action to start room */
          user.room().send(`${user.name()} evaporates into nothingness.\r\n`, [user]);
          
          /** Move user to target room */
          await world.characterToRoom(user, room);
        
          /** Send action to arriving room */
          user.room().send(`${user.name()} coalesces out of nothingness.\r\n`, [user]);

          /** Execute 'look' command for user */
          world.commands().find(x => x.name() == `look`).execute()(world, user, ``, []);
        } 
        
        /** Otherwise, send error */
        else {
          user.send(`That room does not exist.\r\n`);
        }
      }
    }),
    new world.Command({
      name: `ilist`,
      execute: async (world, user, buffer, args) => {
        /** If no argument was provided, send error */
        if ( typeof args[0] != `string` )
          return user.send(`Ilist what? [instances|prototypes]\r\n`);
        
        /* If the argument is 'instances'... */
        if ( `instances`.startsWith(args[0]) ) {
          /** Create helper function for recursion of item contents */
          const recursiveItemContents = (item, depth) => {
            /** Determine length of longest item id number */
            const idLength = Math.max(...item.contents().map(x => x.id())).toString().length;
            
            /** Loop through each item in the container... */
            item.contents().forEach((content) => {
              /** Send item prototype id and name, incidating it is content of it's container */
              user.send(` `.repeat(depth) + `[${content.id().toString().padEnd(idLength)}] ${content.name()} (Contents)\r\n`);

              /** Recursively loop through any contents of this item */
              recursiveItemContents(content, depth + 2);
            });
          };
          
          /** Keep track of whether a given area is first or not */
          let firstArea = true;
          
          /** Loop through each area in the world... */
          world.areas().forEach((area) => {
            /** If there are no item instances in this area, skip it */
            if ( area.rooms().every(x => x.items().length == 0 && !x.mobiles().some(y => y.inventory().length > 0) 
              && !x.mobiles().some(y => y.equipment().length > 0) && !x.users().some(y => y.inventory().length > 0) 
              && !x.users().some(y => y.equipment().length > 0)) )
              return;
            
            /** If this is not the first area, send new line */
            if ( !firstArea )
              user.send(`\r\n`);
            
            /** Toggle first area boolean to false */
            firstArea = false;
            
            /** Send area id and name */
            user.send(`Area: [${area.id()}] ${area.name()}\r\n`);
            user.send(`******` + `*`.repeat(area.id().toString().length + 3 + area.name().length) + `\r\n`);
            
            /** Loop through each room in the area... */
            area.rooms().forEach((room) => {
              /** If there are no item instances in the room, skip it */
              if ( room.items().length == 0 && !room.mobiles().some(x => x.inventory().length > 0) 
                && !room.mobiles().some(x => x.equipment().length > 0) && !room.users().some(x => x.inventory().length > 0) 
                && !room.users().some(x => x.equipment().length > 0) )
                return;
                
              /** Send room id and name */
              user.send(`\r\n  Room: [${room.id()}] ${room.name()}\r\n`);
              user.send(`  ======` + `=`.repeat(room.id().toString().length + 3 + room.name().length) + `\r\n`);

              /** Determine length of longest item id number */
              const idLength = Math.max(...room.items().map(x => x.id())).toString().length;
              
              /** If there are items in the room, send room items header */
              if ( room.items().length > 0 )
                user.send(`\r\n    Room Items:\r\n`);
              
              /** Loop through each item in the room... */
              room.items().forEach((item) => {
                /** Send item id and name */
                user.send(`      [${item.id().toString().padEnd(idLength)}] ${item.name()}\r\n`);
                
                /** Recursively loop through any contents of the item */
                recursiveItemContents(item, 6);
              });
              
              /** Loop through each user in the room... */
              room.users().forEach((other) => {
                /** If user has no inventory or equipment, skip them */
                if ( other.equipment().length == 0 && other.inventory().length == 0 )
                  return;
                
                /** Send user name */
                other.send(`\r\n    User: ${other.name()}\r\n`);
                          
                /** Determine length of longest item id number */
                const idLength = Math.max(...other.inventory().map(x => x.id()).concat(other.equipment().map(x => x.id()))).toString().length;

                /** Loop through each item in user's equipment... */
                other.equipment().forEach((item) => {
                  /** Send item id and name */
                  user.send(`      [${item.id().toString().padEnd(idLength)}] ${item.name()} (Equipment)\r\n`);
                  
                  /** Recursively loop through any contents of the item */
                  recursiveItemContents(item, 6);
                });
                
                /** Loop through each item in user's inventory... */
                other.inventory().forEach((item) => {
                  /** Send item id and name */
                  user.send(`      [${item.id().toString().padEnd(idLength)}] ${item.name()} (Inventory)\r\n`);
                  
                  /** Recursively loop through any contents of the item */
                  recursiveItemContents(item, 6);
                });
              });
              
              /** Loop through each mobile in the room */
              room.mobiles().forEach((mobile) => {
                /** If mobile has no inventory or equipment, skip them */
                if ( mobile.equipment().length == 0 && mobile.inventory().length == 0 )
                  return;
                
                /** Send mobile id and name */
                user.send(`\r\n    Mobile: [${mobile.id()}] ${mobile.name()}\r\n`);
                          
                /** Determine length of longest item id number */
                const idLength = Math.max(...mobile.inventory().map(x => x.id()).concat(mobile.equipment().map(x => x.id()))).toString().length;

                /** Loop through each item in mobile's equipment... */
                mobile.equipment().forEach((item) => {
                  /** Send item id and name */
                  user.send(`      [${item.id().toString().padEnd(idLength)}] ${item.name()} (Equipment)\r\n`);
                  
                  /** Recursively loop through any contents of the item */
                  recursiveItemContents(item, 6);
                });
                
                /** Loop through each item in mobile's inventory... */
                mobile.inventory().forEach((item) => {
                  /** Send item id and name */
                  user.send(`       [${item.id().toString().padEnd(idLength)}] ${item.name()} (Inventory)\r\n`);
                  
                  /** Recursively loop through any contents of the item */
                  recursiveItemContents(item, 6);
                });
              });
            });
          });
          
          /** If there were no areas with item instances, send error */
          if ( firstArea )
            user.send(`There are no item instances in this world.\r\n`);
        } 
        
        /** Otherwise, if the argument is 'prototypes'... */
        else if ( `prototypes`.startsWith(args[0]) ) {
          
          /** Create array of areas with item prototypes */
          const areas = world.areas().filter(x => x.itemPrototypes().length > 0);
          
          /** Loop through each area in the world... */
          areas.forEach((area, index) => {
            /** If this is not the first area, send new line */
            if ( index > 0 )
              user.send(`\r\n`);
            
            /** Send area id and name*/
            user.send(`Area: [${area.id()}] ${area.name()}\r\n`);
            user.send(`******` + `*`.repeat(area.id().toString().length + 3 + area.name().length) + `\r\n`);
            
            /** Determine length of longest item prototype id number */
            const idLength = Math.max(...area.itemPrototypes().map(x => x.id())).toString().length;

            /** Loop through each item prototype in the area... */
            area.itemPrototypes().forEach((item) => {
              /** Send item prototype id and name */
              user.send(`  [${item.id().toString().padEnd(idLength)}] ${item.name()}\r\n`);
            });
          });
          
          /** If there were no areas with item prototypes, send error */
          if ( areas.length == 0 )
            user.send(`There are no item prototypes in this world.\r\n`);
        } 
        
        /** Otherwise, invalid argument, send error */
        else {
          user.send(`You don't know how to istat that.\r\n`);
        }
      }
    }),
    new world.Command({
      name: `istat`,
      execute: async (world, user, buffer, args) => {
        /** If no argument was provided, send error and return */
        if ( typeof args[0] != `string` )
          return user.send(`Istat what?\r\n`);
        
        /** Parse name and count of first argument */
        const [name, count] = world.parseName(user, args, 0);
        
        /** Parse depth of second argument for util inspect */
        const depth = world.parseDepth(user, args, 1);
        
        /** If depth was parsed successfully... */
        if ( depth >= 0 ) {
          /** Create items array */
          let items = [];

          /** Add user equipment, inventory, and room items with names matching the argument to array */
          items = items.concat(user.equipment().filter(x => x.names().some(y => y.toLowerCase().startsWith(name))));
          items = items.concat(user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name))));
          items = items.concat(user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name))));

          /** If the number of items is less than the count, send error */
          if ( items.length < count )
            user.send(`You can't find that item anywhere.\r\n`);
          
          /** Otherwise, send util inspect of item */
          else
            user.send(`${util.inspect(items[count - 1], { depth: depth })}\r\n`);
        }
      }
    }),
    new world.Command({
      name: `mstat`,
      execute: async (world, user, buffer, args) => {
        /** If no argument was provided, send error and return */
        if ( typeof args[0] != `string` )
          return user.send(`Mstat who?\r\n`);

        /** Parse name and count of first argument */
        const [name, count] = world.parseName(user, args, 0);
        
        /** Parse depth of second argument for util inspect */
        const depth = world.parseDepth(user, args, 1);
        
        /** If depth was parsed successfully... */
        if ( depth >= 0 ) {
          /** Create array of mobiles with name matching the argument */
          const mobiles = user.room().mobiles().filter(x => x.names().some(y => y.toLowerCase().startsWith(name)));

          /** If the number of mobiles is less than the count, send error */
          if ( mobiles.length < count )
            user.send(`You can't find that mobile anywhere.\r\n`);
          
          /** Otherwise, send util inspect of mobile */
          else
            user.send(`${util.inspect(mobiles[count - 1], { depth: depth })}\r\n`);
        }
      }
    }),
    new world.Command({
      name: `mlist`,
      execute: async (world, user, buffer, args) => {
        /** If no argument was provided, send error */
        if ( typeof args[0] != `string` )
          return user.send(`Mlist what? [instances|prototypes]\r\n`);
        
        /* If the argument is 'instances'... */
        if ( `instances`.startsWith(args[0]) ) {
          /** Create array of areas with mobile instances */
          const areas = world.areas().filter(x => x.rooms().some(x => x.mobiles().length > 0));
          
          /** Loop through each area in the world... */
          areas.forEach((area, index) => {
            /** If this is not the first area, send new line */
            if ( index > 0 )
              user.send(`\r\n`);
            
            /** Send area id and name */
            user.send(`Area: [${area.id()}] ${area.name()}\r\n`);
            user.send(`******` + `*`.repeat(area.id().toString().length + 3 + area.name().length) + `\r\n`);
            
            /** Loop through each room in the area... */
            area.rooms().filter(x => x.mobiles().length > 0).forEach((room) => {
              /** Send room id and name */  
              user.send(`\r\n  Room: [${room.id()}] ${room.name()}\r\n`);
              user.send(`  ======` + `=`.repeat(room.id().toString().length + 3 + room.name().length) + `\r\n`);

              /** Determine length of longest mobile id number */
              const idLength = Math.max(...room.mobiles().map(x => x.id())).toString().length;
              
              /** Loop through each mobile in the room... */
              room.mobiles().forEach((mobile) => {
                /** Send mobile id and name */
                user.send(`    [${mobile.id().toString().padEnd(idLength)}] ${mobile.name()}\r\n`);
              });
            });
          });
          
          /** If there were no areas with mobile instances, send error */
          if ( areas.length == 0 )
            user.send(`There are no mobile instances in this world.\r\n`);
        } 
        
        /* Otherwise, if the argument is 'prototypes'... */
        else if ( `prototypes`.startsWith(args[0]) ) {
          /** Create array of areas with mobile prototypes */
          const areas = world.areas().filter(x => x.mobilePrototypes().length > 0);
          
          /** Loop through each area in the world... */
          areas.forEach((area, index) => {
            /** If this is not the first area, send new line */
            if ( index > 0 )
              user.send(`\r\n`);

            /** Send area id and name */
            user.send(`Area: [${area.id()}] ${area.name()}\r\n`);
            user.send(`******` + `*`.repeat(area.id().toString().length + 3 + area.name().length) + `\r\n`);
            
            /** Determine length of longest mobile prototype id number */
            const idLength = Math.max(...area.mobilePrototypes().map(x => x.id())).toString().length;

            /** Loop through each mobile prototype in the area... */
            area.mobilePrototypes().forEach((mobile) => {
              /** Send mobile prototype id and name */
              user.send(`  [${mobile.id().toString().padEnd(idLength)}] ${mobile.name()}\r\n`);
            });
          });
          
          /** If there were no areas with mobile prototypes, send error */
          if ( areas.length == 0 )
            user.send(`There are no mobile prototypes in this world.\r\n`);
        } 
        
        /** Otherwise, invalid argument, send error */
        else {
          user.send(`You don't know how to istat that.\r\n`);
        }
      }
    }),
    new world.Command({
      name: `rlist`,
      execute: async (world, user, buffer, args) => {
        /** Determine length of longest area id number */
        const areaIdLength = Math.max(...world.areas().map(x => x.id())).toString().length;
        
        /** Create array of all areas in the world with rooms */
        const areas = world.areas().filter(x => x.rooms().length > 0);
        
        /** Loop through each area... */
        areas.forEach((area, index) => {
          /** If this is not the first area, send new line */
          if ( index > 0 )
            user.send(`\r\n`);

          /** Send area id and name */
          user.send(`Area: [${area.id().toString().padEnd(areaIdLength)}] ${area.name()}\r\n`);
          user.send(`******` + `*`.repeat(areaIdLength + 3 + area.name().length) + `\r\n`);
          
          /** Determine length of longest room id number */
          const roomIdLength = Math.max(...area.rooms().map(x => x.id())).toString().length;

          /** Loop through each room in the area... */
          area.rooms().forEach((room) => {
            user.send(`  [${room.id().toString().padEnd(roomIdLength)}] ${room.name()}\r\n`);
          });
        });
        
        /** If there were no areas with rooms, send error */
        if ( areas.length == 0 )
          user.send(`There are no rooms in this world.\r\n`);
      }
    }),
    new world.Command({
      name: `rstat`,
      execute: async (world, user, buffer, args) => {
        /** Parse depth of argument for util inspect */
        const depth = world.parseDepth(user, args, 0);
        
        /** If depth was parsed successfully, send util inspect of room */
        if ( depth >= 0 )
          user.send(`${util.inspect(user.room(), { depth: depth })}\r\n`);
      }
    }),
    new world.Command({
      name: `shutdown`,
      execute: async (world, user, buffer, args) => { 
        /** Loop through each user in the world */
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
        
        /** Exit the application with success code (0) */
        process.exit(0);
      }
    }),
    new world.Command({
      name: `ustat`,
      execute: async (world, user, buffer, args) => {
        /** If no argument was provided, send error and return */
        if ( typeof args[0] != `string` )
          return user.send(`Ustat who?\r\n`);

        /** Parse name and count of first argument */
        const [name, count] = world.parseName(user, args, 0);
        
        /** Parse depth of second argument for util inspect */
        const depth = world.parseDepth(user, args, 1);
        
        /** If depth was parsed successfully... */
        if ( depth >= 0 ) {
          /** Create array of users with name matching the argument */
          const users = user.room().users().filter(x => x.name().toLowerCase().startsWith(name) || ( name == `self` && x == user ) );

          /** If the number of users is less than the count, send error */
          if ( users.length < count )
            user.send(`You can't find that user anywhere.\r\n`);
          
          /** Otherwise, send util inspect of user */
          else
            user.send(`${util.inspect(users[count - 1], { depth: depth })}\r\n`);
        }
      }
    }),
  ];
};
