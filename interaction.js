module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `drop`,
      execute: async (world, user, buffer, args) => {
        /** Verify item argument exists */
        if ( typeof args[0] != `string` ) {
          user.send(`Drop what?\r\n`);
        } 
        
        /** Drop all */
        else if ( args[0] == 'all' ) {
          const items = user.inventory();

          /** Verify there's at least one item to drop */
          if ( items.length == 0 ) {
            user.send(`There are no items in your inventory to drop.\r\n`);
          } 
          
          /** Loop through inventory items and transfer each to the room */
          else {
            for ( let i = items.length - 1; i >= 0; i-- ) {
              user.send(`You drop ${items[i].name()}.\r\n`);
              await world.itemToRoom(items[i], user.room());
            }
          }
        } 
        
        /** Drop single item */
        else {
          /** Parse item name and count */
          const [name, count] = world.parseName(user, args, 0);

          /** Compile list of inventory items matching that item name */
          const items = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));

          /** Verify there is an item at desired count */
          if ( items.length < count ) {
            user.send(`You don't have that item in your inventory.\r\n`);
          } 
          
          /** Transfer item to the room */
          else {
            user.send(`You drop ${items[count - 1].name()}.\r\n`);
            await world.itemToRoom(items[count - 1], user.room());
          }
        }
      }
    }),
    new world.Command({
      name: `get`,
      execute: async (world, user, buffer, args) => {
        let containerName, containerCount, containers = [], items = [];

        /** Handle container argument, if passed */
        if ( typeof args[1] == `string` ) {
          /** Parse container name and count */
          [containerName, containerCount] = world.parseName(user, args, 1);

          /** Compile list of inventory and room items matching that container name */
          containers = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(containerName.toLowerCase())));
          containers = containers.concat(user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(containerName.toLowerCase()))));
        }
        
        /** Verify item argument exists */
        if ( typeof args[0] != `string` ) {
          user.send(`Get what?\r\n`);
        } 
        
        /** If container is specified, verify there is an item at desired container count */
        else if ( containers.length > 0 && containers.length < containerCount ) {
          user.send(`You can't find that container anywhere.\r\n`);
        } 

        /** If container is specified, verify item is a container */
        else if ( containers.length > 0 && !containers[containerCount - 1].flags().includes(world.constants().ITEM_CONTAINER) ) {
          user.send(`That item is not a container.\r\n`);
        }
        
        /** Get all */
        else if ( args[0] == 'all' ) {
          /** Get all (container) - use container's contents, get all - use room items */
          if ( containers.length > 0 )
            items = containers[containerCount - 1].contents();
          else
            items = user.room().items().filter(x => !x.flags().includes(world.constants().ITEM_FIXED));
          
          /** Verify there's at least one item in the container */
          if ( containers.length > 0 && items.length == 0 ) {
            user.send(`There are no items in that container.\r\n`);
          } 
          
          /** Verify there's at least one item in the room */
          else if ( items.length == 0 ) {
            user.send(`There are no items that you can pick up.\r\n`);
          } 
          
          /** Loop through the items list and transfer all to inventory */
          else {
            for ( let i = items.length - 1; i >= 0; i-- ) {
              if ( containers.length > 0 )
                user.send(`You get ${items[i].name()} from ${containers[containerCount - 1].name()}.\r\n`);
              else
                user.send(`You pick up ${items[i].name()}.\r\n`);

              await world.itemToInventory(items[i], user);
            }
          }
        } 
        
        /** Get single item */
        else {
          /** Parse item name and count */
          const [itemName, itemCount] = world.parseName(user, args, 0);

          /** Get (item) (container) - use container's contents, get (item) - use room items */
          if ( containers.length > 0 )
            items = containers[containerCount - 1].contents().filter(x => x.names().some(y => y.toLowerCase().startsWith(itemName.toLowerCase())));
          else
            items = user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(itemName.toLowerCase())));
          
          /** Verify there is an item at desired item count */
          if ( items.length < itemCount ) {
            user.send(`You can't find that item anywhere.\r\n`);
          } 
          
          /** Verify the item doesn't have the 'fixed' flag */
          else if ( items[itemCount - 1].flags().includes(world.constants().ITEM_FIXED) ) {
            user.send(`You are not able to pick up that item.\r\n`);
          }

          /** Transfer the item to inventory */
          else {
            if ( containers.length > 0 )
              user.send(`You get ${items[itemCount - 1].name()} from ${containers[containerCount - 1].name()}.\r\n`);
            else
              user.send(`You pick up ${items[itemCount - 1].name()}.\r\n`);
            
            await world.itemToInventory(items[itemCount - 1], user);
          }
        }
      }
    }),
    new world.Command({
      name: `put`,
      execute: async (world, user, buffer, args) => {
        /** Verify item argument exists */
        if ( typeof args[0] != `string` ) {
          user.send(`Put what in what?\r\n`);
        } 
        
        /** Verify container argument exists */
        else if ( typeof args[1] != `string` ) {
          user.send(`Put it in what?\r\n`);
        }
        
        /** Try to put item in container */
        else {
          /** Parse container name and count */
          const [containerName, containerCount] = world.parseName(user, args, 1);

          /** Compile list of inventory and room items matching that container name */
          let containers = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(containerName.toLowerCase())));
          containers = containers.concat(user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(containerName.toLowerCase()))));

          /** Verify there is an item at desired container count */
          if ( containers.length < containerCount ) {
            user.send(`You can't find that container.\r\n`);
          } 

          /** Put all (container) */
          else if ( args[0] == 'all' ) {
            /** Compile list of inventory items (excluding the desired container */
            const items = user.inventory().filter(x => x != containers[containerCount - 1]);

            /** Verify there's at least one item in inventory */
            if ( items.length == 0 ) {
              user.send(`There are no items in your inventory to put into that container.\r\n`);
            } 

            /** Loop through inventory items and transfer each to the container */
            else {
              for ( let i = items.length - 1; i >= 0; i-- ) {
                user.send(`You put ${items[i].name()} in ${containers[containerCount - 1].name()}.\r\n`);
                await world.itemToContainer(items[i], containers[containerCount - 1]);
              }
            }
          } 

          /** Put (item) (container) */
          else {
            /** Parse item name and count */
            const [itemName, itemCount] = world.parseName(user, args, 0);

            /** Compile list of inventory items matching that item name */
            const items = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(itemName.toLowerCase())));

            /** Verify there is an item at desired item count */
            if ( items.length < itemCount ) {
              user.send(`You don't have that item in your inventory.\r\n`);
            } 

            /** Transfer the item to the container */
            else {
              user.send(`You put ${items[itemCount - 1].name()} in ${containers[containerCount - 1].name()}.\r\n`);
              await world.itemToContainer(items[itemCount - 1], containers[containerCount - 1]);
            }
          }
        }
      }
    }),
    new world.Command({
      name: `remove`,
      execute: async (world, user, buffer, args) => {
        /** Verify item argument exists */
        if ( typeof args[0] != `string` ) {
          user.send(`Remove what?\r\n`);
        }
        
        /** Remove all */
        else if ( args[0] == 'all' ) {
          /** Compile list of equipment items */
          const items = user.equipment();
          
          /** Verify there's at least one item in equipment */
          if ( user.equipment().length == 0 ) {
            user.send(`You are already not wearing or wielding anything.\r\n`);
          } 
          
          /** Loop through equipment items and transfer each item to inventory */
          else {
            for ( let i = items.length - 1; i >= 0; i-- ) {
              if ( items[i].slot() == world.constants().SLOT_WIELD )
                user.send(`You return ${items.name()} to your inventory.\r\n`);
              else
                user.send(`You remove ${items.name()}.\r\n`);
              
              await world.itemToInventory(items[i], user);
            }
          }
        } 
        
        /** Remove (item) */
        else {
          /** Parse item name and count */
          const [name, count] = world.parseName(user, args, 0);

          /** Compile list of equipment items matching that item name */
          const items = user.equipment().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));

          /** Verify there is an item at desired count */
          if ( items.length < count ) {
            user.send(`You are not wearing or wielding anything like that.\r\n`);
          } 
          
          /** Transfer item to inventory */
          else {
            if ( items[count - 1].slot() == world.constants().SLOT_WIELD )
              user.send(`You return ${items[count - 1].name()} to your inventory.\r\n`);
            else
              user.send(`You remove ${items[count - 1].name()}.\r\n`);
            
            await world.itemToInventory(items[count - 1], user);
          }
        }
      }
    }),
    new world.Command({
      name: `say`,
      execute: async (world, user, buffer, args) => {
        /** Verify at least one argument exists */
        if ( typeof args[0] != `string` ) {
          user.send(`Say what?\r\n`);
        }
        
        /** Color and send the text to all users in the room */
        else {
          /** Colorize the string if it has any color code sequences */
          const text = world.colorize(buffer.toString().trim());

          /** Loop through users in room and send text */
          user.room().users().forEach((otherUser) => {
            if ( user != otherUser )
              user.send(`${user.name} says '${text}'.\r\n`);
            else
              user.send(`You say '${text}'.\r\n`);
          });
        }
      }
    }),
    new world.Command({
      name: `wear`,
      execute: async (world, user, buffer, args) => {
        /** Verify item argument exists */
        if ( typeof args[0] != `string` ) {
          user.send(`Wear what?\r\n`);
        }
        
        /** Wear all */
        else if ( args[0] == 'all' ) {
          /** Compile list of items in inventory that are equippable and don't need to be wielded */
          const items = user.inventory().filter(x => x.flags().includes(world.constants().ITEM_EQUIPPABLE) && x.slot() != world.constants().SLOT_WIELD);
          
          /** Verify there is at least one item in inventory to wear */
          if ( items.length == 0 ) {
            user.send(`You don't anything wearable in your inventory.\r\n`);
          }
          
          /** Try to wear all wearable items */
          else {
            let count = 0;
            
            /** Loop through wearable inventory items */
            for ( let i = items.length - 1; i >= 0; i-- ) {
              /** Transfer item to equipment if there is a slot open */
              if ( items[i].slot() != world.constants().SLOT_WIELD &&  !user.equipment().find(x => x.slot() == items[i].slot()) ) {
                user.send(`You put on ${items[i].name()}.\r\n`);
                await world.itemToEquipment(items[i], user);
                count++;
              }
            }
            
            /** If nothing was worn, items were wearable, but slots occupied */
            if ( count == 0 )
              user.send(`You have already worn everything you can.\r\n`);
          }
        } 
        
        /** Wear (item) */
        else {
          /** Parse item name and count */
          const [name, count] = world.parseName(user, args, 0);
        
          /** Compile list of items in inventory matching that item name */
          const items = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));

          /** Verify there is an item at desired count */
          if ( items.length < count ) {
            user.send(`You don't have that item in your inventory.\r\n`);
          } 
          
          /** Verify item is equippable */
          else if ( !items[count - 1].flags().includes(world.constants().ITEM_EQUIPPABLE) ) {
            user.send(`That item is not equippable.\r\n`);
          }

          /** Verify item is wearable */
          else if ( items[count - 1].slot() == world.constants().SLOT_WIELD ) {
            user.send(`You need to 'wield' weapons and held items, not 'wear' them.\r\n`);
          } 
          
          /** Verify the appropriate slot is available */
          else if ( user.equipment().find(x => x.slot() == items[count - 1].slot()) ) {
            user.send(`You are already wearing something in that slot.\r\n`);
          } 

          /** Transfer item to equipment */
          else {
            user.send(`You put on ${items[count - 1].name()}.\r\n`);
            await world.itemToEquipment(items[count - 1], user);
          }
        }
      }
    }),
    new world.Command({
      name: `wield`,
      execute: async (world, user, buffer, args) => {
        /** Verify item argument exists */
        if ( typeof args[0] != `string` ) {
          user.send(`Wield what?\r\n`);
        }
        
        /** Wield all */
        else if ( args[0] == 'all' ) {
          /** Compile list of items in inventory that are equippable and wieldable */
          const items = user.inventory().filter(x => x.flags().includes(world.constants().ITEM_EQUIPPABLE) && x.slot() == world.constants().SLOT_WIELD);
          
          /** Verify there is at least one item in inventory to wield */
          if ( items.length == 0 ) {
            user.send(`You don't anything wieldable in your inventory.\r\n`);
          } 
          
          /** Try to wield all wieldable items */
          else {
            let count = 0;
            
            /** Loop through wieldable inventory items */
            for ( let i = items.length - 1; i >= 0; i-- ) {
              const wieldedItems = user.equipment().filter(x => x.slot() == world.constants().SLOT_WIELD);

              /** Transfer item to equipment if there is a slot open */
              if ( wieldedItems.length == 0 || ( wieldedItems.length == 1 && wieldedItems[0].type() != world.constants().ITEM_2H_WEAPON ) ) {
                user.send(`You wield ${items[i].name()}.\r\n`);
                await world.itemToEquipment(items[i], user);
                count++;
              }
            }
            
            /** If nothing was worn, items were wieldable, but slots occupied */
            if ( count == 0 )
              user.send(`You have already wielded all that you are capable of holding.\r\n`);
          }
        } 
        
        /** Wield (item) */
        else {
          /** Parse item name and count */
          const [name, count] = world.parseName(user, args, 0);

          /** Compile list of items in inventory matching that item name */
          const items = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));

          /** Verify there is an item at desired count */
          if ( items.length < count ) {
            user.send(`You don't have that item in your inventory.\r\n`);
          } 
          
          /** Verify item is equippable */
          else if ( !items[count - 1].flags().includes(world.constants().ITEM_EQUIPPABLE) ) {
            user.send(`That item is not equippable.\r\n`);
            return;
          }

          /** Verify item is wieldable */
          else if ( items[count - 1].slot() != world.constants().SLOT_WIELD ) {
            user.send(`You need to 'wear' armor, not 'wield' it.\r\n`);
          } 
          
          /** Try to wield item */
          else {
            /** Compile list of wielded items in equipment */
            const wieldedItems = user.equipment().filter(x => x.slot() == world.constants().SLOT_WIELD);

            /** Verify there is a slot available for wielding */
            if ( wieldedItems.length == 2 || ( wieldedItems.length == 1 && wieldedItems[0].type() == world.constants().ITEM_2H_WEAPON ) ) {
              user.send(`You have already wielded all that you are capable of holding.\r\n`);
            } 
            
            /** Transfer item to equipment */
            else {
              user.send(`You wield ${items[count - 1].name()}.\r\n`);
              await world.itemToEquipment(items[count - 1], user);
            }
          }
        }
      }
    })
  ];
};
