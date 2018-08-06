module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `create`,
      execute: async (world, user, buffer, args) => {
        /** Is there a valid create type argument? */
        if ( typeof args[0] != `string` ) {
          user.send(`Create what? [area|room|prototype|deployment|instance]\r\n`);
        } else if ( `deployment`.startsWith(args[0]) ) {
          /** Todo */
        } else if ( `instance`.startsWith(args[0]) ) {
          /** Is there a valid instance type argument? */
          if ( typeof args[1] != `string` ) {
            user.send(`Create what kind of instance? [item|mobile]\r\n`);
          } else if ( `item`.startsWith(args[1])  ) {
            if ( typeof args[2] != `string` ) {
              user.send(`Create an instance of what item prototype ID?\r\n`);
            } else {
              const prototypes = [];

              const prototype = world.itemPrototypes().find(x => x.id() == parseInt(args[2]));
              
              if ( !prototype ) {
                user.send(`There is not an item prototype with that ID.\r\n`);
                return;
              }
                
              const roomItem = typeof args[3] == `string` && `room`.startsWith(args[3]);

              const itemInstance = await world.itemInstanceFromPrototype(prototype);

              if ( roomItem ) {
                world.itemToRoom(itemInstance, user.room());
                await user.room().update(world.database());            
              } else {
                world.itemToInventory(itemInstance, user);
                await user.update(world.database());
              }
              
              user.send(`You draw in energy from the space around and materialize it into ${prototype.name()}.\r\n`);
            }          
          } else if ( `mobile`.startsWith(args[1]) ) {
            if ( typeof args[2] != `string` ) {
              user.send(`Create an instance of what mobile prototype ID?\r\n`);
            } else {
              const prototypes = [];
              
              world.areas().forEach((area) => {
                area.mobilePrototypes().forEach((prototype) => {
                  prototypes.push(prototype);
                });
              });
              
              const prototype = prototypes.find(x => parseInt(args[2]));
              
              if ( !prototype ) {
                user.send(`There is not a mobile prototype with that ID.\r\n`);
                return;
              }

              /** @todo inventory and equipment deployments */
              const mobileInstance = new world.MobileInstance({
                prototype: prototype,
                name: prototype.name(),
                names: prototype.names(),
                description: prototype.description(),
                roomDescription: prototype.roomDescription()
              });

              await mobileInstance.insert(world.database());

              world.characterToRoom(mobileInstance, user.room());
              
              await user.room().update(world.database());
              
              user.send(`You draw in energy from the space around and materialize it into a living being.\r\n`);
            }
          }
        } else if ( `prototype`.startsWith(args[0]) ) {
          /** Is there a valid prototype argument? */
          if ( typeof args[1] != `string` ) {
            user.send(`Create what kind of prototype? [item|mobile]\r\n`);
          } 
          
          /** Create prototype item */
          else if ( `item`.startsWith(args[1]) ) {
            /** Create new Item object with boring properties */
            const item = new world.Item({
              name: `a translucent sphere of energy`,
              names: [`ball`, `energy`],
              description: `It looks like a wieghtless and translucent spherical form of bound energy.`,
              roomDescription: `a translucent sphere of energy`
            });

            /** Insert it into the database */
            await item.insert(world.database());

            /** Add it as a prototype of the area and save */
            user.room().area().itemPrototypes().push(item);
            await user.room().area().update(world.database());
            
            user.send(`You create an item from nothing, then spatially compress and store it as ID ${item.id()}.\r\n`);
          } 
          
          /** Create prototype mobile */
          else if ( `mobile`.startsWith(args[1]) ) {
            /** Create new Mobile object with boring properties */
            const mobile = new world.Mobile({
              name: `a boring person`,
              names: [`person`],
              description: `They look like the most boring person you could possibly imagine.`,
              roomDescription: `a boring person stands here`
            });

            /** Insert it into the database */
            await mobile.insert(world.database());
            
            /** Add it as a prototype of the area and save */
            user.room().area().mobilePrototypes().push(mobile);
            await user.room().area().update(world.database());

            user.send(`You create a mobile from nothing, then spatially compress and store it as ID ${mobile.id()}.\r\n`);
          } 
          
          /** Send error if not a valid prototype */
          else {
            user.send(`You do not know how to build that.\r\n`);
          }
        } else if ( `area`.startsWith(args[0])  ) {
          /** Is there a valid area connection argument? */
          if ( typeof args[1] != `string` ) {
            user.send(`How should the area be connected? [isolated|n|w|s|e|nw|ne|sw|se|u|d]\r\n`);
          } else if (  `isolated`.startsWith(args[1]) ) {
            const area = new world.Area({
              name: `A boring area`,
              description: `This area is totally boring, who would visit here?`,
              author: user.name(),
              created: new Date()
            });

            await area.insert(world.database());

            const room = new world.Room({
              name: `A boring room`,
              description: `This room looks quite boring, just plain everything.`,
              area: user.room().area()
            });

            area.rooms().push(room);
            world.rooms().push(room);
            user.room().area().rooms().push(room);

            await room.insert(world.database());
            await area.update(world.database());

            user.send(`You create an isolated area and transport yourself to its lone room.\r\n`);

            world.characterToRoom(user, room);
            await user.update(world.database());
          } else if ( world.constants().directionShortNames.includes(args[1]) ) {
            if ( user.room().exits().find(x => x.direction() == world.constants().directionShortNames.indexOf(args[1])) ) {
              user.send(`There is already a room in that direction.\r\n`);
              return;
            }

            const exit1 = new world.Exit({
              direction: world.constants().directionShortNames.indexOf(args[1]),
              room: user.room(),
            });

            const exit2 = new world.Exit({
              direction: world.constants().directionOpposites[world.constants().directionShortNames.indexOf(args[1])],
              target: user.room(),
              targetId: user.room().id()
            });

            const room = new world.Room({
              name: `An empty room`,
              description: `This room looks quite boring, just plain everything.`,
              area: user.room().area(),
              exits: [exit2]
            });

            await room.insert(world.database());

            exit1.target(room);
            exit2.room(room);

            await exit1.insert(world.database());
            await exit2.insert(world.database());

            await room.update(world.database());

            world.rooms().push(room);
            user.room().area().rooms().push(room);
            user.room().exits().push(exit1);

            await user.room().update(world.database());
            await user.room().area().update(world.database());
            user.send(`You draw in ambient energy and manifest a room to the ${world.constants().directionNames[world.constants().directionShortNames.indexOf(args[1])]}.\r\n`);
          } else {
            user.send(`You do not know that method of connecting a new room to the world.\r\n`);
          }
        } else if ( `room`.startsWith(args[0])  ) {
          /** Is there a valid exit direction argument? */
          if ( typeof args[1] != `string` ) {
            user.send(`How should the room be connected? [isolated|n|w|s|e|nw|ne|sw|se|u|d]\r\n`);
          } else if (  `isolated`.startsWith(args[1]) ) {
            const room = new world.Room({
              name: `An empty room`,
              description: `This room looks quite boring, just plain everything.`,
              area: user.room().area()
            });

            world.rooms().push(room);
            user.room().area().rooms().push(room);

            await room.insert(world.database());
            await user.room().area().update(world.database());

            user.send(`You create an isolated room in the area and transport yourself to it.\r\n`);

            world.characterToRoom(user, room);
            
            await user.update(world.database());
          } else if ( world.constants().directionShortNames.includes(args[1]) ) {
            if ( user.room().exits().find(x => x.direction() == world.constants().directionShortNames.indexOf(args[1])) ) {
              user.send(`There is already a room in that direction.\r\n`);
              return;
            }

            const exit1 = new world.Exit({
              direction: world.constants().directionShortNames.indexOf(args[1]),
              room: user.room(),
            });

            const exit2 = new world.Exit({
              direction: world.constants().directionOpposites[world.constants().directionShortNames.indexOf(args[1])],
              target: user.room(),
              targetId: user.room().id()
            });

            const room = new world.Room({
              name: `An empty room`,
              description: `This room looks quite boring, just plain everything.`,
              area: user.room().area(),
              exits: [exit2]
            });

            await room.insert(world.database());

            exit1.target(room);
            exit2.room(room);

            await exit1.insert(world.database());
            await exit2.insert(world.database());

            await room.update(world.database());

            world.rooms().push(room);
            user.room().area().rooms().push(room);
            user.room().exits().push(exit1);

            await user.room().update(world.database());
            await user.room().area().update(world.database());
            user.send(`You draw in ambient energy and manifest a room to the ${world.constants().directionNames[world.constants().directionShortNames.indexOf(args[1])]}.\r\n`);
          } else {
            user.send(`You do not know that method of connecting a new room to the world.\r\n`);
          }
        } else {
          user.send(`You don't know how to create that.\r\n`);
        }
      }
    }),
    new world.Command({
      name: `edit`,
      execute: async (world, user, buffer, args) => {
      }
    })
  ];
};
