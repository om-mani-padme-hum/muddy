/** Require external modules */
const moment = require(`moment`);

module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `create`,
      positions: world.constants().positionsAwake_AND_SAFE,
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
            if ( user.room().exits().find(x => x.direction() == world.constants().directionShortNames.indexOf(args[1])) )
              return user.send(`There is already a room in that direction.\r\n`);

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
            const exit2 = await world.createExit({
              direction: world.constants().directionOpposites[world.constants().directionShortNames.indexOf(args[1])],
              room: room,
              target: user.room()
            });

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
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` ) {
            user.send(`Create what kind of prototype deployment? [item|mobile]\r\n`);
          }
          
          /** Otherwise, if the second argument is 'item'... */
          else if ( `item`.startsWith(args[1])  ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Where should this item be deployed to? [area|container|equipment|inventory|room]\r\n`);
            
            /** Otherwise, if the third argument was invalid, send error */
            else if ( ![`area`, `container`, `equipment`, `inventory`, `room`].some(x => x.startsWith(args[2]) ) )
              return user.send(`That's not a valid item deployment location.\r\n`);
            
            /** Otherwise, if no fourth argument was provided, send error */
            else if ( typeof args[3] != `string` )
              return user.send(`Which item prototype ID # is being deployed?\r\n`);
            
            /** Otherwise, if the fourth argument is not a number, send error */
            else if ( isNaN(args[3]) )
              return user.send(`That is not a valid item prototype ID #.\r\n`);
            
            /** Attempt to find item prototype in world with that ID # */
            const itemPrototype = world.itemPrototypes().find(x => x.id() == parseInt(args[3]));

            /** If item prototype doesn't exist, send error */
            if ( !itemPrototype )
              return user.send(`That item prototype ID # does not exist.\r\n`);
            
            /** If the second argument statred with 'area'... */
            if ( `area`.startsWith(args[2]) ) {
              /** Assume area is user's area, count is 1, and refresh is 60 seconds */
              let area = user.room().area();
              let count = 1;
              let refresh = 600;
              
              /** If there was a fifth argument provided... */
              if ( typeof args[4] == `string` ) {
                /** Attempt to find area in the world with that ID # */
                area = world.areas().find(x => x.id() == parseInt(args[4]));
                
                /** If area does not exist, send error */
                if ( !area )
                  return user.send(`There is no area in the world with that ID #.\r\n`);
              }
              
              /** If there was a sixth argument provided... */
              if ( typeof args[5] == `string` ) {
                /** If the sixth argument is not a number, send error */
                if ( isNaN(args[5]) )
                  return user.send(`That is not a valid count number.\r\n`);
                
                /** Otherwise, if the sixth argument is not between 1 and 500, send error */
                else if ( parseInt(args[5]) < 1 || parseInt(args[5]) > 500 )
                  return user.send(`The item count is restricted to be between 1 and 500.\r\n`);
                
                /** Set count to sixth argument */
                count = parseInt(args[5]);
              }
              
              /** If there was a seventh argument provided... */
              if ( typeof args[6] == `string` ) {
                /** If the seventh argument is not a number, send error */
                if ( isNaN(args[6]) )
                  return user.send(`That is not a valid refresh interval number.\r\n`);
                
                /** Otherwise, if the seventh argument is not greater than or equal to 30, send error */
                else if ( parseInt(args[6]) >= 500 )
                  return user.send(`The refresh interval must be greater than 30 seconds.\r\n`);
                
                /** Set refresh to seventh argument */
                refresh = parseInt(args[6]);
              }
              
              world.log().verbose(`Creating item to area deployment of (${count}) ID #${itemPrototype.id()} to #${area.id()} [${refresh}s].`);
            
              /** Create deployment */
              const deployment = world.createDeployment(user.room().area(), {
                count: count,
                refresh: refresh,
                type: world.constants().deploymentTypes.ITEMS_TO_AREA,
                subject: itemPrototype.id(),
                target: area.id()
              });
              
              /** Send success */
              user.send(`That item to area deployment has been successfully created.\r\n`);
            }
            
            /** Otherwise, send error */
            else {
              user.send(`You don't know how to create that kind of deployment.\r\n`);
            }
          }
          
          /** Otherwise, if the second argument is 'mobile'... */
          else if ( `mobile`.startsWith(args[1])  ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Where should this mobile be deployed to? [area|room]\r\n`);
            
            /** Otherwise, if the third argument was invalid, send error */
            else if ( ![`area`, `room`].some(x => x.startsWith(args[2]) ) )
              return user.send(`That's not a valid mobile deployment location.\r\n`);
            
            /** Otherwise, if no fourth argument was provided, send error */
            else if ( typeof args[3] != `string` )
              return user.send(`Where mobile prototype ID # is being deployed?\r\n`);
            
            /** Otherwise, if the fourth argument is not a number, send error */
            else if ( isNaN(args[3]) )
              return user.send(`That is not a valid mobile prototype ID #.\r\n`);
            
            const mobilePrototype = world.mobilePrototypes().find(x => x.id() == parseInt(args[3]));
            
            if ( !mobilePrototype )
              return user.send(`That mobile prototype ID # does not exist.\r\n`);
            
            /** If the second argument statred with 'area'... */
            if ( `area`.startsWith(args[2]) ) {
              /** Assume area is user's area, count is 1, and refresh is 60 seconds */
              let area = user.room().area();
              let count = 1;
              let refresh = 600;
              
              /** If there was a fifth argument provided... */
              if ( typeof args[4] == `string` ) {
                /** Attempt to find area in the world with that ID # */
                area = world.areas().find(x => x.id() == parseInt(args[4]));
                
                /** If area does not exist, send error */
                if ( !area )
                  return user.send(`There is no area in the world with that ID #.\r\n`);
              }
              
              /** If there was a sixth argument provided... */
              if ( typeof args[5] == `string` ) {
                /** If the sixth argument is not a number, send error */
                if ( isNaN(args[5]) )
                  return user.send(`That is not a valid count number.\r\n`);
                
                /** Otherwise, if the sixth argument is not between 1 and 500, send error */
                else if ( parseInt(args[5]) < 1 || parseInt(args[5]) > 500 )
                  return user.send(`The item count is restricted to be between 1 and 500.\r\n`);
                
                /** Set count to sixth argument */
                count = parseInt(args[5]);
              }
              
              /** If there was a seventh argument provided... */
              if ( typeof args[6] == `string` ) {
                /** If the seventh argument is not a number, send error */
                if ( isNaN(args[6]) )
                  return user.send(`That is not a valid refresh interval number.\r\n`);
                
                /** Otherwise, if the seventh argument is not greater than or equal to 30, send error */
                else if ( parseInt(args[6]) >= 500 )
                  return user.send(`The refresh interval must be greater than 30 seconds.\r\n`);
                
                /** Set refresh to seventh argument */
                refresh = parseInt(args[6]);
              }
              
              world.log().verbose(`Creating mobile to area deployment of (${count}) ID #${mobilePrototype.id()} to #${area.id()} [${refresh}s]${parentDeployment ? ` (Parent: ` + parentDeployment.id() + `)` : ``}.`);
            
              /** Create deployment */
              const deployment = world.createDeployment({
                count: count,
                refresh: refresh,
                type: world.constants().deploymentTypes.ITEMS_TO_AREA,
                subject: mobilePrototype.id(),
                target: area.id()
              });
              
              /** Insert deployment into database */
              await deployment.insert(world.database());
              
              /** Send success */
              user.send(`That mobile to area deployment has been successfully created.\r\n`);
            }
            
            /** Otherwise, send error */
            else {
              user.send(`You don't know how to create that kind of deployment.\r\n`);
            }
          }
        }
        
        /** Otherwise, if the first argument is 'exit'... */
        else if ( `exit`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` )
            return user.send(`Create exit in which direction? [d|e|n|ne|nw|s|se|sw|u|w]\r\n`);
          
          /** Otherwise, if the second argument is not a valid direction name, send error */
          else if ( !world.constants().directionShortNames.includes(args[1]) )
            return user.send(`That is not a valid direction.\r\n`);
          
          /** Otherwise, if no third argument was provided, send error */
          else if ( typeof args[2] != `string` )
            return user.send(`What room ID # should this exit connect to?\r\n`);
          
          /** Otherwise, if third argument is not a number, send error */
          else if ( isNaN(args[2]) )
            return user.send(`That is not a valid number.\r\n`);

          /** Attempt to find target room based on ID # */
          const target = world.rooms().find(x => x.id() == parseInt(args[2]));

          /** If target room doesn't exist, send error */
          if ( !target )
            return user.send(`There is no room in this world with that ID #.\r\n`);

          world.log().verbose(`Building new exit from room id #${user.room().id()} to #${target.id()}.`);

          /** Find numeric direction value */
          const direction = world.constants().directionShortNames.findIndex(x => x == args[1]);

          /** Create exit */
          const exit = world.createExit({
            direction: direction,
            room: user.room(),
            target: target
          });

          /** Send success */
          user.send(`A path ${world.constants().directionNames[direction]} begins to form as what was impassible dissolves away.\r\n`);
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
            if ( typeof args[2] != `string` )
              return user.send(`Create an instance of what item prototype ID?\r\n`);

            /** Find item prototype in world by id */
            const prototype = world.itemPrototypes().find(x => x.id() == parseInt(args[2]));

            /** If item prototype not found, send error and return */
            if ( !prototype )
              return user.send(`There is not an item prototype with that ID.\r\n`);

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
            if ( typeof args[2] != `string` )
              return user.send(`Create an instance of what mobile prototype ID?\r\n`);

            /** Find mobile prototype in world by id */
            const prototype = world.mobilePrototypes().find(x => x.id() == parseInt(args[2]));

            /** If mobile prototype not found, send error and return */
            if ( !prototype )
              return user.send(`There is not a mobile prototype with that ID.\r\n`);

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
            if ( user.room().exits().find(x => x.direction() == world.constants().directionShortNames.indexOf(args[1])) )
              return user.send(`There is already a room in that direction.\r\n`);

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
      positions: world.constants().positionsAwake_AND_SAFE,
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
              return user.send(`Edit what? [desc|details|flags|name|names|roomdesc|slot|type]\r\n`);

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
            
            /** Otherwise, if the fourth argument is 'slot'... */
            else if ( `slot`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's slot to what? [${world.constants().slotShortcuts.join(`|`)}]\r\n`);

              /** Otherwise, if the third argument is not a valid item slot shortcut, send error */
              else if ( !world.constants().slotShortcuts.some(x => x.startsWith(args[4])) )
                return user.send(`That is not a valid item type.\r\n`);

              /** Set the item's slot */
              item.slot(world.constants().slotShortcuts.findIndex(x => x.startsWith(args[4])));
            }
            
            /** Otherwise, if the fourth argument is 'type'... */
            else if ( `type`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's type to what? [${world.constants().itemTypeShortcuts.join(`|`)}]\r\n`);

              /** Otherwise, if the third argument is not a valid item type shortcut, send error */
              else if ( !world.constants().itemTypeShortcuts.some(x => x.startsWith(args[4])) )
                return user.send(`That is not a valid item type.\r\n`);

              /** Set the item's type */
              item.type(world.constants().itemTypeShortcuts.findIndex(x => x.startsWith(args[4])));
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
            
            /** Attempt to find item prototype in the world */
            const itemPrototype = world.itemPrototypes().find(x => x.id() == parseInt(args[2]));
            
            /** If the item prototype doesn't exist, send error */
            if ( !itemPrototype )
              return user.send(`That item prototype does not exist in this world.\r\n`);
            
            /** If no fourth argument was provided, send error */
            if ( typeof args[3] != `string` )
              return user.send(`Edit what? [author|date|desc|details|flags|name|names|roomdesc|slot|type]\r\n`);

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
                return user.send(`Change the item's creation date to when? [YYYY-MM-DD]\r\n`);
              
              /** Parse date argument with moment */
              const created = moment(args[4]);
              
              /** If the fifth argument is invalid, send error */
              if ( !date.isValid() )
                return user.send(`That is not a valid item creation date.\r\n`);
              
              /** Set the item prototype's creation date */
              itemPrototype.created(created.toDate());
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
            
            /** Otherwise, if the fourth argument is 'slot'... */
            else if ( `slot`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's slot to what? [${world.constants().slotShortcuts.join(`|`)}]\r\n`);

              /** Otherwise, if the third argument is not a valid item slot shortcut, send error */
              else if ( !world.constants().slotShortcuts.some(x => x.startsWith(args[4])) )
                return user.send(`That is not a valid item type.\r\n`);

              /** Set the item prototype's slot */
              itemPrototype.slot(world.constants().slotShortcuts.findIndex(x => x.startsWith(args[4])));
            }
            
            /** Otherwise, if the fourth argument is 'type'... */
            else if ( `type`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the item's type to what? [${world.constants().itemTypeShortcuts.join(`|`)}]\r\n`);

              /** Otherwise, if the third argument is not a valid item type shortcut, send error */
              else if ( !world.constants().itemTypeShortcuts.some(x => x.startsWith(args[4])) )
                return user.send(`That is not a valid item type.\r\n`);

              /** Set the item prototype's type */
              itemPrototype.type(world.constants().itemTypeShortcuts.findIndex(x => x.startsWith(args[4])));
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
        
        /** Otherwise, if the first argument is 'mobile'... */
        else if ( `mobile`.startsWith(args[0]) ) {
          /** If no second argument was provided, send error */
          if ( typeof args[1] != `string` )
            return user.send(`Edit what kind of mobile? [instance|prototype]\r\n`);
          
          /** Otherwise, if the second argument is 'instance'... */
          else if ( `instance`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Edit what mobile?\r\n`);
            
            /** Parse name and count of second argument */
            const [name, count] = world.parseName(user, args, 2);

            /** Grab mobiles array */
            const mobiles = user.room().mobiles();
            
            /** If the number of mobiles is less than the count, send error */
            if ( mobiles.length < count )
              return user.send(`You can't find that mobile anywhere.\r\n`);

            const mobile = mobiles[count - 1];
            
            /** If no fourth argument was provided, send error */
            if ( typeof args[3] != `string` )
              return user.send(`Edit what? [desc|flags|name|names|roomdesc]\r\n`);

            /** Otherwise, if the fourth argument is 'description'... */
            else if ( `description`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's description to what?\r\n`);

              const description = buffer.toString().split(` `).slice(4).join(` `);

              /** If the description is invalid, send error */
              if ( !description.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid mobile description, must consist of printable ASCII.\r\n`);

              /** Set the mobile's description */
              mobile.description(description);
            }

            /** Otherwise, if the fourth argument is 'flags'... */
            else if ( `flags`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change which mobile flag?\r\n`);
            }

            /** Otherwise, if the fourth argument is 'name'... */
            else if ( `name`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's name to what?\r\n`);

              const name = buffer.toString().split(` `).slice(4).join(` `);

              /** If the name is invalid, send error */
              if ( !name.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid mobile name, must consist of printable ASCII.\r\n`);

              /** Set the mobile's name */
              mobile.name(name);
            }
            
            /** Otherwise, if the fourth argument is 'names'... */
            else if ( `names`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's names to what?\r\n`);

              const names = args.slice(4);

              /** If the names are invalid, send error */
              if ( !names.every(x => x.match(/^[\x20-\x7E]+$/)) )
                return user.send(`That is an invalid mobile name, must consist of printable ASCII.\r\n`);

              /** Set the mobile's names */
              mobile.names(names);
            }
            
            /** Otherwise, if the fourth argument is 'roomdescription'... */
            else if ( `roomdescription`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's room description to what?\r\n`);

              const roomDescription = buffer.toString().split(` `).slice(4).join(` `);

              /** If the room description is invalid, send error */
              if ( !roomDescription.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid mobile room description, must consist of printable ASCII.\r\n`);

              /** Set the mobile's room description */
              mobile.roomDescription(roomDescription);
            }
            
            /** Otherwise, send error */
            else {
              return user.send(`You do not know how to edit that.\r\n`);
            }

            world.log().verbose(`Saving Mobile Instance ID #${mobile.id()} - ${mobile.name()}`);

            /** Update item in database */
            await mobile.update(world.database());

            user.send(`Done.\r\n`);
          }
          
          /** Otherwise, if the second argument is 'prototype'... */
          else if ( `prototype`.startsWith(args[1]) ) {
            /** If no third argument was provided, send error */
            if ( typeof args[2] != `string` )
              return user.send(`Edit what mobile prototype ID #?\r\n`);
            
            /** Attempt to find mobile prototype in the world */
            const mobilePrototype = world.mobilePrototypes().find(x => x.id() == parseInt(args[2]));
            
            /** If the mobile prototype doesn't exist, send error */
            if ( !mobilePrototype )
              return user.send(`That mobile prototype does not exist in this world.\r\n`);
            
            /** If no fourth argument was provided, send error */
            if ( typeof args[3] != `string` )
              return user.send(`Edit what? [author|date|desc|flags|name|names|roomdesc]\r\n`);

            /** Otherwise, if the fourth argument is 'author'... */
            else if ( `author`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's author to whom?\r\n`);

              const author = buffer.toString().split(` `).slice(4).join(` `);

              /** If the author is invalid, send error */
              if ( !author.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid mobile author name, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's author */
              mobilePrototype.author(author);
            }

            /** Otherwise, if the fourth argument is 'date'... */
            else if ( `date`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's creation date to when? [YYYY-MM-DD]\r\n`);
              
              /** Parse date argument with moment */
              const created = moment(args[4]);
              
              /** If the fifth argument is invalid, send error */
              if ( !date.isValid() )
                return user.send(`That is not a valid mobile creation date.\r\n`);
              
              /** Set the mobile prototype's creation date */
              mobilePrototype.created(created.toDate());
            }

            /** Otherwise, if the fourth argument is 'description'... */
            else if ( `description`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's description to what?\r\n`);

              const description = buffer.toString().split(` `).slice(4).join(` `);

              /** If the description is invalid, send error */
              if ( !description.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid mobile description, must consist of printable ASCII.\r\n`);

              /** Set the mobile prototype's description */
              mobilePrototype.description(description);
            }

            /** Otherwise, if the fourth argument is 'flags'... */
            else if ( `flags`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change which mobile flag?\r\n`);
            }

            /** Otherwise, if the fourth argument is 'name'... */
            else if ( `name`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's name to what?\r\n`);

              const name = buffer.toString().split(` `).slice(4).join(` `);

              /** If the name is invalid, send error */
              if ( !name.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid mobile name, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's name */
              mobilePrototype.name(name);
            }
            
            /** Otherwise, if the fourth argument is 'names'... */
            else if ( `names`.startsWith(args[3]) ) {
              /** If no third argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's names to what?\r\n`);

              const names = args.slice(4);

              /** If the names are invalid, send error */
              if ( !names.every(x => x.match(/^[\x20-\x7E]+$/)) )
                return user.send(`That is an invalid mobile name, must consist of printable ASCII.\r\n`);

              /** Set the item prototype's names */
              mobilePrototype.names(names);
            }
            
            /** Otherwise, if the fourth argument is 'roomdescription'... */
            else if ( `roomdescription`.startsWith(args[3]) ) {
              /** If no fifth argument was provided, send error */
              if ( typeof args[4] != `string` )
                return user.send(`Change the mobile's room description to what?\r\n`);

              const roomDescription = buffer.toString().split(` `).slice(4).join(` `);

              /** If the room description is invalid, send error */
              if ( !roomDescription.match(/^[\x20-\x7E]+$/) )
                return user.send(`That is an invalid mobile room description, must consist of printable ASCII.\r\n`);

              /** Set the mobile prototype's room description */
              mobilePrototype.roomDescription(roomDescription);
            }
            
            /** Otherwise, send error */
            else {
              return user.send(`You do not know how to edit that.\r\n`);
            }

            world.log().verbose(`Saving Mobile Prototype ID #${mobilePrototype.id()} - ${mobilePrototype.name()}`);

            /** Update mobile prototype in database */
            await mobilePrototype.update(world.database());

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
