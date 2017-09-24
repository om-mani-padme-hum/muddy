'use strict';

const crypto = require('crypto');

/**
 * Input processor.
 */
class InputProcessor {  
  /** 
   * Input processor constructor.
   * @param world The world object
   */
  constructor(world) {
    this.world(world);
  }
  
  /** 
   * World object getter/setter.
   * @param (optional) world Desired world object
   * @return The input processor for set call chaining
   */
  world(world = null) {
    /** Getter */
    if ( world == null )
      return this._world;
    
    /** Setter */
    this._world = world;

    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Dispatch input for processing based on user state.
   * @param socket Socket that sent input
   * @param buffer Input buffer
   */
  process(socket, buffer) {
    /** Grab the user by socket, if one exists */
    const user = this.world().users(socket);
    
    /** Just in case this happens, let's know about it */
    if ( user == null ) {
      console.log('User is null on process input.  Debugging...\r\n');
      console.log('Socket dump:\r\n');
      console.log(socket);
      return;
    }
    
    /** Process data based on user state */
    if ( user.state() == this.world().STATE_NAME )
      /** User is at the name state, first input of the game */
      this.processStateName(socket, buffer, user);
    else if ( user.state() == this.world().STATE_OLD_PASSWORD )
      /** User submitted name and was found to be previously saved, require old password */
      this.processStateOldPassword(socket, buffer, user);
    else if ( user.state() == this.world().STATE_NEW_PASSWORD )
      /** User submitted name and is new, ask for a new password */
      this.processStateNewPassword(socket, buffer, user);
    else if ( user.state() == this.world().STATE_CONFIRM_PASSWORD )
      /** User is new and provided a password, confirm it to be sure they typed it right */
      this.processStateConfirmPassword(socket, buffer, user);
    else if ( user.state() == this.world().STATE_MOTD ) 
      /** User has successfully logged in and is seeing MOTD, pause until they hit enter */
      this.processStateMOTD(socket, buffer, user);
    else if ( user.state() == this.world().STATE_CONNECTED )
      /** User is connected and in world */
      this.processStateConnected(socket, buffer, user);
  }
  
  /**
   * Process input from a user at the name state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateName(socket, buffer, user) {
    const name = buffer.toString().trim();

    if ( !name.match(/[a-zA-Z]{1}[a-z0-9]+/i) ) {
      /** Invalid characters in name */
      user.send('Your name must start with a letter and contain only letters and numbers.\r\n');
      user.send('Please enter a new name: ');
    } else if ( name.length < 3 || name.length > 14 ) { 
      /** Invalid name length */
      user.send('Your name must be between 3 and 14 characters long.\r\n');
      user.send('Please enter a new name: ');
    } else { 
      /** 
       * Use the load user by name handler to look up the user.
       * Note loadUserByName() returns a function, thus the ()(name, (newUser) => {})
       */
      this.world().loadUserByName()(name, (newUser) => {
        if ( newUser ) {     
          /** Existing user */
          user.send('Please enter your password: ');

          /** Capture the true socket so we don't overwrite it */
          const holdSocket = user.socket();
  
          /** Load the user */
          this.world().users().splice(user);
          this.world().users().push(newUser);
          
          user = newUser;
                    
          /** Replace it after user load, so we can ditch userData */
          user.socket(holdSocket);
          
          /** Move on to ask for existing password */
          user.state(this.world().STATE_OLD_PASSWORD);
        } else {
          /** New user */
          user.name(name);

          user.send(`Welcome to Muddy, ${name}!\r\n`);
          user.send('Please choose a password: ');

          /** Move on to ask for them to pick a password */
          user.state(this.world().STATE_NEW_PASSWORD);
        }

        /** Hide text for password */
        user.send(this.world().VT100_HIDE_TEXT);
      });
    }
  }
  
  /**
   * Process input from a user at the old password state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateOldPassword(socket, buffer, user) {
    const unencrypted = buffer.toString().trim();

    /** Set up the crypto */
    const hash = crypto.createHmac('sha512', user.salt());

    /** Provide it the unencrypted password */
    hash.update(unencrypted);

    /** Get the encrypted password back */
    const password = hash.digest('hex');

    /** Stop hiding text */
    user.send(this.world().VT100_CLEAR);
    
    /** Validate password */
    if ( password == user.password() ) {
      /** Password matches, display message of the day */
      user.send(this.world().motd());
          
      /** Move on and pause until they're done reading the message of the day */
      user.state(this.world().STATE_MOTD);
      
      console.log(`User ${user.name()} connected.`);
    } else {
      /** Password incorrect, remove user from world and terminate socket */
      this.world().removeUser(user);
      
      /** Terminate socket */
      socket.end("Incorrect password, goodbye!\r\n");
      
      console.log(`Failed login by ${user.name()}.`);
    }
  }
  
  /**
   * Process input from a user at the new password state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateNewPassword(socket, buffer, user) {
    const unencrypted = buffer.toString().trim();

    /** Stop hiding text */
    user.send(this.world().VT100_CLEAR);

    if ( unencrypted.match(/\s/i) ) {
      /** Whitespaces in password not allowed */
      user.send('Your password must not contain spaces or other whitespace characters.\r\n');
      user.send('Please enter a new password: ');
    } else if ( unencrypted.length < 8 || unencrypted.length > 32 ) { 
      /** Invalid password length */
      user.send('Your password must be between 8 and 32 characters long.\r\n');
      user.send('Please enter a new password: ');
    } else {
      /** Generate a random salt */
      const salt = crypto.randomBytes(8).toString('hex');

      /** Set up the crypto */
      const hash = crypto.createHmac('sha512', salt);

      /** Provide it the unencrypted password */
      hash.update(unencrypted);

      /** Get the encrypted password back */
      const password = hash.digest('hex');

      /** Store the encrypted password and salt */
      user.password(password);
      user.salt(salt);
      
      user.send('Please confirm your new password: ');

      /** Hide text for password */
      user.send(this.world().VT100_HIDE_TEXT);
      
      /** Move on and confirm the password */
      user.state(this.world().STATE_CONFIRM_PASSWORD);
    }
  }
  
  /**
   * Process input from a user at the confirm password state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateConfirmPassword(socket, buffer, user) {
    const unencrypted = buffer.toString().trim();

    /** Set up the crypto */
    const hash = crypto.createHmac('sha512', user.salt());

    /** Provide it the unencrypted password */
    hash.update(unencrypted);

    /** Get the encrypted password back */
    const password = hash.digest('hex');

    /** Stop hiding text */
    user.send(this.world().VT100_CLEAR);

    if ( password == user.password() ) {
      /** Password matches, proceed to the message of the day */
      user.send(this.world().motd());
    
      /** Get the start room */
      const room = this.world().rooms(this.world().start());
          
      /** Move the user to the start room */
      user.room(room);
      
      /** Move on and pause until they're done reading the message of the day */
      user.state(this.world().STATE_MOTD);

      console.log(`User ${user.name()} connected.`);
    } else {
      /** Password does not match, let's try this again */
      user.send('Passwords do not match, please try again!\r\n');
      user.send('Please choose a password: ');
      user.state(this.world().STATE_NEW_PASSWORD);
    }
  }
  
  /**
   * Process input from a user at the MOTD state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateMOTD(socket, buffer, user) {
    /** Find the look command */
    const command = this.world().commands().find((command) => {
      return command.name() == 'look';
    });
    
    /** Execute it for this user */
    command.execute(user, '');
    
    /** Send prompt */
    this.prompt(user);
    
    /** Move on and put user in game */
    user.state(this.world().STATE_CONNECTED);
  }
  
  /**
   * Process input from a user at the connected state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateConnected(socket, buffer, user) {
    /** @todo Process user commands */
    const matches = buffer.toString().trim().match(/^([^\s]*)\s*(.*)/);
    
    if ( matches[1] == '' ) {
      /** Just send prompt */
      this.prompt(user);
      return;
    }
    
    /** Find the first matching command, if one exists */
    const command = this.world().commands().find((command) => {
      return command.name().match(`^${matches[1]}`);
    });
    
    /** If it exists, execute it for this user, otherwise send error */
    if ( command )
      command.execute(user, matches[2]);
    else
      user.send('That action does not exist in this world.\r\n');
    
    /** Send prompt */
    this.prompt(user);
  }
  
  /**
   * Send a prompt to the user.
   * @param user User to send prompt to
   */
  prompt(user) {
    user.send('\r\n0xp <100h 100m> ');
  }
}

exports.InputProcessor = InputProcessor;