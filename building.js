module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `create`,
      execute: async (world, user, buffer, args) => {
        /** If no first argument was provided, send error */
        if ( typeof args[0] != `string` ) {
          user.send(`Create what? [area|room|prototype|deployment|instance]\r\n`);
        } 
        
        /** Otherwise, if the first argument is 'deployment'... */
        else if ( `deployment`.startsWith(args[0]) ) {
          /** Todo */
        } 
        
        /** Otherwise, if the first argument is 'instance'... */
        else if ( `instance`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` ) {
            user.send(`Create what kind of instance? [item|mobile]\r\n`);
          } 
          
          /** Otherwise, if the second argument is 'item'... */
          else if ( `item`.startsWith(args[1])  ) {
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
          
          /** Otherwise, if the first argument is 'mobile'... */
          else if ( `mobile`.startsWith(args[1]) ) {
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
        } 
        
        /** Otherwise, if the first argument is 'prototype'... */
        else if ( `prototype`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` ) {
            user.send(`Create what kind of prototype? [item|mobile]\r\n`);
          } 
          
          /** Create prototype item */
          else if ( `item`.startsWith(args[1]) ) {
            /** Create item prototype */
            await world.createItemPrototype(user.room().area(), {
              author: user.name()
            });
            
            user.send(`You create an item from nothing, then spatially compress and store it as ID ${itemPrototype.id()}.\r\n`);
          } 
          
          /** Create prototype mobile */
          else if ( `mobile`.startsWith(args[1]) ) {
            /** Create mobile prototype */
            await world.createMobilePrototype(user.room().area(), {
              author: user.name()
            });

            /** Send action to user */
            user.send(`You create a mobile from nothing, then spatially compress and store it as ID ${mobilePrototype.id()}.\r\n`);
          } 
          
          /** Otherwise, invalid second argument, send error */
          else {
            user.send(`You do not know how to build that.\r\n`);
          }
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
            user.room().area().rooms().push(room);
            
            /** Save area */
            await user.room().area().update(world.database());
            
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
      execute: async (world, user, buffer, args) => {
      }
    })
  ];
};
