module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `create`,
      positions: world.constants().POSITIONS_AWAKE_AND_SAFE,
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
      positions: world.constants().POSITIONS_AWAKE_AND_SAFE,
      execute: async (world, user, buffer, args) => {
        /** If no first argument was provided, send error */
        if ( typeof args[0] != `string` ) {
          user.send(`Edit what? [area|deployment|item|mobile|room]\r\n`);
        } 
        
        /** Otherwise, if the first argument is 'area'... */
        else if ( `area`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` )
            return user.send(`Edit what? [author|date|desc|flags|name]\r\n`);
          
          const area = user.room().area();
          
          /** If the second argument is 'author'... */
          if ( `author`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the area's author to whom?\r\n`);
            
            const author = buffer.toString().split(` `).slice(2).join(` `);
            
            /** If the author is invalid, send error */
            if ( !author.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid area author name, must consist of printable ASCII.\r\n`);

            /** Set the area's author */
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
            
            /** If the description is invalid, send error */
            if ( !description.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid area description, must consist of printable ASCII.\r\n`);

            /** Set the area's description */
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
            
            /** If the name is invalid, send error */
            if ( !name.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid area name, must consist of printable ASCII.\r\n`);

            /** Set the area's name */
            area.name(name);
          }
          
          /** Otherwise, send error */
          else {
            return user.send(`You do not know how to edit that.\r\n`);
          }
          
          world.log().verbose(`Saving Area ID #${area.id()} - ${area.name()}`);
          
          /** Update area in database */
          await area.update(world.database());
          
          user.send(`Done.\r\n`);
        }
        
        /** Otherwise, if the first argument is 'item'... */
        else if ( `item`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` )
            return user.send(`Edit what kind of item? [instance|prototype]\r\n`);
          
          /** Otherwise, if the second argument is 'instance'... */
          else if ( `instance`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Edit what item?\r\n`);
            
            /** Parse name and count of second argument */
            const [name, count] = world.parseName(user, args, 2);

            /** Create items array */
            let items = [];

            /** Add user equipment, inventory, and room items with names matching the argument to array */
            items = items.concat(user.equipment().filter(x => x.names().some(y => y.toLowerCase().startsWith(name))));
            items = items.concat(user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name))));
            items = items.concat(user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name))));

            /** If the number of items is less than the count, send error */
            if ( items.length < count )
              return user.send(`You can't find that item anywhere.\r\n`);

            const item = items[count - 1];
            
            /** If no fourth argument was provided, send error */
            if ( typeof args[3] != `string` )
              return user.send(`Edit what? [desc|details|flags|name|names|roomdesc]\r\n`);

            /** Otherwise, if the fourth argument is 'description'... */
            else if ( `description`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's description to what?\r\n`);

              const description = buffer.toString().split(` `).slice(4).join(` `);

              /** If the description is invalid, send error */
              if ( !description.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid item description, must consist of printable ASCII.\r\n`);

              /** Set the item's description */
              item.description(description);
            }
            
            /** Otherwise, if the fourth argument is 'details'... */
            else if ( `details`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the description of what detail?\r\n`);

              const name = args[4];
              
              /** If the name is invalid, send error */
              if ( !name.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid detail name, must consist of printable ASCII.\r\n`);
              
              if ( typeof args[5] != `string` )
                return user.send(`Change the description of the detail to what? (use 'delete' to remove detail)`);
              
              const description = buffer.toString().split(` `).slice(5).join(` `);

              /** If the description is invalid, send error */
              if ( !description.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid detail description, must consist of printable ASCII.\r\n`);

              /** Set the item's description */
              if ( description == `delete` && item.details()[name] )
                delete item.details()[name];
              else
                item.details()[name] = description;
            }
            
            /** Otherwise, if the fourth argument is 'roomdescription'... */
            else if ( `roomdescription`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's room description to what?\r\n`);

              const roomDescription = buffer.toString().split(` `).slice(4).join(` `);

              /** If the room description is invalid, send error */
              if ( !roomDescription.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid item room description, must consist of printable ASCII.\r\n`);

              /** Set the item's room description */
              item.roomDescription(roomDescription);
            }

            /** Otherwise, if the fourth argument is 'flags'... */
            else if ( `flags`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change which item flag?\r\n`);
            }

            /** Otherwise, if the fourth argument is 'name'... */
            else if ( `name`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's name to what?\r\n`);

              const name = buffer.toString().split(` `).slice(4).join(` `);

              /** If the name is invalid, send error */
              if ( !name.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid item name, must consist of printable ASCII.\r\n`);

              /** Set the item's name */
              item.name(name);
            }
            
            /** Otherwise, if the fourth argument is 'names'... */
            else if ( `names`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's names to what?\r\n`);

              const names = args.slice(4);

              /** If the names are invalid, send error */
              if ( !names.every(x => x.match(/^[\x20-\x7E]+$/)) )
                return user.send(`That is an invalid item name, must consist of printable ASCII.\r\n`);

              /** Set the item's names */
              item.names(names);
            }
            
            /** Otherwise, if the fourth argument is 'slot'... */
            else if ( `slot`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's slot to what?\r\n`);

              /** Set the item's name */
              item.slot(parseInt(args[4]));
            }
            
            /** Otherwise, if the fourth argument is 'type'... */
            else if ( `type`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's slot to what?\r\n`);

              /** Set the item's name */
              item.type(parseInt(args[4]));
            }
            
            /** Otherwise, send error */
            else {
              return user.send(`You do not know how to edit that.\r\n`);
            }

            world.log().verbose(`Saving Item Instance ID #${item.id()} - ${item.name()}`);

            /** Update item in database */
            await item.update(world.database());

            user.send(`Done.\r\n`);
          }
          
          /** Otherwise, if the second argument is 'prototype'... */
          else if ( `prototype`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Edit what item prototype ID #?\r\n`);
            
            /** Create a new item prototype */
            const itemPrototype = new world.ItemPrototype();
            
            /** Attempt to load the item prototype */
            const exists = await itemPrototype.load(parseInt(args[2]), world.database());
            
            /** If the item prototype doesn't exist, send error */
            if ( !exists )
              return user.send(`That item prototype does not exist.\r\n`);
            
            /** If no fourth argument was provided, send error */
            if ( typeof args[3] != `string` )
              return user.send(`Edit what? [author|date|desc|details|flags|name|names|roomdesc]\r\n`);

            /** Otherwise, if the fourth argument is 'author'... */
            else if ( `author`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's author to whom?\r\n`);

              const author = buffer.toString().split(` `).slice(4).join(` `);

              /** If the author is invalid, send error */
              if ( !author.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid item author name, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's author */
              itemPrototype.author(author);
            }

            /** Otherwise, if the fourth argument is 'date'... */
            else if ( `date`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's creation date to when?\r\n`);
            }

            /** Otherwise, if the fourth argument is 'description'... */
            else if ( `description`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's description to what?\r\n`);

              const description = buffer.toString().split(` `).slice(4).join(` `);

              /** If the description is invalid, send error */
              if ( !description.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid item description, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's description */
              itemPrototype.description(description);
            }
            
            /** Otherwise, if the fourth argument is 'details'... */
            else if ( `details`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the description of what detail?\r\n`);

              const name = args[4];
              
              /** If the name is invalid, send error */
              if ( !name.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid detail name, must consist of printable ASCII.\r\n`);
              
              if ( typeof args[5] != `string` )
                return user.send(`Change the description of the detail to what? (use 'delete' to remove detail)\r\n`);
              
              const description = buffer.toString().split(` `).slice(5).join(` `);

              /** If the description is invalid, send error */
              if ( !description.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid detail description, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's description */
              if ( description == `delete` && itemPrototype.details()[name] )
                delete itemPrototype.details()[name];
              else
                itemPrototype.details()[name] = description;
            }
            
            /** Otherwise, if the fourth argument is 'roomdescription'... */
            else if ( `roomdescription`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's room description to what?\r\n`);

              const roomDescription = buffer.toString().split(` `).slice(4).join(` `);

              /** If the room description is invalid, send error */
              if ( !roomDescription.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid item room description, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's room description */
              itemPrototype.roomDescription(roomDescription);
            }

            /** Otherwise, if the fourth argument is 'flags'... */
            else if ( `flags`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change which item flag?\r\n`);
            }

            /** Otherwise, if the fourth argument is 'name'... */
            else if ( `name`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's name to what?\r\n`);

              const name = buffer.toString().split(` `).slice(4).join(` `);

              /** If the name is invalid, send error */
              if ( !name.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid item name, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's name */
              itemPrototype.name(name);
            }
            
            /** Otherwise, if the fourth argument is 'names'... */
            else if ( `names`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's names to what?\r\n`);

              const names = args.slice(4);

              /** If the names are invalid, send error */
              if ( !names.every(x => x.match(/^[\x20-\x7E]+$/)) )
                return user.send(`That is an invalid item name, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's names */
              itemPrototype.names(names);
            }
            
            /** Otherwise, if the fourth argument is 'slot'... */
            else if ( `slot`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's slot to what?\r\n`);

              /** Set the item prototype's name */
              itemPrototype.slot(parseInt(args[4]));
            }
            
            /** Otherwise, if the fourth argument is 'type'... */
            else if ( `type`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's slot to what?\r\n`);

              /** Set the item prototype's name */
              itemPrototype.type(parseInt(args[4]));
            }
            
            /** Otherwise, send error */
            else {
              return user.send(`You do not know how to edit that.\r\n`);
            }

            world.log().verbose(`Saving Item Prototype ID #${itemPrototype.id()} - ${itemPrototype.name()}`);

            /** Update item prototype in database */
            await itemPrototype.update(world.database());

            user.send(`Done.\r\n`);
          }
        }
        
        /** Otherwise, if the first argument is 'room'... */
        else if ( `room`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` )
            return user.send(`Edit what? [author|date|desc|flags|name]\r\n`);
          
          const room = user.room();
          
          /** If the second argument is 'author'... */
          if ( `author`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Change the room's author to whom?\r\n`);
            
            const author = buffer.toString().split(` `).slice(2).join(` `);
            
            /** If the author is invalid, send error */
            if ( !author.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid room author name, must consist of printable ASCII.\r\n`);

            /** Set the room's author */
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
            
            /** If the description is invalid, send error */
            if ( !description.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid room description, must consist of printable ASCII.\r\n`);

            /** Set the room's description */
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
            
            /** If the name is invalid, send error */
            if ( !name.match(/^[\x20-\x7E]+$/) )
              return user.send(`That is an invalid room name, must consist of printable ASCII.\r\n`);

            /** Set the room's name */
            room.name(name);
          }
          
          /** Otherwise, send error */
          else {
            return user.send(`You do not know how to edit that.\r\n`);
          }
          
          world.log().verbose(`Saving Room ID #${room.id()} - ${room.name()}`);
          
          /** Update room in database */
          await room.update(world.database());
          
          user.send(`Done.\r\n`);
        }
        
        /** Otherwise, send error */
        else {
          user.send(`You do not know how to edit that.\r\n`);
        }
      }
    })
  ];
};
