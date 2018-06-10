/** Require external modules */
const crypto = require(`crypto`);
const ezobjects = require(`ezobjects`);
const net = require(`net`);
const winston = require(`winston`);

/** Require local modules */
const admin = require(`./admin`);
const areas = require(`./areas`);
const builder = require(`./builder`);
const characters = require(`./characters`);
const commands = require(`./commands`);
const constants = require(`./constants`);
const deployments = require(`./deployments`);
const exits = require(`./exits`);
const fighting = require(`./fighting`);
const info = require(`./info`);
const input = require(`./input`);
const interaction = require(`./interaction`);
const items = require(`./items`);
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
    { name: `areas`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Area`) ? x : null) },
    { name: `characters`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Character`) ? x : null) },
    { name: `commands`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Command`) ? x : null) },
    { name: `constants`, type: `Object`, default: constants },
    { name: `database`, type: `MySQLConnection` },
    { name: `itemPrototypes`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? x : null) },
    { name: `items`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? x : null) },
    { name: `log`, instanceOf: `Object` },
    { name: `mobilePrototypes`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Mobile`) ? x : null) },
    { name: `mobiles`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Mobile`) ? x : null) },
    { name: `motd`, type: `string`, default: constants.DEFAULT_MOTD },
    { name: `mysqlConfig`, type: `Object` },
    { name: `port`, type: `number`, default: 7000, setTransform: x => parseInt(x) },
    { name: `rooms`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Room`) ? x : null) },
    { name: `users`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `User`) ? x : null) },
    { name: `welcome`, type: `string`, default: constants.DEFAULT_WELCOME }
  ]
};

/** Create world object */
ezobjects.createObject(configWorld);

/**
 * @signature world.loadAreas()
 * @description Load all areas in the database.
 */
World.prototype.loadAreas = async function () {
  /** Load areas */
  const areaList = await this.database().query(`SELECT * FROM areas`);
  
  areaList.forEach((row) => {
    this.areas().push(new this.Area(row));
  });
  
  /** Load items */
  const itemList = await this.database().query(`SELECT * FROM items`);

  itemList.forEach((row) => {
    this.itemPrototypes().push(new this.Item(row));
  });
  
  /** Load mobiles */
  const mobileList = await this.database().query(`SELECT * FROM mobiles`);

  mobileList.forEach((row) => {
    this.mobilePrototypes().push(new this.Mobile(row));
  });
  
  /** Load rooms */
  const roomList = await this.database().query(`SELECT * FROM rooms`);

  roomList.forEach((row) => {
    this.rooms().push(new this.Room(row));
  });
  
  /** Load exits */
  const exitList = await this.database().query(`SELECT * FROM exits`);

  exitList.forEach((row) => {
    this.exits().push(new this.Exit(row));
  });
};

/**
 * @signature world.setStage()
 * @description Deploy the initial items and mobiles into the world.
 */
World.prototype.setStage = function () {
};

World.prototype.characterToRoom = function (character, room) {
  if ( character.room() )
    character.room().characters().splice(user.room().characters().indexOf(character), 1);
  
  if ( ezobjects.instanceOf(character, 'User') )
    character.lastRoom(room.id());
  
  character.room(room);
  room.characters().push(character);
};

World.prototype.itemToRoom = function (item, room) {
  if ( item.room() )
    item.room().items().splice(item.room().items().indexOf(item), 1);
  
  item.room(item);
  room.items().push(item);
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
  const configDeployment = deployments.configDeployment(this);
  const configItem = items.configItem(this);
  const configRoom = rooms.configRoom(this);

  await ezobjects.createTable(this.database(), configArea);
  await ezobjects.createTable(this.database(), configExit);
  await ezobjects.createTable(this.database(), configDeployment);
  await ezobjects.createTable(this.database(), configItem);
  await ezobjects.createTable(this.database(), configRoom);
  
  /** Create objects */
  ezobjects.createObject(configArea);
  ezobjects.createObject(configCharacter);
  ezobjects.createObject(configCommand);
  ezobjects.createObject(configExit);
  ezobjects.createObject(configDeployment);
  ezobjects.createObject(configItem);
  ezobjects.createObject(configRoom);
  
  /** Create prompt function */
  Character.prototype.prompt = function () {
    this.send(`\r\n[${this.experience()}xp] <${this.health()}hp ${this.mana()}m ${this.energy()}e> `);
  };
  
  const configMobile = mobiles.configMobile(this, Character, configCharacter);
  const configUser = users.configUser(this, Character, configCharacter);

  await ezobjects.createTable(this.database(), configMobile);
  await ezobjects.createTable(this.database(), configUser);
  
  ezobjects.createObject(configMobile);
  ezobjects.createObject(configUser);

  /** Create send function */
  User.prototype.send = function (buffer) {
    if ( this.state() != constants.STATE_DISCONNECTED && this.socket() )
      this.socket().write(buffer);
  };
  
  this.Area = Area;
  this.Character = Character;
  this.Command = Command;
  this.Exit = Exit;
  this.Deployment = Deployment;
  this.Item = Item;
  this.Mobile = Mobile;
  this.Room = Room;
  this.User = User;
  
  /** Load the areas from database */
  await this.loadAreas();
  
  /** Load commands */
  this.commands(this.commands().concat(admin.createCommands(this)));
  this.commands(this.commands().concat(builder.createCommands(this)));
  this.commands(this.commands().concat(fighting.createCommands(this)));
  this.commands(this.commands().concat(info.createCommands(this)));
  this.commands(this.commands().concat(interaction.createCommands(this)));
  this.commands(this.commands().concat(movement.createCommands(this)));
  this.commands(this.commands().concat(senses.createCommands(this)));
  this.commands(this.commands().concat(system.createCommands(this)));
  
  
  /** Set the stage */
  this.setStage();
  
  /** Create server -- net.createServer argument is the new connection handler */
  const server = net.createServer((socket) => {
    this.log().info(`New socket from ${socket.address().address}.`);

    /** Create a new user */
    const user = new this.User({
      lastAddress: socket.address().address,
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

/** Export config */
exports.configWorld = configWorld;

/** Export object */
exports.World = World;
