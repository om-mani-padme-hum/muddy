module.exports.createCommands = (world) => {
  return [
    new world.Command({
      name: `kill`,
      execute: async (world, user, buffer, args) => {
        const [name, count] = world.parseName(user, args, 0);

        const users = user.room().users().filter(x => x.name().toLowerCase().startsWith(name.toLowerCase()));
        const mobiles = user.room().mobiles().filter(x => x.names().some(y => y.toLowerCase().startsWith(name.toLowerCase())));
        
        const results = users.concat(mobiles);

        if ( results.length < count ) {
          user.send(`There is no being here by that name.\r\n`);
        } else {
          const target = results[count - 1];
          
          if ( target.affects().includes(world.constants().AFFECT_SAFE) ) {
            user.send(`That being cannot be attacked right now.\r\n`);
          } else {
            user.send(`You attack ${target.name()}!\r\n`);
            target.send(`You are being attacked by ${user.name()}!\r\n`);
            user.room().send(`${user.name()} starts attacking ${target.name()}!\r\n`, [user, target]);
            
            user.fighting(target);
            target.fighting(user);
          }
        }
      },
      priority: 999
    })
  ];
};

module.exports.updateFighting = (world, character) => {
  /** If character is not fighting, skip */
  if ( !character.fighting() )
    return;
  
  /** If character is no longer in same room as target, stop fighting */
  if ( character.room() != character.fighting().room() ) {
    character.fighting().fighting(null);
    character.fighting(null);
  }

  /** Otherwise, if target is now safe, stop fighting */
  else if ( character.affects().includes(world.constants().AFFECT_SAFE) ) {
    character.send(`That being cannot be attacked right now.\r\n`);
    character.fighting().fighting(null);
    character.fighting(null);
  }

  /** Otherwise, do some damage! */
  else {
    const roll = Math.floor(Math.random() * 100) + 1;

    /** If the roll is less than dodge chance, character misses */
    if ( roll < character.fighting().dodge() ) {
      character.send(`You miss ${character.fighting().name()}.\r\n`);
      character.fighting().send(`${character.name()} misses you.\r\n`);
      character.room().send(`${character.name()} misses ${character.fighting().name()}\r\n`, [character, character.fighting()]);
    } 

    /** Otherwise, character hits! */
    else {
      const damage = Math.floor(Math.random() * 10) + 1;

      character.send(`You hit ${character.fighting().name()} for ${damage} damage!\r\n`);
      character.fighting().send(`${character.name()} hits you for ${damage} damage!\r\n`);
      character.room().send(`${character.name()} hits ${character.fighting().name()}!\r\n`, [character, character.fighting()]);
    
      character.fighting().health(character.fighting().health() - damage);
    }

    /** If target is defeated, stop fighting */
    if ( character.fighting().health() < 0 ) {
      character.send(`You have defeated ${character.fighting().name()}!\r\n`);
      character.fighting().send(`You have been defeated by ${character.name()}!\r\n`);
      character.room().send(`${character.name()} has defaeted ${character.fighting().name()}!\r\n`, [character, character.fighting()]);

      character.fighting().fighting(null);
      character.fighting(null);
    }

    /** Otherwise, if character is defeated, stop fighting */
    else if ( character.health() < 0 ) {
      character.send(`You have been defeated by ${character.fighting().name()}!\r\n`);
      character.fighting().send(`You have defeated ${character.name()}!\r\n`);
      character.room().send(`${character.fighting().name()} has defaeted ${character.name()}!\r\n`, [character, character.fighting()]);

      character.fighting().fighting(null);
      character.fighting(null);
    }
  }
};
