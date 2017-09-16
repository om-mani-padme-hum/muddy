const crypto = require('crypto');

/**
 * Input processor.
 */
class InputProcessor {  
  /** 
   * Input processor constructor.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
    this.init(data);
  }
  
  /**
   * Initialize the object to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    this.db(data.db == null ? null : data.db);
    this.world(data.world == null ? null : data.world);
  }
  
  /** 
   * Database MySQL object getter/setter.
   * @param (optional) db Desired MySQL database object
   * @return The input processor for set call chaining
   */
  db(db = null) {
    /** Getter */
    if ( db == null )
      return this._db;

    /** Setter */
    this._db = db;

    /** Allow for set call chaining */
    return this;
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
    /** Grab the user from the world */
    let user = this.world().findUserBySocket(socket);
    
    /** Process data based on user state */
    if ( user.state() == user.STATE_NAME )
      /** User is at the name state, first input of the game */
      this.processStateName(socket, buffer, user);
    else if ( user.state() == user.STATE_OLD_PASSWORD )
      /** User submitted name and was found to be previously saved, require old password */
      this.processStateOldPassword(socket, buffer, user);
    else if ( user.state() == user.STATE_NEW_PASSWORD )
      /** User submitted name and is new, ask for a new password */
      this.processStateNewPassword(socket, buffer, user);
    else if ( user.state() == user.STATE_CONFIRM_PASSWORD )
      /** User is new and provided a password, confirm it to be sure they typed it right */
      this.processStateConfirmPassword(socket, buffer, user);
    else if ( user.state() == user.STATE_MOTD ) 
      /** User has successfully logged in and is seeing MOTD, pause until they hit enter */
      this.processStateMOTD(socket, buffer, user);
    else if ( user.state() == user.STATE_CONNECTED )
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
    let name = buffer.toString().trim();

    if ( !name.match(/[a-zA-Z]{1}[a-z0-9]+/i) ) {
      /** Invalid characters in name */
      socket.write('Your name must start with a letter and contain only letters and numbers.\r\n');
      socket.write('Please enter a new name: ');
    } else if ( name.length < 3 || name.length > 14 ) { 
      /** Invalid name length */
      socket.write('Your name must be between 3 and 14 characters long.\r\n');
      socket.write('Please enter a new name: ');
    } else { 
      /** Query the database to see if user exists, if it does, load properties */
      this.db().query('SELECT id, name, password, salt, level FROM users WHERE LOWER(name) = ?', [name], function (error, results, fields) {
        /** Re-throw errors for now */
        if (error) throw error;

        if ( results[0] ) {     
          /** Existing user */
          socket.write('Please enter your password: ');

          /** Load the user */
          user.load(results[0]);

          user.state(user.STATE_OLD_PASSWORD);
        } else {
          /** New user */
          user.name(name);

          socket.write('Welcome to Muddy, ' + name + '!\r\n');
          socket.write('Please choose a password: ');

          user.state(user.STATE_NEW_PASSWORD);
        }

        /** Hide text for password */
        socket.write('\x1b[8m');
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
    var password = buffer.toString();

    /** Set up the crypto */
    let hash = crypto.createHmac('sha512', user.salt());

    /** Provide it the unencrypted password */
    hash.update(password);

    /** Get the encrypted password back */
    password = hash.digest('hex');

    /** Stop hiding text */
    socket.write('\x1b[0m');

    /** Validate password */
    if ( password == user.password() ) {
      /** Password matches, display MOTD */
      socket.write('--------------------------------------------------------------------------------\r\n');
      socket.write('Message of the day:\r\n');
      socket.write('\r\n');
      socket.write('New features:\r\n');
      socket.write('  * Users\r\n');
      socket.write('  * Logins\r\n');
      socket.write('  * World\r\n');
      socket.write('\r\n');
      socket.write('--------------------------------------------------------------------------------\r\n');
      socket.write('Press ENTER to continue...');

      user.state(user.STATE_MOTD);
      console.log('User ' + user.name() + ' connected.');
    } else {
      /** Password incorrect, remove user from world and terminate socket */
      muddy.removeUser(user);
      socket.end("Incorrect password, goodbye!\r\n");
      console.log("Failed login by " + user.name());
    }
  }
  
  /**
   * Process input from a user at the new password state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateNewPassword(socket, buffer, user) {
    let unencrypted = buffer.toString();

    /** Stop hiding text */
    socket.write('\x1b[0m');

    if ( password.match(/\s/i) ) {
      /** Whitespaces in password not allowed */
      socket.write('Your password must not contain spaces or other whitespace characters.\r\n');
      socket.write('Please enter a new password: ');
    } else if ( password.length < 8 || password.length > 32 ) { 
      /** Invalid password length */
      socket.write('Your password must be between 8 and 32 characters long.\r\n');
      socket.write('Please enter a new password: ');
    } else {
      /** Generate a random salt */
      let salt = crypto.randomBytes(8).toString('hex');

      /** Set up the crypto */
      let hash = crypto.createHmac('sha512', salt);

      /** Provide it the unencrypted password */
      hash.update(unencrypted);

      /** Get the encrypted password back */
      let password = hash.digest('hex');

      /** Store the encrypted password and salt */
      user.password(password);
      user.salt(salt);
      user.state(user.STATE_CONFIRM_PASSWORD);

      socket.write('Please confirm your new password: ');

      /** Hide text for password */
      socket.write('\x1b[8m');
    }
  }
  
  /**
   * Process input from a user at the confirm password state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateConfirmPassword(socket, buffer, user) {
    let unencrypted = buffer.toString();

    /** Set up the crypto */
    let hash = crypto.createHmac('sha512', user.salt());

    /** Provide it the unencrypted password */
    hash.update(unencrypted);

    /** Get the encrypted password back */
    let password = hash.digest('hex');

    /** Stop hiding text */
    socket.write('\x1b[0m');

    if ( password == user.password() ) {
      /** Password matches, proceed to MOTD */
      user.state(user.STATE_MOTD);
      console.log('User ' + user.name() + ' connected.');
    } else {
      /** Password does not match, let's try this again */
      socket.write('Passwords do not match, please try again!\r\n');
      socket.write('Please choose a password: ');
    }
  }
  
  /**
   * Process input from a user at the MOTD state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateMOTD(socket, buffer, user) {
    user.state(user.STATE_CONNECTED);
  }
  
  /**
   * Process input from a user at the connected state.
   * @param socket User's socket object
   * @param buffer User's input buffer
   * @param user User object
   */
  processStateConnected(socket, buffer, user) {
    socket.write('You are connected!\r\n');
  }
}

exports.InputProcessor = InputProcessor;