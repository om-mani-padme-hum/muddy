module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `look`,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] == `string` ) {
          if ( `in`.startsWith(args[0]) ) {
            if ( typeof args[1] != `string` ) {
              user.send(`Look in what?\r\n`);
              return;
            } else {
              const [name, count] = world.parseName(user, args, 1);
              
              const inventory = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
              const items = user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
              
              const results = inventory.concat(items);
              
              if ( results.length < count ) {
                user.send(`You can't find that item anywhere.\r\n`);
              } else if ( !results[count - 1].flags().includes(world.constants().ITEM_CONTAINER) ) {
                user.send(`That item is not a container.\r\n`);
              } else {
                user.send(`Contents of ${results[count - 1].name()}:\r\n`);
                
                const itemsIncluded = [];

                /** Send any objects in the inventory */
                results[count - 1].contents().forEach((item) => {
                  if ( itemsIncluded.includes(item.name()) )
                    return;

                  const count = user.room().items().filter(x => x.name() == item.name()).length;

                  if ( count > 1 )
                    user.send(`  (${count}) ${item.name()}\r\n`);
                  else
                    user.send(`  ${item.name()}\r\n`);

                  itemsIncluded.push(item.name());
                });
              }
            }
          } else {
            const [name, count] = world.parseName(user, args, 0);

            const users = user.room().users().filter(x => x.name().toLowerCase().startsWith(name.toLowerCase()));
            const mobiles = user.room().mobiles().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
            const inventory = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
            const equipment = user.equipment().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
            const items = user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));

            let results = users.concat(mobiles.concat(inventory.concat(equipment.concat(items))));

            const details = results.filter(x => typeof x.details == 'function' && Object.keys(x.details()).filter(y => y.startsWith(name)).length > 0);

            results = results.concat(details);

            if ( results.length < count ) {
              user.send(`You can't find that item anywhere.\r\n`);
            } else {
              if ( results[count - 1].constructor.name == 'Object' ) {
                user.send(`${results[count - 1]}\r\n`);
              } else if ( results[count - 1] instanceof world.User ) {
                user.send(`${results[count - 1].name()} is standing here.\r\n\r\n`);
                world.sendUserEquipment(user, results[count - 1]);
              } else if ( results[count - 1] instanceof world.MobileInstance ) {
                user.send(`${results[count - 1].description()}\r\n\r\n`);
                world.sendUserEquipment(user, results[count - 1]);
              } else {
                user.send(`${results[count - 1].description()}\r\n`);
              }
            }
          }
        } else {
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
          user.room().mobiles().forEach((mobile) => {
            user.send(` ${mobile.roomDescription()}\r\n`);
          });

          /** Send any other users in the room */
          user.room().users().forEach((other) => {
            if ( user != other )
              user.send(` ${other.name()} is standing here.\r\n`);
          });

          const itemsIncluded = [];

          /** Send any objects in the room */
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
        }
      },
      priority: 999
    }),
    new world.Command({
      name: `equipment`,
      execute: async (world, user, buffer) => {
        world.sendUserEquipment(user, user);
      },
      priority: 999
    }),
    new world.Command({
      name: `inventory`,
      execute: async (world, user, buffer) => {
        user.send(`Inventory:\r\n`);
        
        const itemsIncluded = [];

        /** Send any objects in the inventory */
        user.inventory().forEach((item) => {
          if ( itemsIncluded.includes(item.name()) )
            return;

          const count = user.inventory().filter(x => x.name() == item.name()).length;

          if ( count > 1 )
            user.send(`  (${count}) ${item.name()}\r\n`);
          else
            user.send(`  ${item.name()}\r\n`);

          itemsIncluded.push(item.name());
        });
        
        if ( user.inventory().length == 0 )
          user.send(`  nothing\r\n`);
      },
      priority: 999
    })
  ];
};
