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
            const room = new world.Room();

            room.insert(world.database());

            user.send(`You build an isolated room with ID# ${room.id()}.\r\n`);
          } else if ( constants.dirShortNames.includes(args[1]) ) {
            if ( user.room().exits().find(x => x.dir() == world.constants().dirShortNames.indexOf(args[1])) ) {
              user.send(`There is already a room in that direction.`);
              return;
            }

            const room = new world.Room();

            room.insert(world.database());

            const exit1 = new world.Exit({
              dir: world.constants().dirShortNames.indexOf(args[1]),
              fromRoomId: user.room().id(),
              toRoomId: room.id(),
              flags: []
            });

            user.room().exits().push(exit1);

            exit1.insert(world.database());

            const exit2 = new world.Exit({
              dir: world.constants().dirOpposite[constants.dirShortNames.indexOf(args[1])],
              fromRoomId: room.id(),
              toRoomId: user.room().id(),
              flags: []
            });

            exit2.insert(world.database());

            room.exits().push(exit2);

            world.rooms().push(room);
            user.room().area().rooms().push(room);

            user.send(`You build a room to the ${world.constants().dirNames[world.constants().dirShortNames.indexOf(args[1])]}.\r\n`);
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
