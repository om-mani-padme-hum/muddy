module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `colors`,
      execute: async (world, user, buffer) => {
        /** Send colors */
        user.send(world.colorize(`##W - #WWhite\r\n`));
        user.send(world.colorize(`##w - #wLight gray\r\n`));
        user.send(world.colorize(`##K - #KDark gray\r\n`));
        user.send(world.colorize(`##k - #kBlack\r\n`));
        user.send(world.colorize(`##R - #RLight red\r\n`));
        user.send(world.colorize(`##r - #rDark red\r\n`));
        user.send(world.colorize(`##O - #OLight orange\r\n`));
        user.send(world.colorize(`##o - #oDark orange\r\n`));
        user.send(world.colorize(`##B - #BLight blue\r\n`));
        user.send(world.colorize(`##b - #bDark blue\r\n`));
        user.send(world.colorize(`##G - #GLight green\r\n`));
        user.send(world.colorize(`##g - #gDark green\r\n`));
        user.send(world.colorize(`##Y - #YLight yellow\r\n`));
        user.send(world.colorize(`##y - #yDark yellow\r\n`));
        user.send(world.colorize(`##P - #PLight purple\r\n`));
        user.send(world.colorize(`##p - #pDark purple\r\n`));
        user.send(world.colorize(`##C - #CLight cyan\r\n`));
        user.send(world.colorize(`##c - #cDark cyan\r\n\r\n`));
        
        user.send(world.colorize(`%%W - %WWhite background\r\n`));
        user.send(world.colorize(`%%w - %wLight gray background\r\n`));
        user.send(world.colorize(`%%K - %KDark gray background\r\n`));
        user.send(world.colorize(`%%k - %kBlack background\r\n`));
        user.send(world.colorize(`%%R - %RLight red background\r\n`));
        user.send(world.colorize(`%%r - %rDark red background\r\n`));
        user.send(world.colorize(`%%O - %OLight orange background\r\n`));
        user.send(world.colorize(`%%o - %oDark orange background\r\n`));
        user.send(world.colorize(`%%B - %BLight blue background\r\n`));
        user.send(world.colorize(`%%b - %bDark blue background\r\n`));
        user.send(world.colorize(`%%G - %GLight green background\r\n`));
        user.send(world.colorize(`%%g - %gDark green background\r\n`));
        user.send(world.colorize(`%%Y - %YLight yellow background\r\n`));
        user.send(world.colorize(`%%y - %yDark yellow background\r\n`));
        user.send(world.colorize(`%%P - %PLight purple background\r\n`));
        user.send(world.colorize(`%%p - %pDark purple background\r\n`));
        user.send(world.colorize(`%%C - %CLight cyan background\r\n`));
        user.send(world.colorize(`%%c - %cDark cyan background\r\n`));
      }
    }),
    new world.Command({
      name: `quit`,
      positions: world.constants().positionsSafe,
      execute: async (world, user, buffer) => {
        /** Log user quit */
        world.log().info(`User ${user.name()} has quit.`);

        /** Save user */
        await user.update(world.database());
        
        /** Remove user from anywhere */
        world.characterFromAnywhere(user);

        /** Remove user from world */
        if ( world.users().indexOf(user) !== -1 )
          world.users().splice(world.users().indexOf(user), 1);

        /** Close socket with final output of goodbye  */
        user.socket().end(`Goodbye!\r\n`);

        /** Null out user's socket */
        user.socket(null);
      }
    }),
    new world.Command({
      name: `save`,
      positions: world.constants().positionsSafe,
      execute: async (world, user, buffer) => {
        /** If user id is equal to zero, insert user into the database */
        if ( user.id() == 0 )
          await user.insert(world.database());
        
        /** Otherwise, save user */
        else
          await user.update(world.database());
        
        /** Send confirmation to user */
        user.send(`Saved.\r\n`);
      }
    }),
    new world.Command({
      name: `title`,
      execute: async (world, user, buffer) => {
        /** Set user's title */
        user.title(buffer);
        
        /** Execute save command on user */
        await world.commands().find(x => x.name() == `save`).execute()(world, user, ``);
      }
    })
  ];
};
