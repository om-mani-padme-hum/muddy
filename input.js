/** Require external modules */
const crypto = require(`crypto`);

/**
 * Process input from a user at the name state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
async function processStateName(world, user, buffer) {  
  /** Force name to start with uppercase letter */
  const name = buffer.toString().trim().charAt(0).toUpperCase() + buffer.toString().trim().toLowerCase().slice(1);

  if ( !name.match(/^[a-z]+$/i) ) {
    /** Invalid characters in name */
    user.send(`Your name must contain only letters.\r\n`);
    user.send(`Please enter a new name: `);
  } else if ( name.length < 3 || name.length > 14 ) { 
    /** Invalid name length */
    user.send(`Your name must be between 3 and 14 characters long.\r\n`);
    user.send(`Please enter a new name: `);
  } else { 
    /** Backup socket */
    const socket = user.socket();
    
    /** Attempt to load (which initializes user first) */
    let existingUser = await user.load(name, world.database());
    
    /** Toggle user's command boolean */
    user.command(true);
    
    /** Restore user socket */
    user.socket(socket);

    /** If failed to load, send new password prompt */
    if ( !existingUser ) {
      /** Store name with original capitalization */
      user.name(buffer.toString().trim().charAt(0).toUpperCase() + buffer.toString().trim().slice(1));

      user.send(`Welcome to Muddy, ${name}!\r\n`);
      user.send(`Please choose a password: `);

      /** Move on to ask for them to pick a password */
      user.state(world.constants().STATE_NEW_PASSWORD);
    } 
    
    /** Otherwise, send old pasword prompt */
    else {
      /** Existing user */
      user.send(`Please enter your password: `);

      /** Move on to ask for existing password */
      user.state(world.constants().STATE_OLD_PASSWORD);
    }

    /** Hide text for password */
    user.send(world.constants().VT100_HIDE_TEXT);
  }
}

/**
 * Process input from a user at the old password state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
async function processStateOldPassword(world, user, buffer) {
  /** Define recursive helper function for adding any item contents to world and setting container of each */
  const recursiveItemContents = (item) => {
    /** Set prototype of item */
    item.prototype(world.itemPrototypes().find(x => x.id() == item.prototype().id()));

    item.contents().forEach((content) => {
      content.container(item);
            
      recursiveItemContents(content);
    });
  };
  
  /** Set up the crypto */
  const hash = crypto.createHmac(`sha512`, user.salt());
  
  /** Get the encrypted password */
  const password = hash.update(buffer).digest(`hex`);

  /** Stop hiding text */
  user.send(world.constants().VT100_CLEAR);

  /** Correct password? */
  if ( password == user.password() ) {
    /** Record the address if it's not already on the user's list */
    if ( !user.addresses().includes(user.socket().address().address) )
      user.addresses().push(user.socket().address().address);
    
    await user.update(world.database());
    
    /** Password matches, display message of the day */
    user.send(world.colorize(world.motd()));

    /** Get the last room */
    let room = world.rooms().find(x => x.id() == user.room().id());

    /** Verify last room exists or bug out */
    if ( !room ) {
      world.log().error(`User ${user.name()} trying to start with bad last room ${user.room().id()}, redirecting to start.`);
      
      room = world.rooms().find(x => x.id() == world.constants().START_ROOM);
      
      /** Verify start room exists or bug out */
      if ( !room ) {
        world.log().error(`Fatal error: Unable to load start room.`);
        process.exit(1);
      }
    }
        
    /** Set all inventory item's character to user */
    user.inventory().forEach((item) => {
      item.character(user);
      
      recursiveItemContents(item);
    });
    
    /** Set all equipment item's character to user */
    user.equipment().forEach((item) => {
      item.character(user);
      
      recursiveItemContents(item);
    });
        
    /** Move the user to the last room */
    await world.characterToRoom(user, room);
    
    /** Move on and pause until they're done reading the message of the day */
    user.state(world.constants().STATE_MOTD);

    world.log().info(`User ${user.name()} connected.`);
  } else {
    /** Password incorrect, remove user from world and terminate socket */
    if ( world.users().indexOf(user) !== -1 )
      world.users().splice(world.users().indexOf(user), 1);
    
    /** Terminate socket */
    user.socket().end(world.constants().VT100_CLEAR + `Incorrect password, goodbye!\r\n`);

    world.log().info(`Failed login by ${user.name()}.`);
  }
}

/**
 * Process input from a user at the new password state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
async function processStateNewPassword(world, user, buffer) {
  /** Stop hiding text */
  user.send(world.constants().VT100_CLEAR);

  if ( buffer.match(/\s/i) ) {
    /** Whitespaces in password not allowed */
    user.send(`Your password must not contain spaces or other whitespace characters.\r\n`);
    user.send(`Please enter a new password: `);
  } else if ( buffer.length < 8 || buffer.length > 32 ) { 
    /** Invalid password length */
    user.send(`Your password must be between 8 and 32 characters long.\r\n`);
    user.send(`Please enter a new password: `);
  } else {
    /** Generate a random salt */
    const salt = crypto.randomBytes(8).toString(`hex`);

    /** Set up the crypto */
    const hash = crypto.createHmac(`sha512`, salt);

    /** Get the encrypted password */
    const password = hash.update(buffer).digest(`hex`);

    /** Store the encrypted password and salt */
    user.password(password);
    user.salt(salt);

    user.send(`Please confirm your new password: `);

    /** Move on and confirm the password */
    user.state(world.constants().STATE_CONFIRM_PASSWORD);
  }
  
  /** Hide text for password */
  user.send(world.constants().VT100_HIDE_TEXT);
}

/**
 * Process input from a user at the confirm password state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
async function processStateConfirmPassword(world, user, buffer) {  
  /** Set up the crypto */
  const hash = crypto.createHmac(`sha512`, user.salt());

  /** Get the encrypted password back */
  const password = hash.update(buffer).digest(`hex`);

  /** Stop hiding text */
  user.send(world.constants().VT100_CLEAR);

  /** Correct password? */
  if ( password == user.password() ) {
    /** Record the address if it's not already on the user's list */
    if ( !user.addresses().includes(user.socket().address().address) )
      user.addresses().push(user.socket().address().address);
    
    await user.update(world.database());
    
    /** Password matches, proceed to the message of the day */
    user.send(world.colorize(world.motd()));
    
    /** Get the start room */
    const room = world.rooms().find(x => x.id() == world.constants().START_ROOM);

    /** Verify start room exists or bug out */
    if ( !room ) {
      world.log().error(`Fatal error: Unable to load start room.`);
      process.exit(1);
    }
    
    /** Move the user to the start room */
    await world.characterToRoom(user, room);

    /** Move on and pause until they're done reading the message of the day */
    user.state(world.constants().STATE_MOTD);

    world.log().info(`User ${user.name()} connected.`);
  } else {
    /** Password does not match, let's try this again */
    user.send(`Passwords do not match, please try again!\r\n`);
    user.send(`Please choose a password: `);
    user.state(world.constants().STATE_NEW_PASSWORD);
    
    /** Hide text for password */
    user.send(world.constants().VT100_HIDE_TEXT);
  }
}

/**
 * Process input from a user at the MOTD state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
async function processStateMOTD(world, user, buffer) {
  /** Replace user if he already exists */
  const oldUser = world.users().find((worldUser) => {
    return user.name() == worldUser.name() && user !== worldUser;
  });

  if ( oldUser ) {
    oldUser.room().users().forEach((roomUser) => {
      if ( roomUser !== oldUser && roomUser !== user )
        roomUser.send(`${oldUser.name()} suddenly gasps as if his spirit had just been taken over.\r\n`, false);
    });

    /** Remove user from room */
    if ( oldUser.room() && oldUser.room().users().indexOf(oldUser) !== -1 )
      oldUser.room().users().splice(oldUser.room().users().indexOf(oldUser), 1);

    /** Remove user from world */
    if ( world.users().indexOf(oldUser) !== -1 )
      world.users().splice(world.users().indexOf(oldUser), 1);

    world.log().info(`User ${oldUser.name()} has been replaced with a new user and socket.`);

    /** Close old socket and tell them they've been taken over */
    oldUser.socket().end(`Your body has been taken over!\r\n`);

    /** Tell user he's taken over */
    user.send(`You have reconnected to your old body.\r\n`);
  }

  /** Find and execute the look command for this user */
  await world.commands().find(x => x.name() == `look`).execute()(world, user, ``, []);
  
  world.send(world.colorize(`#YInfo -> ${user.name()} has come online.#n\r\n`));

  /** Move on and put user in game */
  user.state(world.constants().STATE_CONNECTED);
}

/**
 * Process input from a user at the connected state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
async function processStateConnected(world, user, buffer) {
  /** Parse arguments */
  let args = [];
  
  /** Convert buffer to lowercase string, trim spaces, except add one space at end to terminate final arg */
  const argsBuffer = buffer.toString().trim() + ` `;
  
  /** Keep track of whether we're inside quotes, what the quote character is, and the arg we're working on */
  let insideQuotes = false;
  let quote = ``;
  let arg = ``;
  
  /** Loop through buffer and group arguments that are quoted as args are added to list */
  for ( let i = 0; i < argsBuffer.length; i++ ) {
    const c = argsBuffer[i];
    
    if ( insideQuotes && c == quote && argsBuffer[i + 1] && argsBuffer[i + 1] == ` ` ) {
      args.push(arg);
      arg = ``;
      insideQuotes = false;
    } else if ( arg.length == 0 && !insideQuotes && [`'`, `"`, `\``].includes(c) ) {
      quote = c;
      insideQuotes = true;
    } else if ( !insideQuotes && c == ` ` ) {
      if ( arg.length > 0 ) {
        args.push(arg);
        arg = ``;
      }
    } else {
      arg += c;
    }
  }
  
  if ( arg.length > 0 )
    args.push(arg);
  
  args = args.filter(x => x != ``);
  
  /** If there was no command sent, just send a space to force flush of output buffer */
  if ( args.length == 0 )
    return user.send(` `);
  
  /** Convert command name to lowercase for lookup */
  const commandName = args[0].toLowerCase();
  
  /** Find the first matching command, if one exists */  
  const command = world.commands().filter(x => x.name().startsWith(commandName))[0];
  
  /** Allowable positions are configured positions or all by default */
  const allowablePositions = command && command.positions().length > 0 ? command.positions() : world.constants().POSITIONS_ALL;
  
  /** Convert buffer to string and trim command */
  buffer = buffer.toString().replace(new RegExp(`^[\\s'"]*${args[0]}[\\s'"]*`), ``);
    
  /** If it exists, execute it for this user, otherwise send error */
  if ( command && allowablePositions.includes(user.position()) )
    await command.execute()(world, user, buffer, args.slice(1).map(x => x.toLowerCase()));
  else if ( command && user.position() == world.constants().POSITION_DEAD )
    user.send(`You can't do that... you are DEAD!\r\n`);
  else if ( command && user.position() == world.constants().POSITION_INCAPACITATED )
    user.send(`You can't do that while incapacitated!\r\n`);
  else if ( command && user.position() == world.constants().POSITION_SLEEPING )
    user.send(`You can't do that while sleeping.\r\n`);
  else if ( command && user.position() == world.constants().POSITION_MEDITATING )
    user.send(`You can't do that while meditating.\r\n`);
  else if ( command && user.position() == world.constants().POSITION_LYING_DOWN )
    user.send(`You can't do that while lying down.\r\n`);
  else if ( command && user.position() == world.constants().POSITION_KNEELING )
    user.send(`You can't do that while kneeling.\r\n`);
  else if ( command && user.position() == world.constants().POSITION_SITTING )
    user.send(`You can't do that while sitting.\r\n`);
  else if ( command && user.position() == world.constants().POSITION_STANDING )
    user.send(`You can't do that while standing.\r\n`);
  else if ( command && user.position() == world.constants().POSITION_FIGHTING )
    user.send(`You can't do that while fighting!\r\n`);
  else
    user.send(`That action does not exist in this world.\r\n`);
}

/**
 * Dispatch input for processing based on user state.
 * @param socket Socket that sent input
 * @param buffer Input buffer
 */
module.exports.process = async function (world, user, buffer) {
  /** Toggle user's command boolean */
  user.command(true);
  
  /** User is at the name state, first input of the game */
  if ( user.state() == world.constants().STATE_NAME )
    await processStateName(world, user, buffer);

  /** User submitted name and was found to be previously saved, require old password */
  else if ( user.state() == world.constants().STATE_OLD_PASSWORD )
    await processStateOldPassword(world, user, buffer);
  
  /** User submitted name and is new, ask for a new password */  
  else if ( user.state() == world.constants().STATE_NEW_PASSWORD )
    await processStateNewPassword(world, user, buffer);
  
  /** User is new and provided a password, confirm it to be sure they typed it right */
  else if ( user.state() == world.constants().STATE_CONFIRM_PASSWORD )
    await processStateConfirmPassword(world, user, buffer);
  
  /** User has successfully logged in and is seeing MOTD, pause until they hit enter */
  else if ( user.state() == world.constants().STATE_MOTD ) 
    await processStateMOTD(world, user, buffer);
  
  /** User is connected and in world */
  else if ( user.state() == world.constants().STATE_CONNECTED )
    await processStateConnected(world, user, buffer);
};
