/** Require external modules */
const crypto = require(`crypto`);
const ezobjects = require(`ezobjects-mysql`);
const net = require(`net`);
const winston = require(`winston`);

/** Require local modules */
const admin = require(`./admin`);
const areas = require(`./areas`);
const building = require(`./building`);
const characters = require(`./characters`);
const commands = require(`./commands`);
const constants = require(`./constants`);
const exits = require(`./exits`);
const fighting = require(`./fighting`);
const info = require(`./info`);
const input = require(`./input`);
const interaction = require(`./interaction`);
const itemInstances = require(`./item-instances`);
const items = require(`./items`);
const mobileInstances = require(`./mobile-instances`);
const mobiles = require(`./mobiles`);
const movement = require(`./movement`);
const rooms = require(`./rooms`);
const senses = require(`./senses`);
const system = require(`./system`);
const users = require(`./users`);

/** Configure world object */
const configWorld = {
  className: `World`,
  properties: [
    { name: `areas`, type: `Array`, arrayOf: { instanceOf: `Area` } },
    { name: `commands`, type: `Array`, arrayOf: { instanceOf: `Command` } },
    { name: `constants`, type: `Object`, default: constants },
    { name: `database`, type: `MySQLConnection` },
    { name: `itemPrototypes`, type: `Array`, arrayOf: { type: `Item` } },
    { name: `items`, type: `Array`, arrayOf: { type: `ItemInstance` } },
    { name: `log`, instanceOf: `Object` },
    { name: `mobilePrototypes`, type: `Array`, arrayOf: { type: `Mobile` } },
    { name: `mobiles`, type: `Array`, arrayOf: { type: `MobileInstance` } },
    { name: `motd`, type: `text`, default: constants.DEFAULT_MOTD },
    { name: `mysqlConfig`, type: `Object` },
    { name: `port`, type: `int`, default: 7000 },
    { name: `rooms`, type: `Array`, arrayOf: { type: `Room` } },
    { name: `users`, type: `Array`, arrayOf: { type: `User` } },
    { name: `welcome`, type: `text`, default: constants.DEFAULT_WELCOME }
  ]
};

/** Create world object */
ezobjects.createClass(configWorld);

/**
 * @signature world.loadAreas()
 * @description Load all areas in the database.
 */
World.prototype.loadAreas = async function () {
  /** Define recursive helper function for adding any item contents to world and setting container of each */
  const recursiveItemContents = (item) => {
    item.contents().forEach((content) => {
      content.container(item);
      
      this.items().push(content);
      
      recursiveItemContents(content);
    });
  };
  
  /** Load areas */
  const areaList = await this.database().query(`SELECT * FROM areas`);
  
  for ( let i = 0, i_max = areaList.length; i < i_max; i++ ) {
    /** Load area from database */
    const area = await new this.Area().load(areaList[i], this.database());
    
    /** Add area to world */
    this.areas().push(area);
  
    /** Loop through area rooms */
    for ( let i = 0, i_max = area.rooms().length; i < i_max; i++ ) {
      /** Set area of room */
      area.rooms()[i].area(area);
      
      /** Loop through item instances in room */
      area.rooms()[i].items().forEach((item) => {
        /** Set room of item */
        item.room(area.rooms()[i]);
        
        /** Add item to area */
        area.items().push(item);
        
        /** Add item to world */
        this.items().push(item);
        
        /** Recursively add any item contents to world and set container of each */
        recursiveItemContents(item);
      });
      
      /** Loop through mobile instances in room */
      area.rooms()[i].mobiles().forEach((mobile) => {
        /** Set room of mobile */
        mobile.room(area.rooms()[i]);
        
        /** Add mobile to area */
        area.mobiles().push(mobile);
        
        /** Add mobile to world */
        this.mobiles().push(mobile);
      });
      
      /** Loop through exits in room */
      area.rooms()[i].exits().forEach((exit) => {
        /** Set room of exit */
        exit.room(area.rooms()[i]);
      });
      
      /** Loop through mobile prototypes in room and add to world */
      for ( let i = 0, i_max = area.rooms()[i].mobilePrototypes().length; i < i_max; i++ )
        this.mobilePrototypes().push(area.rooms()[i].mobilePrototypes()[i]);

      /** Loop through item prototypes in room and add to world */ 
      for ( let i = 0, i_max = area.rooms()[i].itemPrototypes().length; i < i_max; i++ )
        this.itemPrototypes().push(area.rooms()[i].itemPrototypes()[i]);
      
      this.rooms().push(area.rooms()[i]);
    }
    
    /** Loop through mobile prototypes in area and add to world */
    for ( let i = 0, i_max = area.mobilePrototypes().length; i < i_max; i++ )
      this.mobilePrototypes().push(area.mobilePrototypes()[i]);

    /** Loop through item prototypes in area and add to world */ 
    for ( let i = 0, i_max = area.itemPrototypes().length; i < i_max; i++ )
      this.itemPrototypes().push(area.itemPrototypes()[i]);
  }
  
  /** Connect exits */
  this.areas().forEach((area) => {
    area.rooms().forEach((room) => {
      room.exits().forEach((exit) => {
        exit.target(this.rooms().find(x => x.id() == exit.target().id()));
      });
    });
  });
  
  /** Set mobile instance rooms and prototypes */
  this.mobiles().forEach((mobile) => {
    mobile.room(this.rooms().find(x => x.id() == mobile.room().id()));
    mobile.prototype(this.mobilePrototypes().find(x => x.id() == mobile.prototype().id()));
  });
  
  /** Set item instance rooms */
  this.items().forEach((item) => {
    item.room(this.rooms().find(x => x.id() == item.room().id()));
    item.prototype(this.itemPrototypes().find(x => x.id() == item.prototype().id()));
  });
};

World.prototype.characterFromAnywhere = function (character) {  
  /** If character's room exists */
  if ( character.room() ) {
    /** If character is a User, remove from room's and area's users lists */
    if ( character instanceof this.User ) {
      character.room().users().splice(character.room().users().indexOf(character), 1);
      
      if ( character.room().area() )
        character.room().area().users().splice(character.room().area().users().indexOf(character), 1);
    } 
    
    /** If character is a MobileInstance, remove from room's and area's mobiles lists */
    else if ( character instanceof this.MobileInstance ) {
      character.room().mobiles().splice(character.room().mobiles().indexOf(character), 1);
      
      if ( character.room().area() )
        character.room().area().mobiles().splice(character.room().area().mobiles().indexOf(character), 1);
    }
  }
  
  /** Null out character's room */
  character.room(null);
};

World.prototype.characterToRoom = function (character, room) {
  /** Remove character from any old room */
  this.characterFromAnywhere(character);
  
  /** Set chracter's room */
  character.room(room);

  /** If character is a User, add to room's and area's users lists */
  if ( character instanceof this.User ) {
    room.users().push(character);
    room.area().users().push(character);
  } 
  
  /** If character is a MobileInstance, add to room's and area's mobiles lists */
  else if ( character instanceof this.MobileInstance ) {
    room.mobiles().push(character);
    room.area().mobiles().push(character);
  }
};

World.prototype.itemFromAnywhere = function (item) {
  /** If item's room exists */
  if ( item.room() ) {
    /** Remove item from item room's and area's items lists */
    item.room().items().splice(item.room().items().indexOf(item), 1);
    item.room().area().items().splice(item.room().area().items().indexOf(item), 1);
    
    /** Null out item's room */
    item.room(null);
  }
  
  /** If item's character exists */
  if ( item.character() ) {
    /** If item is in the inventory, remove it from the inventory list */
    if ( item.character().inventory().indexOf(item) !== -1 )
      item.character().inventory().splice(item.character().inventory().indexOf(item), 1);
    
    /** If item is part of the equipment, remove it from the equipment list */
    if ( item.character().equipment().indexOf(item) !== -1 )
      item.character().equipment().splice(item.character().equipment().indexOf(item), 1);
    
    /** Null out item's character */
    item.character(null);
  }
  
  /** If item's container exists */
  if ( item.container() ) {
    /** Remove item from container's contents list */
    item.container().contents().splice(item.container().contents().indexOf(item), 1);
    
    /** Null out item's container */
    item.container(null);
  }
}

World.prototype.itemToRoom = function (item, room) {
  /** Remove item from any old location */
  this.itemFromAnywhere(item);
  
  /** Set item's room */
  item.room(item);
  
  /** Add item to room's items list */
  room.items().push(item);
};

World.prototype.itemToInventory = function (item, character) {
  /** Remove item from any old location */
  this.itemFromAnywhere(item);
  
  /** Set item's character */
  item.character(item);
  
  /** Add item to character's inventory list */
  character.inventory().push(item);
};

World.prototype.itemToEquipment = function (item, character) {
  /** Remove item from any old location */
  this.itemFromAnywhere(item);
  
  /** Set item's character */
  item.character(item);
  
  /** Add item to character's equipment list */
  character.equipment().push(item);
};

World.prototype.itemToContainer = function (item, container) {
  /** Remove item from any old location */
  this.itemFromAnywhere(item);
  
  /** Set item's container */
  item.container(container);
  
  /** Add item to container's contents list */
  container.contents().push(item);
};

/**
 * @signature world.listen()
 * @description Start the server listening on the configured port!
 */
World.prototype.listen = async function () {
  /** Create custom winston logger */
  this.log(new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: `silly`,
        timestamp: true,
        prettyPrint: true
      }),
      new winston.transports.File({
        name: `info-file`,
        filename: `logs/info.log`,
        level: `info`,
        levelOnly: true,
        json: false,
        timestamp: true,
        prettyPrint: true
      }),
      new winston.transports.File({
        name: `error-file`,
        filename: `logs/error.log`,
        level: `warn`,
        json: false,
        timestamp: true,
        prettyPrint: true
      })
    ]
  }));
  
  /** Instantiate pooled MySQL DB connection */
  this.database(new ezobjects.MySQLConnection(this.mysqlConfig()));
  
  /** Configure the objects */
  const configArea = areas.configArea(this);
  const configCharacter = characters.configCharacter(this);
  const configCommand = commands.configCommand(this);
  const configExit = exits.configExit(this);
  const configItem = items.configItem(this);
  const configRoom = rooms.configRoom(this);

  await ezobjects.createTable(configArea, this.database());
  await ezobjects.createTable(configExit, this.database());
  await ezobjects.createTable(configItem, this.database());
  await ezobjects.createTable(configRoom, this.database());
  
  /** Create objects */
  ezobjects.createClass(configArea);
  ezobjects.createClass(configCharacter);
  ezobjects.createClass(configCommand);
  ezobjects.createClass(configExit);
  ezobjects.createClass(configItem);
  ezobjects.createClass(configRoom);
  
  const configItemInstance = itemInstances.configItemInstance(this, Item, configItem);
  const configMobile = mobiles.configMobile(this, Character, configCharacter);
  const configMobileInstance = mobileInstances.configMobileInstance(this, Character, configCharacter);
  const configUser = users.configUser(this, Character, configCharacter);

  await ezobjects.createTable(configItemInstance, this.database());
  await ezobjects.createTable(configMobile, this.database());
  await ezobjects.createTable(configMobileInstance, this.database());
  await ezobjects.createTable(configUser, this.database());
  
  ezobjects.createClass(configItemInstance);
  ezobjects.createClass(configMobile);
  ezobjects.createClass(configMobileInstance);
  ezobjects.createClass(configUser);

  /** Create prompt function */
  User.prototype.prompt = function () {
    this.send(this.promptFormat());
  };
  
  /** Create send function */
  User.prototype.send = function (buffer) {
    if ( this.state() != constants.STATE_DISCONNECTED && this.socket() )
      this.socket().write(buffer);
  };
  
  this.Area = Area;
  this.Character = Character;
  this.Command = Command;
  this.Exit = Exit;
  this.Item = Item;
  this.ItemInstance = ItemInstance;
  this.Mobile = Mobile;
  this.MobileInstance = MobileInstance;
  this.Room = Room;
  this.User = User;
  
  /** Load the areas from database */
  await this.loadAreas();
  
  /** Load commands */
  this.commands(this.commands().concat(admin.createCommands(this)));
  this.commands(this.commands().concat(building.createCommands(this)));
  this.commands(this.commands().concat(fighting.createCommands(this)));
  this.commands(this.commands().concat(info.createCommands(this)));
  this.commands(this.commands().concat(interaction.createCommands(this)));
  this.commands(this.commands().concat(movement.createCommands(this)));
  this.commands(this.commands().concat(senses.createCommands(this)));
  this.commands(this.commands().concat(system.createCommands(this)));
  
  /** Create server -- net.createServer argument is the new connection handler */
  const server = net.createServer((socket) => {
    this.log().info(`New socket from ${socket.address().address}.`);

    /** Create a new user */
    const user = new this.User({
      socket: socket
    });
    
    socket.lastAddress = socket.address().address;
    
    /** Add user to active users list */
    this.users().push(user);

    /** Log user disconnects */
    socket.on(`end`, () => {
      /** Look up the socket`s user, if one exists */
      const user = this.users().find(x => x.socket() == socket);

      /** If user exists, disconnect them */
      if ( user ) {
        this.log().info(`User ${user.name()} disconnected.`);

        /** Zero the user's socket and update their state to disconnected, but leave them in game */
        user.socket(null);
        user.state(constants.STATE_DISCONNECTED);
      } 
      
      /** Otherwise just log disconnected socket */
      else {
        this.log().info(`Socket ${socket.lastAddress} disconnected.`);
      }
    });

    /** Data received from user */
    socket.on(`data`, (buffer) => {    
      /** Pass input to the input processor */
      input.process(this, user, buffer.toString().trim());
    });

    /** Display welcome message */
    user.socket().write(this.welcome());
  });

  /** Re-throw errors for now */
  server.on(`error`, (error) => {
    this.log().error(error);
  });

  /** Time to get started */
  server.listen(this.port(), () => {
    this.log().info(`Muddy is up and running on port ${this.port()}!`);
  });
};

/** Export object */
exports.World = World;
