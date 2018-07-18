module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `build`,
      execute: async (world, user, buffer, args) => {
        /** Is there a valid build type argument? */
        if ( typeof args[0] != `string` ) {
          user.send(`Build what? [room|item|mobile]\r\n`);
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

            user.send(`You build an isolated room with ID# ${room.id()}.\r\n`);
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
            user.send(`You build a room to the ${world.constants().directionNames[world.constants().directionShortNames.indexOf(args[1])]}.\r\n`);
          } else {
            user.send(`You do not know that method of connecting a new room to the world.\r\n`);
          }
        } else if ( `item`.startsWith(args[0]) ) {
          user.send(`You build an item.\r\n`);
        } else if ( `mobile`.startsWith(args[0]) ) {
          user.send(`You build a mobile.\r\n`);
        } else {
          user.send(`You do not know how to build that.\r\n`);
        }
      },
      priority: 0
    })
  ];
};
