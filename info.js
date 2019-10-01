module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `character`,
      execute: async (world, user, buffer, args) => {
      },
      priority: 0
    }),
    new world.Command({
      name: `commands`,
      execute: async (world, user, buffer, args) => {   
        /** Loop through each command in world */
        world.commands().forEach((command, index) => {
          /** If this is the fifth command on this line, send new line */
          if ( index != 0 && index % 4 == 0 )
            user.send(`\r\n`);
          
          /** Send command name */
          user.send(`${command.name().padEnd(16)} `);
        });
        
        /** Send new line */
        user.send(`\r\n`);
      },
      priority: 0
    }),
    new world.Command({
      name: `help`,
      execute: async (world, user, buffer, args) => {   
        /** If no first argument was provided, send error */
        if ( typeof args[0] != `string` ) {
          /** Attempt to find help in world */
          const help = world.help().find(x => x.name() == ``);

          /** If help not found, send error */
          if ( !help ) {
            world.log().error(`The default help record is missing from the database`);
            return user.send(`There is no help, you are on your own for now...\r\n`);
          }

          /** Add border to text */
          const text = help.text().replace(/\r/g, ``).split(`\n`).map(x => `#r|#n ` + x.padEnd(77 + x.length - world.colorizedLength(x)) + `#r|`).join(`\r\n`);

          /** Send help text */
          user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
          user.send(world.colorize(`#r| #WHELP ${help.name().toUpperCase().padEnd(32)}                                        #r|\r\n`));
          user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
          user.send(world.colorize(`#r|                                                                              #r|\r\n`));
          user.send(world.colorize(text + `\r\n`));
          
          const suggestedSubjects = [`MUDDY`, `COMMANDS`, `MOVEMENT`, `EQUIPMENT`, `AREAS`, `COMBAT`];
          
          let subjects = `\r\n`;
          
          suggestedSubjects.forEach((value, index) => {
            subjects += value.padEnd(14);
            
            if ( (index + 1) % 5 == 0 )
              subjects += `\r\n\r\n`;
            else
              subjects += ` `;
          });
          
          subjects += `\r\n`;
          
          subjects = subjects.replace(/\r/g, ``).split(`\n`).map(x => `#r|#n ` + x.padEnd(77 + x.length - world.colorizedLength(x)) + `#r|`).join(`\r\n`);

          /** Send subjects and new line */
          user.send(world.colorize(subjects) + `\r\n`);
          user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
          
          return;
        } 
        
        /** Attempt to find help in world */
        const help = world.help().find(x => x.name().toLowerCase().startsWith(args[0]));
        
        /** If help not found, send error */
        if ( !help )
          return user.send(`There is no help topic matching that name.\r\n`);
        
        /** Add border to text */
        const text = help.text().replace(/\r/g, ``).split(`\n`).map(x => `#r|#n ` + x.padEnd(77 + x.length - world.colorizedLength(x)) + `#r|`).join(`\r\n`);
        
        /** Send help text */
        user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
        user.send(world.colorize(`#r| #WHELP ${help.name().toUpperCase().padEnd(32)}                                       #r|\r\n`));
        user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
        user.send(world.colorize(text));
      },
      priority: 0
    }),
    new world.Command({
      name: `score`,
      execute: async (world, user, buffer, args) => {   
        /** Send top border */
        user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
        user.send(world.colorize(`#r|                                                                              |\r\n`));

        /** Send user name and stats header */
        user.send(world.colorize(`#r|  ` + `#W${user.name()} #w${user.title()}`.padEnd(79) + ` #r|\r\n`));
        user.send(world.colorize(`#r|                                                                              |\r\n`));
        user.send(world.colorize(`#r|  #wSex:           #W${world.constants().sexNames[user.sex()].padStart(6)}             #wCombat Stats:                             #r|\r\n`));
        user.send(world.colorize(`#r|  #wLevel:          #W${user.level().toString().padStart(5)}                                                       #r|\r\n`));
        user.send(world.colorize(`#r|                                    #OAccuracy: #G${user.accuracy().toString().padStart(5)}   #WAir:        #G${user.air().toString().padStart(5)}       #r|\r\n`));
        user.send(world.colorize(`#r|  #wHealth: ${(world.colorStat(user.health(), user.maxHealth()) + `#w/#C` + user.maxHealth()).padStart(21)}             #KArmor:    #G${user.armor().toString().padStart(5)}#o   #PDeflection: #G${user.deflection().toString().padStart(5)}       #r|\r\n`));
        user.send(world.colorize(`#r|  #wMana:   ${(world.colorStat(user.mana(), user.maxMana()) + `#w/#C` + user.maxMana()).padStart(21)}             #cDodge:    #G${user.accuracy().toString().padStart(5)}   #yEarth:      #G${user.earth().toString().padStart(5)}       #r|\r\n`));
        user.send(world.colorize(`#r|  #wEnergy: ${(world.colorStat(user.energy(), user.maxEnergy()) + `#w/#C` + user.maxEnergy()).padStart(21)}             #RFire:     #G${user.fire().toString().padStart(5)}   #gLife:       #G${user.life().toString().padStart(5)}       #r|\r\n`));
        user.send(world.colorize(`#r|                                    #oPower:    #G${user.power().toString().padStart(5)}   #YSpeed:      #G${user.speed().toString().padStart(5)}       #r|\r\n`));
        user.send(world.colorize(`#r|  #wExperience: #C${user.experience().toString().padStart(9)}             #BWater:    #G${user.water().toString().padStart(5)}                           #r|\r\n`));
        user.send(world.colorize(`#r|                                                                              |\r\n`));
        user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
        user.send(world.colorize(`#r|                                                                              |\r\n`));
        user.send(world.colorize(`#r|  #wPosition: #W${world.constants().positionNames[user.position()].padEnd(13)}                                                     #r|\r\n`));
        user.send(world.colorize(`#r|                                                                              |\r\n`));

        /** Send first bottom border */
        user.send(world.colorize(`#r~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n`));
      },
      priority: 0
    })
  ];
};
