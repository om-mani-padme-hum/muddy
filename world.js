'use strict';

/** External modules */
const net = require('net');
const crypto = require('crypto');

/** Muddy modules */
const input = require('./input');
const users = require('./users');
const areas = require('./areas');
const rooms = require('./rooms');
const objects = require('./objects');
const mobiles = require('./mobiles');
const exits = require('./exits');
const commands = require('./commands');

/**
 * Data model and helper class for a Muddy world.
 */
class World {
  /**
   * Instantiate a new world.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
    /** Define user state flags */
    this.STATE_NAME = 0;
    this.STATE_OLD_PASSWORD = 1;
    this.STATE_NEW_PASSWORD = 2;
    this.STATE_CONFIRM_PASSWORD = 3;
    this.STATE_MOTD = 4;
    this.STATE_CONNECTED = 5;
    this.STATE_DISCONNECTED = 6;
    
    /** Define VT100 terminal modifiers */
    this.VT100_CLEAR = '\x1b[0m';
    this.VT100_HIDE_TEXT = '\x1b[8m';
    
    /** Define object flags */
    this.OBJECT_WEARABLE = 1;
    this.OBJECT_WIELDABLE_1H = 2;
    this.OBJECT_WIELDABLE_2H = 3;
    this.OBJECT_CONTAINER = 4;
    
    /** Define direction flags */
    this.DIR_NORTH = 1;                    /**< n */
    this.DIR_NORTHEAST = 2;                /**< ne */
    this.DIR_EAST = 3;                     /**< e */
    this.DIR_SOUTHEAST = 4;                /**< se */
    this.DIR_SOUTH = 5;                    /**< s */
    this.DIR_SOUTHWEST = 6;                /**< sw */
    this.DIR_WEST = 7;                     /**< w */
    this.DIR_NORTHWEST = 8;                /**< nw */
    this.DIR_UP = 9;                       /**< u */
    this.DIR_DOWN = 10;                    /**< d */
    
    this.init(data);
  }

  /**
   * Initialize the world to provided data or defaults.
   * @param data (optional) Configuration object
   * @todo Remove users and objects from this class and put them under areas
   */
  init(data = {}) {
    /** Set the default Muddy pot */
    const defaultPort = 9000;
    
    /** Set the default welcome message */
    const defaultWelcome = ['\r\n',
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
    
    /** Set the default message of the day */
    const defaultMotd = ['--------------------------------------------------------------------------------\r\n',
                        'Message of the day:\r\n',
                        '\r\n',
                        'New features:\r\n',
                        '  * Three default rooms to test movement\r\n',
                        '  * All directions implemented\r\n',
                        '  * Ability to look at rooms and see exits\r\n',
                        '  * Saving of users, new and existing\r\n',
                        '\r\n',
                        '--------------------------------------------------------------------------------\r\n',
                        'Press ENTER to continue...\r\n',
                        '--------------------------------------------------------------------------------\r\n'].join('');

    /** Set the default loadAreas() handler with two explicitly defined rooms in one area */
    const defaultLoadAreas = () => {
      /** Create new area */
      const area = new areas.Area(this, {
        id: 1,
        name: 'Stuck in the mud',
        flags: 0,
      });
      
      const object = new objects.Object(this, {
        id: 1,
        name: 'a muddy stick',
        description: `It's a stick covered in mud.`,
        flags: [2]
      });
      
      area.objects().push(object);
      
      const mobile = new mobiles.Mobile(this, {
        id: 1,
        name: 'a mud monster',
        description: `Well, it looks like mud, but it's alive, what would you call it?`
      });
      
      area.mobiles().push(mobile);
      
      let room = new rooms.Room(this, {
        id: 1,
        area: area,
        name: 'Stuck in the mud',
        description: [`There seems to be lots to explore 'out there', but you can't do much of\r\n`,
                      `anything as you're stuck in the mud.  Might want to pray the immortals\r\n`,
                      `help you find a way out and back into a worthy world.`].join(''),
        exits: [
          new exits.Exit(this, {
            dir: this.DIR_NORTH,
            to: 2
          }),
          new exits.Exit(this, {
            dir: this.DIR_DOWN,
            to: 3
          })
        ],
        objects: [object]
      });
      
      area.rooms().push(room);
      
      room = new rooms.Room(this, {
        id: 2,
        area: area,
        name: 'Stuck in the mud',
        description: [`There seems to be lots to explore 'out there', but you can't do much of\r\n`,
                      `anything as you're stuck in the mud.  Might want to pray the immortals\r\n`,
                      `help you find a way out and back into a worthy world.`].join(''),
        exits: [
          new exits.Exit(this, {
            dir: this.DIR_SOUTH,
            to: 1
          })
        ],
        mobiles: [mobile]
      });
      
      area.rooms().push(room);
      
      room = new rooms.Room(this, {
        id: 3,
        area: area,
        name: 'Drowning in the mud',
        description: [`There's *gurgle*, not much of interest *gurgle*, down here!`],
        exits: [
          new exits.Exit(this, {
            dir: this.DIR_UP,
            to: 1
          })
        ]
      });
      
      area.rooms().push(room);
      
      this.areas().push(area);
    };
    
    /** Set the default loadUserByName() handler which just loads an empty user and is expected to be replaced */
    const defaultLoadUserByName = (name, next) => { 
      next(new users.User(this));
    };
    
    /** Create template for all direction commands */
    const dirCommand = (dir) => {
      return new commands.Command(this, {
        name: dir,
        command: (user, buffer) => {
          /** Look for an exit in that direction */
          const exit = user.room().exits(dir);

          if ( exit ) {
            /** If it exists, get the room it goes to */
            const room = this.rooms(exit.to());

            if ( room ) {
              /** If room exists, move user to room and look */
              user.room(room);

              /** Find the look command and execute it for this user */
              this.commands('look').execute(user, '');
            } else {
              /** If room doesn't exist, notify imps and send user an error message */
              console.log(`Bad exit: direction ${dir} from room ${user.room().id()}.`);

              user.send('Some kind of force is blocking your way.\r\n');
            }
          } else {
            /** If it doesn't exist, send error message */
            user.send('You cannot go that way.\r\n');
          }
        },
        priority: dir == 'north' || dir == 'south' ? true : false
      });
    };

    /** Set the default commands, which are generally expected to be retained */
    const defaultCommands = [
      new commands.Command(this, {
        name: 'look',
        command: (user, buffer) => {
          /** Send room name */
          user.send(`${user.room().name()}\r\n`);
          
          /** Send exits */
          user.send('[Exits:');
          
          /** Count the exits to see if there are any */
          let count = 0;
          
          /** Loop through exits in user's room */
          user.room().exits().forEach((exit) => {
            /** Separate exit names with spaces */
            user.send(' ');
            
            /** Send exit name based on direction */
            user.send(user.room().exits(exit.dir()));
            
            count++;
          });
          
          /** No exits, output none */
          if ( count == 0 )
            user.send(' None');
          
          user.send(']\r\n');
          
          /** Send room description */
          user.send(`${user.room().description()}\r\n`);
          
          /** Send other users in the room */
          user.room().users().forEach((other) => {
            if ( user != other )
              user.send(`${other.name()} is standing here.\r\n`);
          });
          
          /** Send any mobiles in the room */
          user.room().mobiles().forEach((mobile) => {
            user.send(`  ${mobile.name()} is standing here.\r\n`);
          });
          
          /** Send any objets in the room */
          user.room().objects().forEach((object) => {
            user.send(`    ${object.name()} sits here.\r\n`);
          });
        },
        priority: true
      }),
      new commands.Command(this, {
        name: 'quit',
        command: (user, buffer) => {
          console.log(`User ${user.name()} has quit.`);

          this.users().splice(this.users().indexOf(user), 1);

          user.socket().end('Goodbye!\r\n');
        }
      }),
      new commands.Command(this, {
        name: 'save',
        command: (user, buffer) => {
          this.saveUser()(user);
          
          user.send('Saved.\r\n');
        }
      }),
      dirCommand('north'),
      dirCommand('northeast'),
      dirCommand('ne'),
      dirCommand('east'),
      dirCommand('southeast'),
      dirCommand('se'),
      dirCommand('south'),
      dirCommand('southwest'),
      dirCommand('sw'),
      dirCommand('west'),
      dirCommand('northwest'),
      dirCommand('nw'),
      dirCommand('up'),
      dirCommand('down')
    ];
    
    /** Objects and values */
    this.port(data.port == null ? defaultPort : data.port);
    this.areas(data.areas == null ? [] : data.areas);
    this.rooms(data.rooms == null ? [] : data.rooms);
    this.objects(data.objects == null ? [] : data.objects);
    this.mobiles(data.mobiles == null ? [] : data.mobiles);
    this.users(data.users == null ? [] : data.users);
    this.commands(data.commands == null ? defaultCommands : data.commands);
    this.welcome(data.welcome == null ? defaultWelcome : data.welcome);
    this.motd(data.motd == null ? defaultMotd : data.motd);
    this.start(data.start == null ? 1 : data.start);
    
    /** Handlers */
    this.loadUserByName(data.loadUserByName == null ? defaultLoadUserByName : data.loadUserByName);
    this.saveUser(data.saveUser == null ? (user) => {} : data.saveUser);
    this.loadAreas(data.loadAreas == null ? defaultLoadAreas : data.loadAreas);
    this.saveArea(data.saveArea == null ? (area) => {} : data.saveArea);
  }

  /**
   * Start server and periodic world update.
   */
  listen() {
    /** Create input processor */
    const inputProcessor = new input.InputProcessor(this);

    /** Load areas, note loadAreas() returns a function, thus the ()() */
    this.loadAreas()();
    
    /** Sort commands alphabetically */
    this.commands().sort((cmd1, cmd2) => {
      const name1 = cmd1.name().toUpperCase();
      const name2 = cmd2.name().toUpperCase();
      
      /** If command 2 has priority and command 1 doesn't, prioritize command 2 */
      if ( cmd2.priority() && !cmd1.priority() )
        return 1;
      
      /** If command 1 has priority and command 2 doesn't, prioritize command 1 */
      if ( cmd1.priority() && !cmd2.priority() )
        return -1;
      
      /** If command 1's name comes earlier in the alphabet than command 2's name, prioritize command 1 */
      if ( name1 < name2 )
        return -1;
      
      /** If command 2's name comes earlier in the alphabet than command 1's name, prioritize command 2 */
      if ( name1 > name2 )
        return 1;
      
      /** If they are the same priority, move on */
      return 0;
    });
    
    /** Log loaded commands */
    this.commands().forEach((command) => {
      console.log(`Loaded command ${command.name()}...`);
    });
    
    /** Log loaded areas */
    this.areas().forEach((area) => {
      console.log(`Loaded area ${area.name()}...`);
      
      /** Log loaded rooms */
      area.rooms().forEach((room) => {
        /** Add to the world */
        this.rooms().push(room);
        
        console.log(`Loaded room ${room.name()}...`);
        
        /** Set exit 'from' rooms */
        room.exits().forEach((exit) => {
          exit.from(room);
        });
      });
      
      /** Log loaded objects */
      area.objects().forEach((object) => {
        /** Add to the world */
        this.objects().push(object);
        
        console.log(`Loaded object ${object.name()}...`);
      });
      
      /** Log loaded mobiles */
      area.mobiles().forEach((mobile) => {
        /** Add to the world */
        this.mobiles().push(mobile);
        
        console.log(`Loaded mobile ${mobile.name()}...`);
      });
    });
      
    /** Create server -- net.createServer constructor parameter is new connection handler */
    const server = net.createServer((socket) => {
      console.log(`New socket from ${socket.address().address}.`);

      /** Create a new user */
      const user = new users.User(this, {
        socket: socket
      });

      /** 
       * Assign socket a random ID because apparently sockets aren't unique enough for comparison.
       * @todo Find another way
       */
      socket.id = crypto.randomBytes(32).toString('hex');

      /** Add user to active users list */
      this.users().push(user);

      /** Log user disconnects */
      socket.on('end', () => {
        /** Look up the socket's user, if one exists */
        const user = this.users(socket);

        if ( user ) {
          /** User exists, disconnect them */
          console.log(`User ${user.name()} disconnected.`);
          
          /** Zero the user's socket and update their state to disconnected, but leave them in game */
          user.socket(null);
          user.state(user.STATE_DISCONNECTED);
        } else {
          /** User doesn't exist, just log disconnected socket */
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
    this._port = parseInt(port);

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
    this._welcome = welcome.toString();

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
    this._motd = motd.toString();

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
    
    /** If parameter is null, return array */
    if ( areas == null )
      return this._areas;

    /** If parameter is number, return area by ID */
    if ( typeof areas == 'number' ) {
      return this._areas.find((area) => {
        return area.id() == areas;
      });
    }
    
    /** Setter */
    this._areas = areas;

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
    
    /** If parameter is null, return array */
    if ( rooms == null )
      return this._rooms;
    
    /** If parameter is number, return room by ID */
    if ( typeof rooms == 'number' ) {
      return this._rooms.find((room) => {
        return room.id() == rooms;
      });
    }
    
    /** Setter */
    this._rooms = rooms;

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
    
    /** If parameter is null, return array */
    if ( objects == null )
      return this._objects;
    
    /** If parameter is number, return object by ID */
    if ( typeof objects == 'number' ) {
      return this._objects.find((object) => {
        return object.id() == objects;
      });
    }

    /** Setter */
    this._objects = objects;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Mobiles getter/setter.
   * @param (optional) mobiles Desired mobiles
   * @return The world for set call chaining
   */
  mobiles(mobiles = null) {
    /** Getter */
    
    /** If parameter is null, return array */
    if ( mobiles == null )
      return this._mobiles;
    
    /** If parameter is number, return mobile by ID */
    if ( typeof mobiles == 'number' ) {
      return this._mobiles.find((mobile) => {
        return mobile.id() == mobiles;
      });
    }

    /** Setter */
    this._mobiles = mobiles;

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
    
    /** If parameter is null, return array */
    if ( users == null )
      return this._users;
    
    /** If parameter is number, return user by ID */
    if ( typeof users == 'number' ) {
      return this._users.find((user) => {
        return user.id() == users;
      });
    }
    
    /** If parameter is string, return user by name */
    if ( typeof users == 'string' ) {
      return this._users.find((user) => {
        return user.name().toLowerCase() == users.toLowerCase();
      });
    }

    /** If parameter is instace of net.Socket, return user by socket */
    if ( users instanceof net.Socket ) {
      return this._users.find((user) => {
        return user.socket().id == users.id;
      });
    }
    
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
    
    /** If parameter is null, return array */
    if ( commands == null )
      return this._commands;
    
    /** If parameter is string, return command by name */
    if ( typeof commands == 'string' ) {
      return this._commands.find((command) => {
        return command.name().toLowerCase() == commands.toLowerCase();
      });
    }
    
    /** Setter */
    this._commands = commands;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Start room ID getter/setter.
   * @param (optional) users Desired start room ID
   * @return The world for set call chaining
   */
  start(start = null) {
    /** Getter */
    if ( start == null )
      return this._start;
    
    /** Setter */
    this._start = parseInt(start);

    /** Allow for set call chaining */
    return this;
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