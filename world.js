/** Load external modules */
const crypto = require(`crypto`);
const ezobjects = require(`ezobjects`);
const net = require(`net`);
const winston = require(`winston`);

/** Load local modules */
const areas = require(`./areas`);
const characters = require(`./characters`);
const commands = require(`./commands`);
const constants = require(`./constants`);
const deployments = require(`./deployments`);
const exits = require(`./exits`);
const input = require(`./input`);
const interaction = require(`./interaction`);
const items = require(`./items`);
const mobiles = require(`./mobiles`);
const movement = require(`./movement`);
const rooms = require(`./rooms`);
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
    this.areas().push(new areas.Area().load(row));
  });
  
  /** Load exits */
  const exitList = await this.database().query(`SELECT * FROM exits`);

  exitList.forEach((row) => {
    this.exits().push(new exits.Exit().load(row));
  });
  
  /** Load items */
  const itemList = await this.database().query(`SELECT * FROM items`);

  itemList.forEach((row) => {
    this.itemPrototypes().push(new items.Item().load(row));
  });
  
  /** Load mobiles */
  const mobileList = await this.database().query(`SELECT * FROM mobiles`);

  mobileList.forEach((row) => {
    this.mobilePrototypes().push(new mobiles.Mobile().load(row));
  });
  
  /** Load rooms */
  const roomList = await this.database().query(`SELECT * FROM rooms`);

  roomList.forEach((row) => {
    this.rooms().push(new rooms.Room().load(row));
  });
};

/**
 * @signature world.setStage()
 * @description Deploy the initial items and mobiles into the world.
 */
World.prototype.setStage = function () {
};

/**
 * @signature world.listen()
 * @description Start the server listening on the configured port!
 */
World.prototype.listen = async function () {
  /** Create custom winston logger */
  const logger = new winston.Logger({
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
  });
  
  this.log(logger);

  /** Instantiate pooled MySQL DB connection */
  this.database(new ezobjects.MySQLConnection(this.mysqlConfig()));
  
  /** Create tables if they doesn't exist */
  await ezobjects.createTable(this.database(), areas.configArea);
  await ezobjects.createTable(this.database(), exits.configExit);
  await ezobjects.createTable(this.database(), items.configItem);
  await ezobjects.createTable(this.database(), deployments.configDeployment);
  await ezobjects.createTable(this.database(), mobiles.configMobile);
  await ezobjects.createTable(this.database(), rooms.configRoom);
  await ezobjects.createTable(this.database(), users.configUser);

  /** Load commands */
  this.commands(this.commands().concat(interaction));
  this.commands(this.commands().concat(movement));
  this.commands(this.commands().concat(system));
    
  /** Load the areas from database */
  await this.loadAreas();
  
  /** Set the stage */
  this.setStage();
  
  /** Create server -- net.createServer constructor parameter is new connection handler */
  const server = net.createServer((socket) => {
    this.log().info(`New socket from ${socket.address().address}.`);

    /** Create a new user */
    const user = new users.User({
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

      if ( user ) {
        /** User exists, disconnect them */
        this.log().info(`User ${user.name()} disconnected.`);

        /** Zero the user's socket and update their state to disconnected, but leave them in game */
        user.socket(null);
        user.state(constants.STATE_DISCONNECTED);
      } else {
        /** User doesn`t exist, just log disconnected socket */
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
    throw error;
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
