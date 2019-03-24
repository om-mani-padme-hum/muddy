/** Require local modules */
const constants = require(`./constants`);

module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `look`,
      positions: constants.POSITIONS_AWAKE,
      execute: async (world, user, buffer, args) => {
        if ( typeof args[0] == `string` ) {
          /** If the first argument is 'in'... */
          if ( `in`.startsWith(args[0]) ) {
            /** If no second argument was provided, send error and return */
            if ( typeof args[1] != `string` ) {
              user.send(`Look in what?\r\n`);
              return;
            }
            
            /** Parse container name and count from second argument */
            const [name, count] = world.parseName(user, args, 1);

            /** Create array of all items in user's inventory with name matching second argument */
            let items = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
            
            /** Concatenate with all items in user's equipment with name matching second argument  */
            items = items.concat(user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase()))));

            /** If number of items is less than count, send error */
            if ( items.length < count ) {
              user.send(`You can't find that item anywhere.\r\n`);
            } 
            
            /** Otherwise, if item is not a container, send error */
            else if ( !items[count - 1].flags().includes(world.constants().ITEM_CONTAINER) ) {
              user.send(`That item is not a container.\r\n`);
            } 
            
            /** Otherwise... */
            else {
              /** Send header for container contents */
              user.send(`Contents of ${items[count - 1].name()}:\r\n`);

              /** Keep track of items already included in item counts */
              const itemsIncluded = [];

              /** Loop through each item in container */
              items[count - 1].contents().forEach((content) => {
                /** If item is already included, skip it */
                if ( itemsIncluded.includes(content.name()) )
                  return;

                /** Count number of items of the same name in the container */
                const numItems = items[count - 1].contents().filter(x => x.name() == content.name()).length;

                /** If the number of items is greater than, send quantity and name */
                if ( numItems > 1 )
                  user.send(`  (${numItems}) ${content.name()}\r\n`);
                
                /** Otherwise, just send name */
                else
                  user.send(`  ${content.name()}\r\n`);

                /** Add item to items included */
                itemsIncluded.push(content.name());
              });

              /** If there are no items in the container, send none */
              if ( items[count - 1].contents().length == 0 )
                user.send(`  None\r\n`);
            }
          } 
          
          /** Otherwise... */
          else {
            /** Parse container name and count from argument */
            const [name, count] = world.parseName(user, args, 0);

            /** Create array of users with name matching the arugment */
            const users = user.room().users().filter(x => x.name().toLowerCase().startsWith(name.toLowerCase()));
            
            /** Create array of mobiles with name matching the arugment */
            const mobiles = user.room().mobiles().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
            
            /** Create array of items in user's inventory with name matching the arugment */
            const inventory = user.inventory().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
            
            /** Create array of items in user's equipemnt with name matching the arugment */
            const equipment = user.equipment().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
            
            /** Create array of items in user's room with name matching the arugment */
            const items = user.room().items().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));

            /** Create array of all characters and items with name matching the argument combined */
            const targets = users.concat(mobiles.concat(inventory.concat(equipment.concat(items))));
            
            /** If number of targets is less than count, send error and return */
            if ( targets.length < count ) {
              user.send(`You can't find that anywhere.\r\n`);
              return;
            } 
            
            /** If the target is a user... */
            if ( targets[count - 1] instanceof world.User ) {
              /** Send target user's name */
              user.send(`${targets[count - 1].name()} is standing here.\r\n\r\n`);
              
              /** Send target user's equipment */
              world.sendUserEquipment(user, results[count - 1]);
            } 
            
            /** Otherwise, if target is a mobile... */
            else if ( targets[count - 1] instanceof world.MobileInstance ) {
              /** Send target mobile's description */
              user.send(`${targets[count - 1].description()}\r\n\r\n`);
              
              /** Send target mobile's equipment */
              world.sendUserEquipment(user, results[count - 1]);
            } 
            
            /** Otherwise, send target description */
            else {
              user.send(`${targets[count - 1].description()}\r\n`);
            }
          }
        } else {
          /** Send room name */
          user.send(`${user.room().name()}\r\n`);

          /** Start exits */
          let exits = `#G[Exits:`;

          /** Loop through exits in user's room */
          user.room().exits().forEach((exit) => {
            /** Append exit names separated by spaces */
            exits += ` ${world.constants().directionNames[exit.direction()]}`;
          });

          /** If there are no exits, append none */
          if ( user.room().exits().length == 0 )
            exits += ` None`;

          /** Finish exits */
          exits += `]\r\n`;

          /** Colorize and send exits */
          user.send(world.colorize(exits));

          /** Send room description */
          user.send(world.terminalWrap(world.colorize(`#w${user.room().description()}\r\n`)));

          /** Loop through each mobile in user's room and send room description */
          user.room().mobiles().forEach((mobile) => {
            user.send(` ${mobile.roomDescription()}\r\n`);
          });

          /** Loop through each other user in the user's room... */
          user.room().users().forEach((other) => {
            /** If user in room is not the looking user, send user name */
            if ( user != other )
              user.send(` ${other.name()} is standing here.\r\n`);
          });

          /** Keep track of items already included in item counts */
          const itemsIncluded = [];

          /** Loop through each item in the user's room */
          user.room().items().forEach((item) => {
            /** If item is already included, skip it */
            if ( itemsIncluded.includes(item.roomDescription()) )
              return;

            /** Count number of items of the same name in the room */
            const count = user.room().items().filter(x => x.roomDescription() == item.roomDescription()).length;

            /** If the number of items is greater than, send quantity and room description */
            if ( count > 1 )
              user.send(`  (${count}) ${item.roomDescription()}\r\n`);
            
            /** Otherwise, just send room description */
            else
              user.send(`  ${item.roomDescription()}\r\n`);

            /** Add item to items included */
            itemsIncluded.push(item.roomDescription());
          });
        }
      },
      priority: 999
    }),
    new world.Command({
      name: `equipment`,
      positions: constants.POSITIONS_AWAKE,
      execute: async (world, user, buffer) => {
        /** Send user's equipment */
        world.sendUserEquipment(user, user);
      },
      priority: 998
    }),
    new world.Command({
      name: `inventory`,
      positions: constants.POSITIONS_AWAKE,
      execute: async (world, user, buffer) => {
        /** Send inventory header */
        user.send(`Inventory:\r\n`);
        
        /** Keep track of items already included in item counts */
        const itemsIncluded = [];

        /** Loop through each item in the user's inventory */
        user.inventory().forEach((item) => {
            /** If item is already included, skip it */
          if ( itemsIncluded.includes(item.name()) )
            return;

          /** Count number of items of the same name in the user's inventory */
          const count = user.inventory().filter(x => x.name() == item.name()).length;

          /** If the number of items is greater than one, send quantity and name */
          if ( count > 1 )
            user.send(`  (${count}) ${item.name()}\r\n`);
          
          /** Otherwise, just send name */
          else
            user.send(`  ${item.name()}\r\n`);

          /** Add item to items included */
          itemsIncluded.push(item.name());
        });
        
        /** If there are no items in the user's inventory, send nothing */
        if ( user.inventory().length == 0 )
          user.send(`  nothing\r\n`);
      },
      priority: 999
    }),
    new world.Command({
      name: `who`,
      execute: async (world, user, buffer) => {
        /** Send top border */
        user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\r\n`));
        
        /** Keep track of the number of visible other users */
        let count = 0;
        
        /** Loop through each other user in the world... */
        world.users().forEach((other) => {
          /** If the other user is not the user looking and the other user is cloaked, return */
          if ( other != user && other.affects().includes(world.constants().AFFECT_CLOAKED))
            return;
          
          /** If the other user is named xodin, send who entry with title 'The Designer' */
          if ( other.name().toLowerCase() == `xodin` )
            user.send(world.colorize(` #y[The Designer ] #W${other.name()} #w${other.title()}`.padEnd(86) + `\r\n`));
          
          /** Otherwise, send who entry with title 'Honored Guest' */
          else
            user.send(world.colorize(` #y[Honored Guest] #W${other.name()} #w${other.title()}`.padEnd(86) + `\r\n`));
          
          /** Increment visible user count by one */
          count++;
        });
        
        /** Send first bottom border */
        user.send(world.colorize(`\r\n#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));

        /** If visible user count is equal to one, send only visible user */
        if ( count == 1 )
          user.send(world.colorize(`#wYou are the only Avatar that you can sense in this world.\r\n`));
        
        /** If visible user count is equal to two, send only one other visible user */
        else if ( count == 2 )
          user.send(world.colorize(`#wYou can sense one other Avatar in this world.\r\n`));
        
        /** Otherwise, send visible user count */
        else
          user.send(world.colorize(`#wYou can sense ${count - 1} other Avatars in this world.\r\n`));
        
        /** Send second bottom border */
        user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
      },
      priority: 0
    })
  ];
};
