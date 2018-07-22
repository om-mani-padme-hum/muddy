module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `drop`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Drop what?\r\n`);
          return;
        }
        
        const [name, count] = world.parseName(user, args, 0);
        
        const items = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
        
        if ( items.length < count ) {
          user.send(`You don't have that item in your inventory.\r\n`);
        } else {
          await world.itemToRoom(items[count - 1], user.room());
          user.send(`You drop ${items[count - 1].name()}.\r\n`);
        }
      },
      priority: 0
    }),
    new world.Command({
      name: `get`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Get what?\r\n`);
          return;
        }
        
        const [name, count] = world.parseName(user, args, 0);
        
        const items = user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
        
        if ( items.length < count ) {
          user.send(`You can't find that item anywhere.\r\n`);
        } else {
          if ( items[count - 1].flags().includes(world.constants().ITEM_FIXED) ) {
            user.send(`You are not able to pick up that item.\r\n`);
            return;
          }
          
          await world.itemToInventory(items[count - 1], user);
          user.send(`You pick up ${items[count - 1].name()}.\r\n`);
        }
      },
      priority: 0
    }),
    new world.Command({
      name: `remove`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Remove what?\r\n`);
          return;
        }
        
        const [name, count] = world.parseName(user, args, 0);
        
        const items = user.equipment().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
        
        if ( items.length < count ) {
          user.send(`You are not wearing or wielding anything like that.\r\n`);
        } else {
          await world.itemToInventory(items[count - 1], user);
          
          if ( items[count - 1].slot() == world.constants().SLOT_WIELD )
            user.send(`You return ${items[count - 1].name()} to your inventory.\r\n`);
          else
            user.send(`You remove ${items[count - 1].name()}.\r\n`);
        }
      },
      priority: 0
    }),
    new world.Command({
      name: `say`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Say what?\r\n`);
          return;
        }
        
        const text = world.colorize(buffer.toString().trim());
        
        user.room().users().forEach((otherUser) => {
          if ( user != otherUser )
            user.send(`${user.name} says '${text}'.\r\n`);
          else
            user.send(`You say '${text}'.\r\n`);
        });
      }
    }),
    new world.Command({
      name: `wear`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Wear what?\r\n`);
          return;
        }
        
        const [name, count] = world.parseName(user, args, 0);
        
        const items = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
        
        if ( items.length < count ) {
          user.send(`You don't have that item in your inventory.\r\n`);
        } else {
          if ( !items[count - 1].flags().includes(world.constants().ITEM_EQUIPPABLE) ) {
            user.send(`That item is not equippable.\r\n`);
            return;
          }
          
          const type = items[count - 1].type();
          const slot = items[count - 1].slot();

          if ( slot != world.constants().SLOT_WIELD ) {
            if ( user.equipment().find(x => x.slot() == slot) ) {
              user.send(`You are already wearing something in that slot.\r\n`);
            } else {
              await world.itemToEquipment(items[count - 1], user);
              user.send(`You put on ${items[count - 1].name()}.\r\n`);
            }
          } else {
            user.send(`You need to 'wield' weapons and held items, not 'wear' them.\r\n`);
          }
        }
      },
      priority: 0
    }),
    new world.Command({
      name: `wield`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] != `string` ) {
          user.send(`Wield what?\r\n`);
          return;
        }
        
        const [name, count] = world.parseName(user, args, 0);
        
        const items = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
        
        if ( items.length < count ) {
          user.send(`You don't have that item in your inventory.\r\n`);
        } else {
          if ( !items[count - 1].flags().includes(world.constants().ITEM_EQUIPPABLE) ) {
            user.send(`That item is not equippable.\r\n`);
            return;
          }
          
          const type = items[count - 1].type();
          const slot = items[count - 1].slot();

          if ( slot == world.constants().SLOT_WIELD ) {
            const wieldedItems = user.equipment().filter(x => x.slot() == slot);
            
            if ( wieldedItems.length == 2 || ( wieldedItems.length == 1 && wieldedItems[0].type() == world.constants().ITEM_2H_WEAPON ) ) {
              user.send(`You have already wielded all that you are capable of holding.\r\n`);
            } else {
              await world.itemToEquipment(items[count - 1], user);
              user.send(`You wield ${items[count - 1].name()}.\r\n`);
            }
          } else {
            user.send(`You need to 'wear' armor, not 'wield' it.\r\n`);
          }
        }
      },
      priority: 0
    })
  ];
};
