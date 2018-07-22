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
    { name: `log`, instanceOf: `Object` },
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
      
      /** Add room to world */
      this.rooms().push(area.rooms()[i]);
      
      /** Loop through item instances in room */
      area.rooms()[i].items().forEach((item) => {
        /** Set room of item */
        item.room(area.rooms()[i]);
        
        /** Set prototype of item */
        item.prototype(area.rooms()[i].itemPrototypes().find(x => x.id() == item.prototype().id()));
        
        /** Recursively add any item contents to world and set container of each */
        recursiveItemContents(item);
      });
      
      /** Loop through mobile instances in room */
      area.rooms()[i].mobiles().forEach((mobile) => {
        /** Set room of mobile */
        mobile.room(area.rooms()[i]);
        
        /** Set prototype of mobile */
        mobile.prototype(area.rooms()[i].mobilePrototypes().find(x => x.id() == mobile.prototype().id()));
      });
      
      /** Loop through exits in room */
      area.rooms()[i].exits().forEach((exit) => {
        /** Set room of exit */
        exit.room(area.rooms()[i]);
      });    
    }
  }
  
  /** Connect exits */
  this.areas().forEach((area) => {
    area.rooms().forEach((room) => {
      room.exits().forEach((exit) => {
        exit.target(this.rooms().find(x => x.id() == exit.target().id()));
      });
    });
  });
};

World.prototype.characterFromAnywhere = function (character) {  
  /** If character's room exists */
  if ( character.room() ) {
    /** If character is a User, remove from room's and area's users lists */
    if ( character instanceof this.User && character.room().users().indexOf(character) !== -1 )
      character.room().users().splice(character.room().users().indexOf(character), 1);

    /** If character is a MobileInstance, remove from room's and area's mobiles lists */
    else if ( character instanceof this.MobileInstance && character.room().mobiles().indexOf(character) !== -1 )
      character.room().mobiles().splice(character.room().mobiles().indexOf(character), 1);
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
  if ( character instanceof this.User )
    room.users().push(character);
  
  /** If character is a MobileInstance, add to room's and area's mobiles lists */
  else if ( character instanceof this.MobileInstance )
    room.mobiles().push(character);
};

World.prototype.itemFromAnywhere = async function (item) {
  /** If item's room exists */
  if ( item.room() ) {
    /** Remove item from item room's and area's items lists */
    if ( item.room().items().indexOf(item) !== -1 )
      item.room().items().splice(item.room().items().indexOf(item), 1);

    /** Save room */
    await item.room().update(this.database());
    
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
    
    /** Save character */
    await item.character().update(this.database());
    
    /** Null out item's character */
    item.character(null);
  }
  
  /** If item's container exists */
  if ( item.container() ) {
    /** Remove item from container's contents list */
    if ( item.container().contents().indexOf(item) !== -1 )
      item.container().contents().splice(item.container().contents().indexOf(item), 1);
    
    /** Save container */
    await item.container().update(this.database());
    
    /** Null out item's container */
    item.container(null);
  }
}

World.prototype.itemToRoom = async function (item, room) {
  /** Remove item from any old location */
  await this.itemFromAnywhere(item);
  
  /** Set item's room */
  item.room(room);
  
  /** Add item to room's items list */
  room.items().push(item);
  
  /** Save room */
  await room.update(this.database());
};

World.prototype.itemToInventory = async function (item, character) {
  /** Remove item from any old location */
  await this.itemFromAnywhere(item);
  
  /** Set item's character */
  item.character(character);
  
  /** Add item to character's inventory list */
  character.inventory().push(item);
  
  /** Save character */
  await character.update(this.database());
};

World.prototype.itemToEquipment = async function (item, character) {
  /** Remove item from any old location */
  await this.itemFromAnywhere(item);
  
  /** Set item's character */
  item.character(character);
  
  /** Add item to character's equipment list */
  character.equipment().push(item);
  
  /** Save character */
  await character.update(this.database());
};

World.prototype.itemToContainer = async function (item, container) {
  /** Remove item from any old location */
  await this.itemFromAnywhere(item);
  
  /** Set item's container */
  item.container(container);
  
  /** Add item to container's contents list */
  container.contents().push(item);
  
  /** Save container */
  await container.update(this.database());
};

World.prototype.parseDepth = (user, args, num) => {
  let depth = 0;

  if ( typeof args[num] == `string` ) {
    depth = parseInt(args[num]);

    if ( `infinity`.startsWith(args[num].toLowerCase()) ) {
      depth = Infinity;
    } else if ( isNaN(depth) || depth < 0 ) {
      user.send(`That is not an allowed inspection depth, only numbers >= 0 or infinity are allowed.\r\n`);
      return -1;
    }
  }
  
  return depth;
};

World.prototype.parseName = (user, args, num) => {
  const matches = args[num].match(/^([0-9]+)\.(.+)$/);
  let name = args[num];
  let count = 1;

  if ( matches && matches.length == 3 ) {
    name = matches[2];
    count = parseInt(matches[1]);
  }
  
  return [name, count];
};

World.prototype.terminalWrap = (text) => {
  const words = text.split(` `);
  
  return words.reduce((accumulator, val) => {
    if ( accumulator.length > 0 && val.length + accumulator[accumulator.length - 1].length + 1 <= 80 )
      accumulator[accumulator.length - 1] += ` ${val}`;
    else
      accumulator.push(val);
    
    return accumulator;
  }, []).join(`\r\n`);
};

World.prototype.colorize = (text) => {
  text = text.replace(/\#\#/g, `@&#$!*;`);
  text = text.replace(/\%\%/g, `*!$#&@;`);
  
  text = text.replace(/\#k/g, `\u001b[30m`);
  text = text.replace(/\#r/g, `\u001b[31m`);
  text = text.replace(/\#g/g, `\u001b[32m`);
  text = text.replace(/\#y/g, `\u001b[33m`);
  text = text.replace(/\#b/g, `\u001b[34m`);
  text = text.replace(/\#p/g, `\u001b[35m`);
  text = text.replace(/\#c/g, `\u001b[36m`);
  text = text.replace(/\#w/g, `\u001b[37m`);

  text = text.replace(/\#K/g, `\u001b[30;1m`);
  text = text.replace(/\#R/g, `\u001b[31;1m`);
  text = text.replace(/\#G/g, `\u001b[32;1m`);
  text = text.replace(/\#Y/g, `\u001b[33;1m`);
  text = text.replace(/\#B/g, `\u001b[34;1m`);
  text = text.replace(/\#P/g, `\u001b[35;1m`);
  text = text.replace(/\#C/g, `\u001b[36;1m`);
  text = text.replace(/\#W/g, `\u001b[37;1m`);
  text = text.replace(/\#g/g, `\u001b[32;1m`);
  
  text = text.replace(/\%k/g, `\u001b[40m`);
  text = text.replace(/\%r/g, `\u001b[41m`);
  text = text.replace(/\%g/g, `\u001b[42m`);
  text = text.replace(/\%y/g, `\u001b[43m`);
  text = text.replace(/\%b/g, `\u001b[44m`);
  text = text.replace(/\%p/g, `\u001b[45m`);
  text = text.replace(/\%c/g, `\u001b[46m`);
  text = text.replace(/\%w/g, `\u001b[47m`);

  text = text.replace(/\%K/g, `\u001b[40;1m`);
  text = text.replace(/\%R/g, `\u001b[41;1m`);
  text = text.replace(/\%G/g, `\u001b[42;1m`);
  text = text.replace(/\%Y/g, `\u001b[43;1m`);
  text = text.replace(/\%B/g, `\u001b[44;1m`);
  text = text.replace(/\%P/g, `\u001b[45;1m`);
  text = text.replace(/\%C/g, `\u001b[46;1m`);
  text = text.replace(/\%W/g, `\u001b[47;1m`);
  text = text.replace(/\%g/g, `\u001b[42;1m`);

  text = text.replace(/\#n/g, `\u001b[0m`);
  text = text.replace(/\%n/g, `\u001b[0m`);
  
  text = text.replace(/\@\&\#\$\!\*\;/g, `#`);
  text = text.replace(/\*\!\$\#\&\@\;/g, `%`);
  
  return `${text}\u001b[0m`;
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
  User.prototype.prompt = function (world) {
    const healthRatio = this.health() / this.maxHealth();
    const manaRatio = this.mana() / this.maxMana();
    const energyRatio = this.energy() / this.maxEnergy();
    
    let health;
    
    if ( healthRatio < 0.2 )
      health = `#R${this.health()}#n`;
    else if ( healthRatio < 0.4 )
      health = `#P${this.health()}#n`;
    else if ( healthRatio < 0.6 )
      health = `#B${this.health()}#n`;
    else if ( healthRatio < 0.8 )
      health = `#Y${this.health()}#n`;
    else if ( healthRatio < 1 )
      health = `#G${this.health()}#n`;
    else
      health = `#C${this.health()}#n`;
    
    let mana;
    
    if ( manaRatio < 0.2 )
      mana = `#R${this.mana()}#n`;
    else if ( manaRatio < 0.4 )
      mana = `#P${this.mana()}#n`;
    else if ( manaRatio < 0.6 )
      mana = `#B${this.mana()}#n`;
    else if ( manaRatio < 0.8 )
      mana = `#Y${this.mana()}#n`;
    else if ( manaRatio < 1 )
      mana = `#G${this.mana()}#n`;
    else
      mana = `#C${this.mana()}#n`;
    
    let energy;
    
    if ( energyRatio < 0.2 )
      energy = `#R${this.energy()}#n`;
    else if ( energyRatio < 0.4 )
      energy = `#P${this.energy()}#n`;
    else if ( energyRatio < 0.6 )
      energy = `#B${this.energy()}#n`;
    else if ( energyRatio < 0.8 )
      energy = `#Y${this.energy()}#n`;
    else if ( energyRatio < 1 )
      energy = `#G${this.energy()}#n`;
    else
      energy = `#C${this.energy()}#n`;

    let prompt = this.promptFormat();
    
    prompt = prompt.replace(/\$xp/g, `#c${this.experience()}#n`);
    prompt = prompt.replace(/\$hp/g, health);
    prompt = prompt.replace(/\$m/g, mana);
    prompt = prompt.replace(/\$e/g, energy);
    
    this.send(world.colorize(prompt));
  };
  
  /** Create send function */
  User.prototype.send = function (text) {
    if ( this.state() != constants.STATE_DISCONNECTED && this.socket() )
      this.socket().write(text);
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
