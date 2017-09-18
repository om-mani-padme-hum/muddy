'use strict';

/** External modules */
const net = require('net');
const crypto = require('crypto');

/** Muddy modules */
const input = require('./input');
const users = require('./users');

/**
 * Data model and helper class for a Muddy world.
 */
class World {
  /**
   * Instantiate a new world.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
    /** Define VT100 terminal modifiers */
    this.VT100_CLEAR = '\x1b[0m';
    this.VT100_HIDE_TEXT = '\x1b[8m';
    
    /** Define direction flags */
    this.DIR_NORTH = 0;                    /**< n */
    this.DIR_NORTHEAST = 1;                /**< ne */
    this.DIR_EAST = 2;                     /**< e */
    this.DIR_SOUTHEAST = 3;                /**< se */
    this.DIR_SOUTH = 4;                    /**< s */
    this.DIR_SOUTHWEST = 5;                /**< sw */
    this.DIR_WEST = 6;                     /**< w */
    this.DIR_NORTHWEST = 7;                /**< nw */
    this.DIR_UP = 8;                       /**< u */
    this.DIR_DOWN = 9;                     /**< d */
    
    this.init(data);
  }

  /**
   * Initialize the object to provided data or defaults.
   * @param data (optional) Configuration object
   * @todo Remove users and objects from this class and put them under areas
   */
  init(data = {}) {
    /** Set up some Muddy defaults */
    let defaultPort = 9000;
    
    let defaultWelcome = ['\r\n',
                           '\r\n',
                           '\r\n',
                           '                              W E L C O M E    T O\r\n',
                           '\r\n',
                           '\r\n',
                           '                                          _     _\r\n',
                           '                          /\\/\\  _   _  __| | __| |_   _\r\n',
                           '                         /    \\| | | |/ _` |/ _` | | | |\r\n',
                           '                        / /\\/\\ \\ |_| | (_| | (_| | |_| |\r\n',
                           '                        \\/    \\/\\__,_|\\__,_|\\__,_|\\__, |\r\n',
                           '                                                  |___/\r\n',
                           '\r\n',
                           '                              Created by Rich Lowe\r\n',
                           '                                  MIT Licensed\r\n',
                           '\r\n',
                           '\r\n',
                           '\r\n',
                           '\r\n',
                           '\r\n',
                           '\r\n',
                           '\r\n',
                           '\r\n',
                           'Hello, what is your name? '].join('');
    
    let defaultMotd = ['--------------------------------------------------------------------------------\r\n',
                        'Message of the day:\r\n',
                        '\r\n',
                        'New features:\r\n',
                        '  * Users\r\n',
                        '  * Logins\r\n',
                        '  * World\r\n',
                        '\r\n',
                        '--------------------------------------------------------------------------------\r\n',
                        'Press ENTER to continue...'].join('');

    let defaultLoadAreas = () => {
      this.addArea({
        id: 1,
        name: 'Stuck in the mud',
        flags: 0,
        rooms: {
          id: 1,
          name: 'Stuck in the mud',
          description: [`There seems to be lots to explore 'out there', but you can't do much of\r\n`,
                        `anything as you're stuck in the mud.  Might want to pray the immortals\r\n`,
                        `help you find a way out and back into a worthy world.\r\n`].join(''),
          flags: 0
        }
      });
    };
    
    /** Objects and values */
    this.port(data.port = null ? defaultPort : data.port);
    this.areas(data.areas == null ? [] : data.areas);
    this.rooms(data.rooms == null ? [] : data.rooms);
    this.objects(data.objects == null ? [] : data.objects);
    this.users(data.users == null ? [] : data.users);
    this.commands(data.commands == null ? [] : data.commands);
    this.welcome(data.welcome == null ? defaultWelcome : data.welcome);
    this.motd(data.motd == null ? defaultMotd : data.motd);
    
    /** Handlers */
    this.loadUserByName(data.loadUserByName == null ? (name, next) => { next(new users.User()); } : data.loadUserByName);
    this.saveUser(data.saveUser == null ? (user) => {} : data.saveUser);
    this.loadAreas(data.loadAreas == null ? (next) => { next(); } : data.loadAreas);
    this.saveArea(data.saveArea == null ? (area) => {} : data.saveArea);    
  }

  /**
   * Start server and periodic world update.
   */
  listen() {
    /** Create input processor */
    let inputProcessor = new input.InputProcessor({
      world: this
    });

    /** Create server -- net.createServer constructor parameter is new connection handler */
    let server = net.createServer((socket) => {
      console.log(`New socket from ${socket.address().address}.`);

      /** Create a new user */
      var user = new users.User({
        socket: socket
      });

      /** 
       * Assign socket a random ID because apparently sockets aren't unique enough for comparison.
       * @todo Find another way
       */
      socket.id = crypto.randomBytes(32).toString('hex');

      /** Add user to active users list */
      this.addUser(user);

      /** Log user disconnects */
      socket.on('end', () => {
        let user = this.findUserBySocket(socket);

        if ( user ) {
          console.log(`User ${user.name()} disconnected.`);
          
          user.socket(null);
          user.state(user.STATE_DISCONNECTED);
        } else {
          console.log('Socket disconnected.');
        }
      });

      /** Data received from user */
      socket.on('data', (buffer) => {    
        /** Pass input to the input processor */
        inputProcessor.process(socket, buffer);
      });

      /** Display welcome message */
      socket.write(this.welcome());
    });

    /** Re-throw errors for now */
    server.on('error', (error) => {
      throw error;
    });

    /** Time to get started */
    server.listen(this.port(), () => {
      console.log(`Muddy is up and running on port ${this.port()}!`);
    });
  }
  
  /** 
   * Server port getter/setter.
   * @param (optional) rooms Desired server port
   * @return The world for set call chaining
   */
  port(port = null) {
    /** Getter */
    if ( port == null )
      return this._port;

    /** Setter */
    this._port = port;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Welcome message getter/setter.
   * @param (optional) welcome Desired welcome message
   * @return The world for set call chaining
   */
  welcome(welcome = null) {
    /** Getter */
    if ( welcome == null )
      return this._welcome;

    /** Setter */
    this._welcome = welcome;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Message of the day (MOTD) getter/setter.
   * @param (optional) welcome Desired message of the day
   * @return The world for set call chaining
   */
  motd(motd = null) {
    /** Getter */
    if ( motd == null )
      return this._motd;

    /** Setter */
    this._motd = motd;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Areas getter/setter.
   * @param (optional) areas Desired areas
   * @return The world for set call chaining
   */
  areas(areas = null) {
    /** Getter */
    if ( areas == null )
      return this._areas;

    /** Setter */
    this._areas = areas;

    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Add area.
   * @param area Desired area to add
   * @return Added area
   */
  addArea(area) {
    /** Push area onto list */
    this.areas().push(area);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Rooms getter/setter.
   * @param (optional) rooms Desired rooms
   * @return The world for set call chaining
   */
  rooms(rooms = null) {
    /** Getter */
    if ( rooms == null )
      return this._rooms;

    /** Setter */
    this._rooms = rooms;

    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Add room.
   * @param room Desired room to add
   * @return Added room
   */
  addRoom(room) {
    /** Push user onto list */
    this.rooms().push(room);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Objects getter/setter.
   * @param (optional) users Desired objects
   * @return The world for set call chaining
   */
  objects(objects = null) {
    /** Getter */
    if ( objects == null )
      return this._objects;

    /** Setter */
    this._objects = objects;

    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Add object.
   * @param object Desired object to add
   * @return Added object
   */
  addObject(object) {
    /** Push object onto list */
    this.objects().push(object);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Users getter/setter.
   * @param (optional) users Desired users
   * @return The world for set call chaining
   */
  users(users = null) {
    /** Getter */
    if ( users == null )
      return this._users;

    /** Setter */
    this._users = users;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Commands getter/setter.
   * @param (optional) users Desired commands
   * @return The world for set call chaining
   */
  commands(commands = null) {
    /** Getter */
    if ( commands == null )
      return this._commands;
    
    /** Setter */
    this._commands = commands;

    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Add command.
   * @param user Desired command to add
   * @return The world for set call chaining
   */
  addCommand(command) {    
    /** Push command onto list */
    this.commands().push(command);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Find command by name.
   * @param Desired command's name
   * @return Desired command
   */
  findCommandByName(name) {
    return this.commands().find((command) => {
      return command.name() == name;
    });
  }
  
  /**
   * Remove command.
   * @param Desired command to remove
   */
  removeCommand(command) {
    /** Splice user from list */
    this.commands().splice(this.commands().indexOf(command));
  }
  
  /**
   * Add user.
   * @param user Desired user to add
   * @return The world for set call chaining
   */
  addUser(user) {
    /** Push user onto list */
    this.users().push(user);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Find user by socket.
   * @param Desired user's socket
   * @return Desired user
   */
  findUserBySocket(socket) {
    return this.users().find((user) => {
      return user.socket().id == socket.id;
    });
  }
  
  /**
   * Find user by name.
   * @param Desired user's name
   * @return Desired user
   */
  findUserByName(name) {
    return this.users().find((user) => {
      return user.name() == name;
    });
  }
  
  /**
   * Remove user.
   * @param Desired user to remove
   */
  removeUser(user) {
    /** Splice user from list */
    this.users().splice(this.users().indexOf(user));
  }
  
  /** 
   * Load user by name handler getter/setter.
   * @param (optional) loadUserByName Desired load user by name handler
   * @return The world for set call chaining
   */
  loadUserByName(loadUserByName = null) {
    /** Getter */
    if ( loadUserByName == null )
      return this._loadUserByName;

    /** Setter */
    this._loadUserByName = loadUserByName;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Save user handler getter/setter.
   * @param (optional) saveUser Desired save user handler
   * @return The world for set call chaining
   */
  saveUser(saveUser = null) {
    /** Getter */
    if ( saveUser == null )
      return this._saveUser;

    /** Setter */
    this._saveUser = saveUser;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Load areas handler getter/setter.
   * @param (optional) loadAreas Desired load areas handler
   * @return The world for set call chaining
   */
  loadAreas(loadAreas = null) {
    /** Getter */
    if ( loadAreas == null )
      return this._loadAreas;

    /** Setter */
    this._loadAreas = loadAreas;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Save area handler getter/setter.
   * @param (optional) saveArea Desired save area handler
   * @return The world for set call chaining
   */
  saveArea(saveArea = null) {
    /** Getter */
    if ( saveArea == null )
      return this._saveArea;

    /** Setter */
    this._saveArea = saveArea;

    /** Allow for set call chaining */
    return this;
  }
}

exports.World = World;