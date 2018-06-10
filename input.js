/** Require external modules */
const crypto = require('crypto');

/** Require local modules */
const constants = require('./constants');

/**
 * Process input from a user at the name state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
async function processStateName(world, user, buffer) {
  /** Force name to start with uppercase letter */
  let name = buffer.toString().trim().charAt(0).toUpperCase() + buffer.toString().trim().slice(1);

  if ( !name.match(/[a-zA-Z]{1}[a-z0-9]+/i) ) {
    /** Invalid characters in name */
    user.send('Your name must start with a letter and contain only letters and numbers.\r\n');
    user.send('Please enter a new name: ');
  } else if ( name.length < 3 || name.length > 14 ) { 
    /** Invalid name length */
    user.send('Your name must be between 3 and 14 characters long.\r\n');
    user.send('Please enter a new name: ');
  } else { 
    let newUser = false;
    
    /** Store name (will be overwritten if successfully loaded) */
    user.name(name);

    try {
      await user.load(world.database(), name);
    } catch ( err ) {
      newUser = true;
    }

    if ( !newUser ) {     
      /** Existing user */
      user.send('Please enter your password: ');

      /** Move on to ask for existing password */
      user.state(constants.STATE_OLD_PASSWORD);
    } else {
      user.send(`Welcome to Muddy, ${name}!\r\n`);
      user.send('Please choose a password: ');

      /** Move on to ask for them to pick a password */
      user.state(constants.STATE_NEW_PASSWORD);
    }

    /** Hide text for password */
    user.send(constants.VT100_HIDE_TEXT);
  }
}

/**
 * Process input from a user at the old password state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
function processStateOldPassword(world, user, buffer) {
  /** Set up the crypto */
  const hash = crypto.createHmac('sha512', user.salt());

  /** Provide it the unencrypted password */
  hash.update(buffer);

  /** Get the encrypted password back */
  const password = hash.digest('hex');

  /** Stop hiding text */
  user.send(constants.VT100_CLEAR);

  /** Validate password */
  if ( password == user.password() ) {
    /** Password matches, display message of the day */
    user.send(this.world().motd());

    /** Move on and pause until they're done reading the message of the day */
    user.state(constants.STATE_MOTD);

    console.log(`User ${user.name()} connected.`);
  } else {
    /** Password incorrect, remove user from world and terminate socket */
    world.users().splice(world.users().indexOf(user), 1);

    /** Terminate socket */
    user.socket().end("Incorrect password, goodbye!\r\n");

    console.log(`Failed login by ${user.name()}.`);
  }
}

/**
 * Process input from a user at the new password state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
function processStateNewPassword(world, user, buffer) {
  /** Stop hiding text */
  user.send(constants.VT100_CLEAR);

  if ( buffer.match(/\s/i) ) {
    /** Whitespaces in password not allowed */
    user.send('Your password must not contain spaces or other whitespace characters.\r\n');
    user.send('Please enter a new password: ');
  } else if ( buffer.length < 8 || buffer.length > 32 ) { 
    /** Invalid password length */
    user.send('Your password must be between 8 and 32 characters long.\r\n');
    user.send('Please enter a new password: ');
  } else {
    /** Generate a random salt */
    const salt = crypto.randomBytes(8).toString('hex');

    /** Set up the crypto */
    const hash = crypto.createHmac('sha512', salt);

    /** Provide it the unencrypted password */
    hash.update(buffer);

    /** Get the encrypted password back */
    const password = hash.digest('hex');

    /** Store the encrypted password and salt */
    user.password(password);
    user.salt(salt);

    user.send('Please confirm your new password: ');

    /** Hide text for password */
    user.send(constants.VT100_HIDE_TEXT);

    /** Move on and confirm the password */
    user.state(constants.STATE_CONFIRM_PASSWORD);
  }
}

/**
 * Process input from a user at the confirm password state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
function processStateConfirmPassword(world, user, buffer) {
  /** Set up the crypto */
  const hash = crypto.createHmac('sha512', user.salt());

  /** Provide it the unencrypted password */
  hash.update(buffer);

  /** Get the encrypted password back */
  const password = hash.digest('hex');

  /** Stop hiding text */
  user.send(constants.VT100_CLEAR);

  if ( password == user.password() ) {
    /** Password matches, proceed to the message of the day */
    user.send(world.motd());

    /** Get the start room */
    const room = world.rooms().find(x => x.id() == constants.START_ROOM);

    /** Move the user to the start room */
    user.room(room);

    /** Move on and pause until they're done reading the message of the day */
    user.state(constants.STATE_MOTD);

    console.log(`User ${user.name()} connected.`);
  } else {
    /** Password does not match, let's try this again */
    user.send('Passwords do not match, please try again!\r\n');
    user.send('Please choose a password: ');
    user.state(constants.STATE_NEW_PASSWORD);
  }
}

/**
 * Process input from a user at the MOTD state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
function processStateMOTD(world, user, buffer) {
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
    if ( oldUser.room() )
      oldUser.room().users().splice(oldUser.room().users().indexOf(oldUser), 1);

    /** Remove user from world */
    world.users().splice(world.users().indexOf(oldUser), 1);

    console.log(`User ${oldUser.name()} has been replaced with a new user and socket.`);

    /** Close old socket and tell them they've been taken over */
    oldUser.socket().end('Your body has been taken over!\r\n');

    /** Tell user he's taken over */
    user.send('You have reconnected to your old body.\r\n');
  }

  /** Set periodic flush of output buffer */
  //setTimeout(user.flush.bind(user), 1000);

  /** Find and execute the look command for this user */
  world.commands().find(x => x.name() == 'look').execute()(world, user, '');

  /** Send prompt */
  user.prompt();

  /** Move on and put user in game */
  user.state(constants.STATE_CONNECTED);
}

/**
 * Process input from a user at the connected state.
 * @param socket User's socket item
 * @param buffer User's input buffer
 * @param user User item
 */
function processStateConnected(world, user, buffer) {
  /** @todo Process user commands */
  const matches = buffer.toString().trim().match(/^([^\s]*)\s*(.*)/);

  if ( matches[1] == '' ) {
    /** Just send prompt */
    user.prompt();
    return;
  }

  /** Find the first matching command, if one exists */
  const command = world.commands().find((command) => {
    return command.name().match(new RegExp(`^${matches[1]}`, 'i'));
  });

  /** If it exists, execute it for this user, otherwise send error */
  if ( command )
    command.execute()(world, user, matches[2]);
  else
    user.send('That action does not exist in this world.\r\n');

  /** Send prompt */
  user.prompt();
}

/**
 * Dispatch input for processing based on user state.
 * @param socket Socket that sent input
 * @param buffer Input buffer
 */
module.exports.process = async function (world, user, buffer) {
  /** User is at the name state, first input of the game */
  if ( user.state() == constants.STATE_NAME )
    await processStateName(world, user, buffer);

  /** User submitted name and was found to be previously saved, require old password */
  else if ( user.state() == constants.STATE_OLD_PASSWORD )
    processStateOldPassword(world, user, buffer);
  
  /** User submitted name and is new, ask for a new password */  
  else if ( user.state() == constants.STATE_NEW_PASSWORD )
    processStateNewPassword(world, user, buffer);
  
  /** User is new and provided a password, confirm it to be sure they typed it right */
  else if ( user.state() == constants.STATE_CONFIRM_PASSWORD )
    processStateConfirmPassword(world, user, buffer);
  
  /** User has successfully logged in and is seeing MOTD, pause until they hit enter */
  else if ( user.state() == constants.STATE_MOTD ) 
    processStateMOTD(world, user, buffer);
  
  /** User is connected and in world */
  else if ( user.state() == constants.STATE_CONNECTED )
    processStateConnected(world, user, buffer);
}
