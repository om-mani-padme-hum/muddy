/** Require local modules */
const constants = require(`./constants`);

module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `create`,
      positions: constants.POSITIONS_AWAKE_AND_SAFE,
      execute: async (world, user, buffer, args) => {
        /** If no first argument was provided, send error */
        if ( typeof args[0] != `string` ) {
          user.send(`Create what? [area|deployment|item|mobile|room]\r\n`);
        } 
        
        /** Otherwise, if the first argument is 'area'... */
        else if ( `area`.startsWith(args[0])  ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` ) {
            user.send(`How should the area be connected? [isolated|n|w|s|e|nw|ne|sw|se|u|d]\r\n`);
          } 
          
          /** Otherwise, if the second argument is 'isolated'... */
          else if (  `isolated`.startsWith(args[1]) ) {
            /** Create area */
            const area = await world.createArea({
              author: user.name()
            });
            
            /** Create room */
            const room = await world.createRoom(area, {
              author: user.name()
            });

            /** Send action to user */
            user.send(`You create an isolated area and transport yourself to its lone room.\r\n`);

            /** Move user to new room */
            await world.characterToRoom(user, room);
          } 
          
          /** Otherwise, if the second argument is a valid direction short name... */
          else if ( world.constants().directionShortNames.includes(args[1]) ) {
            /** If a room already exists the direction specified, send error and return */
            if ( user.room().exits().find(x => x.direction() == world.constants().directionShortNames.indexOf(args[1])) ) {
              user.send(`There is already a room in that direction.\r\n`);
              return;
            }

            /** Create area */
            const area = await world.createArea({
              author: user.name()
            });
            
            /** Create room */
            const room = await world.createRoom(area, {
              author: user.name()
            });
            
            /** Create outgoing exit */
            const exit1 = await world.createExit({
              direction: world.constants().directionShortNames.indexOf(args[1]),
              room: user.room(),
              target: room
            });

            /** Create incoming exit */
            const exit2 = await world.creatExit({
              direction: world.constants().directionOpposites[world.constants().directionShortNames.indexOf(args[1])],
              room: room,
              target: user.room()
            });
            
            /** Add outgoing exit to user's room */
            user.room().exits().push(exit1);
            
            /** Add incoming exit to new room */
            room.exits().push(exit2);

            /** Save user's room */
            await user.room().update(world.database());

            /** Save new room */
            await room.update(world.database());

            /** Add room to world */
            world.rooms().push(room);
            
            /** Add room to area */
            area.rooms().push(room);
            
            /** Save area */
            await area.update(world.database());

            /** Send action to user */
            user.send(`You draw in ambient energy and manifest a room to the ${world.constants().directionNames[world.constants().directionShortNames.indexOf(args[1])]}.\r\n`);
          
            /** Send action to user's room */
            user.room().send(`${user.name()} draws in ambient energy and manifests a room to the ${world.constants().directionNames[world.constants().directionShortNames.indexOf(args[1])]}.\r\n`, [user]);
          } 
          
          /** Otherwise, invalid second argument, send error */
          else {
            user.send(`You do not know that method of connecting a new room to the world.\r\n`);
          }
        } 
        
        /** Otherwise, if the first argument is 'deployment'... */
        else if ( `deployment`.startsWith(args[0]) ) {
          /** Todo */
        } 
        
        /** Otherwise, if the first argument is 'item'... */
        else if ( `item`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` ) {
            user.send(`Create what kind of item? [instance|prototype]\r\n`);
          } 
          
          /** Otherwise, if the second argument is 'instance'... */
          else if ( `instance`.startsWith(args[1])  ) {
            /** If no third argument was provided, send error and return */
            if ( typeof args[2] != `string` ) {
              user.send(`Create an instance of what item prototype ID?\r\n`);
              return;
            } 

            /** Find item prototype in world by id */
            const prototype = world.itemPrototypes().find(x => x.id() == parseInt(args[2]));

            /** If item prototype not found, send error and return */
            if ( !prototype ) {
              user.send(`There is not an item prototype with that ID.\r\n`);
              return;
            }

            /** If there is a fourth argument called 'room', set room item boolean to true */
            const roomItem = typeof args[3] == `string` && `room`.startsWith(args[3]);

            /** If this is a room item, create item instance in room from prototype */
            if ( roomItem )
              await world.createItemInstanceInRoom(user.room(), prototype);        

            /** Otherwise, create item instance in user's inventory from prototype */
            else
              await world.createItemInstanceInInventory(user, prototype);

            /** Send action to user */
            user.send(`You draw in energy from the space around and materialize it into ${prototype.name()}.\r\n`);

            /** Send action to user's room */
            user.room().send(`${user.name()} draws in energy from the space around and materializes it into ${prototype.name()}.\r\n`, [user]);
          } 
          
          /** Otherwise, if the second argument is 'prototype'... */
          else if ( `prototype`.startsWith(args[1]) ) {
            /** Create item prototype */
            const itemPrototype = await world.createItemPrototype(user.room().area(), {
              author: user.name()
            });
            
            user.send(`You create an item from nothing, then spatially compress and store it as ID ${itemPrototype.id()}.\r\n`);
          } 
          
          /** Otherwise, invalid second argument, send error */
          else {
            user.send(`You do not know how to build that.\r\n`);
          }
        } 
        
        /** Otherwise, if the first argument is 'mobile'... */
        else if ( `mobile`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` ) {
            user.send(`Create what kind of mobile? [instance|prototype]\r\n`);
          } 
          
          /** Otherwise, if the second argument is 'instance'... */
          else if ( `instance`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error and return */
            if ( typeof args[2] != `string` ) {
              user.send(`Create an instance of what mobile prototype ID?\r\n`);
              return;
            } 

            /** Find mobile prototype in world by id */
            const prototype = world.mobilePrototypes().find(x => x.id() == parseInt(args[2]));

            /** If mobile prototype not found, send error and return */
            if ( !prototype ) {
              user.send(`There is not a mobile prototype with that ID.\r\n`);
              return;
            }

            /** Create mobile instance from mobile prototype */
            await world.createMobileInstance(user.room(), prototype);

            /** Send action to user */
            user.send(`You draw in energy from the space around and materialize it into ${prototype.name()}.\r\n`);
            
            /** Send action to user's room */
            user.room().send(`${user.name()} draws in energy from the space around and materializes it into ${prototype.name()}.\r\n`, [user]);
          }
          
          /** Otherwise, if the second argument is 'prototype'... */
          else if ( `prototype`.startsWith(args[1]) ) {
            /** Create mobile prototype */
            const mobilePrototype = await world.createMobilePrototype(user.room().area(), {
              author: user.name()
            });

            /** Send action to user */
            user.send(`You create a mobile from nothing, then spatially compress and store it as ID ${mobilePrototype.id()}.\r\n`);
          } 
        } 
        
        /** Otherwise, if second argument is 'room' */
        else if ( `room`.startsWith(args[0])  ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` ) {
            user.send(`How should the room be connected? [isolated|n|w|s|e|nw|ne|sw|se|u|d]\r\n`);
          } 
          
          /** Otherwise, if the second argument is 'isolated'... */
          else if (  `isolated`.startsWith(args[1]) ) {
            /** Create room */
            const room = await world.createRoom(user.room().area(), {
              author: user.name()
            });

            /** Send action to user */
            user.send(`You create an isolated room in the area and transport yourself to it.\r\n`);

            /** Move user to new room */
            await world.characterToRoom(user, room);
          } 
          
          /** Otherwise, if the second argument is 'a valid direction short name... */
          else if ( world.constants().directionShortNames.includes(args[1]) ) {
            /** If a room already exists the direction specified, send error and return */
            if ( user.room().exits().find(x => x.direction() == world.constants().directionShortNames.indexOf(args[1])) ) {
              user.send(`There is already a room in that direction.\r\n`);
              return;
            }

            /** Create room */
            const room = await world.createRoom(user.room().area(), {
              author: user.name()
            });
            
            /** Create outgoing exit */
            const exit1 = await world.createExit({
              direction: world.constants().directionShortNames.indexOf(args[1]),
              room: user.room(),
              target: room
            });

            /** Create incoming exit */
            const exit2 = await world.createExit({
              direction: world.constants().directionOpposites[world.constants().directionShortNames.indexOf(args[1])],
              room: room,
              target: user.room()
            });
            
            /** Add outgoing exit to user's room */
            user.room().exits().push(exit1);
            
            /** Add incoming exit to new room */
            room.exits().push(exit2);

            /** Save user's room */
            await user.room().update(world.database());

            /** Save new room */
            await room.update(world.database());
            
            /** Send action to user */
            user.send(`You draw in ambient energy and manifest a room to the ${world.constants().directionNames[world.constants().directionShortNames.indexOf(args[1])]}.\r\n`);
            
            /** Send action to user's room */
            user.room().send(`${user.name()} draws in ambient energy and manifests a room to the ${world.constants().directionNames[world.constants().directionShortNames.indexOf(args[1])]}.\r\n`, [user]);
          } 
          
          /** Otherwise, invalid second argument, send error */
          else {
            user.send(`You do not know that method of connecting a new room to the world.\r\n`);
          }
        } 
        
        /** Otherwise, invalid first argument, send error */
        else {
          user.send(`You don't know how to create that.\r\n`);
        }
      }
    }),
    new world.Command({
      name: `edit`,
      positions: constants.POSITIONS_AWAKE_AND_SAFE,
      execute: async (world, user, buffer, args) => {
        /** If no first argument was provided, send error */
        if ( typeof args[0] != `string` ) {
          user.send(`Edit what? [area|deployment|item|mobile|room]\r\n`);
        } 
        
        /** Otherwise, if the first argument is 'area'... */
        else if ( `area`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` )
            return user.send(`Edit the area's what? [author, date, description, flags, name]\r\n`);
          
          const area = user.room().area();
          
          /** If the second argument is 'author'... */
          if ( `author`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the area's author to whom?\r\n`);
            
            const author = buffer.toString().split(` `).slice(2).join(` `);
            
            /** If the third argument is invalid, send error */
            if ( !author.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid area author name, must consist of printable ASCII characters.\r\n`);

            area.author(author);
          }
          
          /** Otherwise, if the second argument is 'date'... */
          else if ( `date`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the area's creation date to when?\r\n`);
          }
          
          /** Otherwise, if the second argument is 'description'... */
          else if ( `description`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the area's description to what?\r\n`);
            
            const description = buffer.toString().split(` `).slice(2).join(` `);
            
            /** If the third argument is invalid, send error */
            if ( !description.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid area description, must consist of printable ASCII characters.\r\n`);

            area.description(description);
          }
          
          /** Otherwise, if the second argument is 'flags'... */
          else if ( `flags`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change which area flag?\r\n`);
          }
          
          /** Otherwise, if the second argument is 'name'... */
          else if ( `name`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the area's name to what?\r\n`);
            
            const name = buffer.toString().split(` `).slice(2).join(` `);
            
            /** If the third argument is invalid, send error */
            if ( !name.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid area name, must consist of printable ASCII characters.\r\n`);

            area.name(name);
          }
          
          world.log().verbose(`Saving Area ID #${area.id()} - ${area.name()}`);
          
          /** Update area in database */
          await area.update(world.database());
          
          user.send(`Done.\r\n`);
        }
        
        /** Otherwise, if the first argument is 'room'... */
        else if ( `room`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` )
            return user.send(`Edit the room's what? [author, date, description, flags, name]\r\n`);
          
          const room = user.room();
          
          /** If the second argument is 'author'... */
          if ( `author`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the room's author to whom?\r\n`);
            
            const author = buffer.toString().split(` `).slice(2).join(` `);
            
            /** If the third argument is invalid, send error */
            if ( !author.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid room author name, must consist of printable ASCII characters.\r\n`);

            room.author(author);
          }
          
          /** Otherwise, if the second argument is 'date'... */
          else if ( `date`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the room's creation date to when?\r\n`);
          }
          
          /** Otherwise, if the second argument is 'description'... */
          else if ( `description`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the room's description to what?\r\n`);
            
            const description = buffer.toString().split(` `).slice(2).join(` `);
            
            /** If the third argument is invalid, send error */
            if ( !description.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid room description, must consist of printable ASCII characters.\r\n`);

            room.description(description);
          }
          
          /** Otherwise, if the second argument is 'flags'... */
          else if ( `flags`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change which room flag?\r\n`);
          }
          
          /** Otherwise, if the second argument is 'name'... */
          else if ( `name`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the room's name to what?\r\n`);
            
            const name = buffer.toString().split(` `).slice(2).join(` `);
            
            /** If the third argument is invalid, send error */
            if ( !name.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid room name, must consist of printable ASCII characters.\r\n`);

            room.name(name);
          }
          
          world.log().verbose(`Saving Room ID #${room.id()} - ${room.name()}`);
          
          /** Update room in database */
          await room.update(world.database());
          
          user.send(`Done.\r\n`);
        }
      }
    })
  ];
};
