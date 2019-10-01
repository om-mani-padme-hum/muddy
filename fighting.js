module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `kill`,
      positions: [world.constants().positions.STANDING, world.constants().positions.FIGHTING],
      execute: async (world, user, buffer, args) => {
        /** Parse name and count of argument */
        const [name, count] = world.parseName(user, args, 0);

        /** Create array of users in room with name matching argument */
        const users = user.room().users().filter(x => x.name().toLowerCase().startsWith(name));
        
        /** Create array of mobiles in room with name matching argument */
        const mobiles = user.room().mobiles().filter(x => x.names().some(y => y.toLowerCase().startsWith(name)));
        
        /** Create array of users and mobiles combined */
        const characters = users.concat(mobiles);

        /** If the number of characters is less than the count, send error and return */
        if ( characters.length < count )
          return user.send(`There is no being here by that name.\r\n`);

        /** Create variable for target */
        const target = characters[count - 1];

        /** If target is affected by 'safe', they can't be attacked, send error and return */
        if ( target.affects().includes(world.constants().AFFECT_SAFE) )
          return user.send(`That being cannot be attacked right now.\r\n`);

        /** Send action to user */
        user.send(`You attack ${target.name()}!\r\n`);
        
        /** Send action to target */
        target.send(`You are being attacked by ${user.name()}!\r\n`);
        
        /** Send action to user's room */
        user.room().send(`${user.name()} starts attacking ${target.name()}!\r\n`, [user, target]);
        
        /** Update character's positions to fighting */
        user.position(world.constants().positions.FIGHTING);
        target.position(world.constants().positions.FIGHTING);

        /** Set user and target as fighting each other */
        user.fighting(target);
        target.fighting(user);
      },
      priority: 999
    })
  ];
};

module.exports.updateFighting = (world, character) => {
  /** If character is not fighting, skip them */
  if ( !character.fighting() )
    return;
  
  /** If character is no longer in same room as target... */
  if ( character.room() != character.fighting().room() ) {
    /** Update character's position */
    character.fighting().position(world.constants().positions.STANDING);
    character.position(world.constants().positions.STANDING);
    
    /** Stop character's from fighting */
    character.fighting().fighting(null);
    character.fighting(null);
  }

  /** Otherwise, if target is now safe, stop fighting */
  else if ( character.affects().includes(world.constants().AFFECT_SAFE) ) {
    /** Send error to fighting character */
    character.send(`That being cannot be attacked right now.\r\n`);
    
    /** Update character's position */
    character.fighting().position(world.constants().positions.STANDING);
    character.position(world.constants().positions.STANDING);
    
    /** Stop character's from fighting */
    character.fighting().fighting(null);
    character.fighting(null);
  }

  /** Otherwise... */
  else {
    /** Calculate the roll for this round of damage */
    const roll = Math.floor(Math.random() * 100) + 1;

    /** If the roll is less than dodge chance... */
    if ( roll < character.fighting().dodge() ) {
      /** Send miss to fighting character */
      character.send(`You miss ${character.fighting().name()}.\r\n`);
      
      /** Send miss to character being fought */
      character.fighting().send(`${character.name()} misses you.\r\n`);
      
      /** Send miss to character's room */
      character.room().send(`${character.name()} misses ${character.fighting().name()}\r\n`, [character, character.fighting()]);
    } 

    /** Otherwise... */
    else {
      /** Calculate damage for this hit */
      const damage = Math.floor(Math.random() * 10) + 1;

      /** Send hit to fighting character */
      character.send(`You hit ${character.fighting().name()} for ${damage} damage!\r\n`);
      
      /* * Send hit to character being fought */
      character.fighting().send(`${character.name()} hits you for ${damage} damage!\r\n`);
      
      /** Send hit to character's room */
      character.room().send(`${character.name()} hits ${character.fighting().name()}!\r\n`, [character, character.fighting()]);
    
      /** Deal damage to character being fought */
      character.fighting().health(character.fighting().health() - damage);
    }

    /** If character being fought is defeated... */
    if ( character.fighting().health() < 0 ) {
      /** Send defeat to character */
      character.send(`You have knocked ${character.fighting().name()} unconscious!\r\n`);
      
      /** Send defeat to character being fought */
      character.fighting().send(`You have been knocked unconscious!\r\n`);
      
      /** Send defeat to character's room */
      character.room().send(`${character.name()} has knocked ${character.fighting().name()} unconscious!\r\n`, [character, character.fighting()]);

      /** Update character's positions */
      character.fighting().position(world.constants().positions.INCAPACITATED);      
      character.position(world.constants().positions.STANDING);
      
      /** Stop character's from fighting */
      character.fighting().fighting(null);
      character.fighting(null);
    }

    /** Otherwise, if fighting character is defeated... */
    else if ( character.health() < 0 ) {
      /** Send defeat to character */
      character.send(`You have been knocked unconscious!\r\n`);
      
      /** Send defeat to character being fought */
      character.fighting().send(`You have knocked ${character.name()} unconscious!\r\n`);
      
      /** Send defeat to character's room */
      character.room().send(`${character.fighting().name()} has knocked ${character.name()} unconscious!\r\n`, [character, character.fighting()]);

      /** Update character's positions */
      character.fighting().position(world.constants().positions.STANDING);
      character.position(world.constants().positions.INCAPACITATED);
      
      /** Stop character's from fighting */
      character.fighting().fighting(null);
      character.fighting(null);
    }
  }
};
