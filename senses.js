const terminalWrap = (text) => {
  const words = text.split(` `);
  
  return words.reduce((accumulator, val) => {
    if ( accumulator.length > 0 && val.length + accumulator[accumulator.length - 1].length + 1 <= 80 )
      accumulator[accumulator.length - 1] += ` ${val}`;
    else
      accumulator.push(val);
    
    return accumulator;
  }, []).join(`\r\n`);
};

module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `look`,
      execute: async (world, user, buffer) => {
        /** Send room name */
        user.send(`${user.room().name()}\r\n`);

        /** Send exits */
        user.send(`[Exits:`);

        /** Count the exits to see if there are any */
        let count = 0;

        /** Loop through exits in user`s room */
        user.room().exits().forEach((exit) => {
          /** Separate exit names with spaces */
          user.send(` `);

          /** Send exit name based on direction */
          user.send(world.constants().directionNames[exit.direction()]);

          count++;
        });

        /** No exits, output none */
        if ( count == 0 )
          user.send(` None`);

        user.send(`]\r\n`);

        /** Send room description */
        user.send(`${terminalWrap(user.room().description())}\r\n`);

        /** Send any mobiles in the room */
        user.room().mobiles().forEach((other) => {
          user.send(`  ${other.name()} is standing here.\r\n`);
        });
        
        /** Send any other users in the room */
        user.room().users().forEach((other) => {
          if ( user != other )
            user.send(`  ${other.name()} is standing here.\r\n`);
        });

        /** Send any objets in the room */
        user.room().items().forEach((item) => {
          user.send(`    ${item.name()} sits here.\r\n`);
        });
      },
      priority: 999
    })
  ];
};
