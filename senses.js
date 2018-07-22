module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `look`,
      execute: async (world, user, buffer) => {
        /** Send room name */
        user.send(`${user.room().name()}\r\n`);

        /** Send exits */
        let exits = `#G[Exits:`

        /** Loop through exits in user`s room */
        user.room().exits().forEach((exit) => {
          /** Append exit names separated by spaces */
          exits += ` ${world.constants().directionNames[exit.direction()]}`;
        });

        /** No exits, output none */
        if ( user.room().exits().length == 0 )
          exits += ` None`;

        exits += `]\r\n`;
        
        /** Colorize and send exits to user */
        user.send(world.colorize(exits));

        /** Send room description */
        user.send(world.colorize(`#w${world.terminalWrap(user.room().description())}\r\n`));

        /** Send any mobiles in the room */
        user.room().mobiles().forEach((other) => {
          user.send(` ${other.roomDescription()}\r\n`);
        });
        
        /** Send any other users in the room */
        user.room().users().forEach((other) => {
          if ( user != other )
            user.send(` ${other.name()} is standing here.\r\n`);
        });

        const itemsIncluded = [];
        
        /** Send any objets in the room */
        user.room().items().forEach((item) => {
          if ( itemsIncluded.includes(item.roomDescription()) )
            return;
          
          const count = user.room().items().filter(x => x.roomDescription() == item.roomDescription()).length;
          
          if ( count > 1 )
            user.send(`  (${count}) ${item.roomDescription()}\r\n`);
          else
            user.send(`  ${item.roomDescription()}\r\n`);
          
          itemsIncluded.push(item.roomDescription());
        });
      },
      priority: 999
    }),
    new world.Command({
      name: `equipment`,
      execute: async (world, user, buffer) => {
        user.send(`Equipment:\r\n`);

        user.send(world.colorize(`  #y[Head       ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_HEAD) ? user.equipment().find(x => x.slot() == world.constants().SLOT_HEAD).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Face       ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_FACE) ? user.equipment().find(x => x.slot() == world.constants().SLOT_FACE).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Neck       ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_NECK) ? user.equipment().find(x => x.slot() == world.constants().SLOT_NECK).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Shoulders  ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_SHOULDERS) ? user.equipment().find(x => x.slot() == world.constants().SLOT_SHOULDERS).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Chest      ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_CHEST) ? user.equipment().find(x => x.slot() == world.constants().SLOT_CHEST).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Back       ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_BACK) ? user.equipment().find(x => x.slot() == world.constants().SLOT_BACK).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Arms       ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_ARMS) ? user.equipment().find(x => x.slot() == world.constants().SLOT_ARMS).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Wrists     ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_WRISTS) ? user.equipment().find(x => x.slot() == world.constants().SLOT_WRISTS).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Gloves     ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_GLOVES) ? user.equipment().find(x => x.slot() == world.constants().SLOT_GLOVES).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Waist      ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_WAIST) ? user.equipment().find(x => x.slot() == world.constants().SLOT_WAIST).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Legs       ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_LEGS) ? user.equipment().find(x => x.slot() == world.constants().SLOT_LEGS).name() : `Nothing`}\r\n`));
        user.send(world.colorize(`  #y[Feet       ]#n ${user.equipment().find(x => x.slot() == world.constants().SLOT_FEET) ? user.equipment().find(x => x.slot() == world.constants().SLOT_FEET).name() : `Nothing`}\r\n`));
        
        const wieldedItems = user.equipment().filter(x => x.slot() == world.constants().SLOT_WIELD);
        
        if ( wieldedItems.length == 2 ) {
          user.send(world.colorize(`  #y[Right Hand ]#n ${wieldedItems[0].name()}\r\n`));
          user.send(world.colorize(`  #y[Left Hand  ]#n ${wieldedItems[1].name()}\r\n`));
        } else if ( wieldedItems.length == 1 ) {
          if ( wieldedItems[0].type() == world.constants().ITEM_2H_WEAPON )
            user.send(world.colorize(`  #y[Hands      ]#n ${wieldedItems[0].name()}\r\n`));
          else
            user.send(world.colorize(`  #y[Right Hand ]#n ${wieldedItems[0].name()}\r\n`));
        } else {
          user.send(world.colorize(`  #y[Hands      ]#n Nothing\r\n`));
        }
      },
      priority: 999
    }),
    new world.Command({
      name: `inventory`,
      execute: async (world, user, buffer) => {
        user.send(`Inventory:\r\n`);
        
        user.inventory().forEach((item) => {
          user.send(`  ${item.name()}\r\n`);
        });
        
        if ( user.inventory().length == 0 )
          user.send(`  Nothing\r\n`);
      },
      priority: 999
    })
  ];
};
