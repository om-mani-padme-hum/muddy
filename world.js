/** Load external modules */
const crypto = require(`crypto`);
const ezobjects = require(`ezobjects`);
const mysql = require(`mysql`);
const net = require(`net`);
const winston = require(`winston`);

/** Load local modules */
const areas = require(`./areas`);
const characters = require(`./characters`);
const commands = require(`./commands`);
const constants = require(`./constants`);
const exits = require(`./exits`);
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
    { name: `areas`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Area`) ? null : x) },
    { name: `characters`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Character`) ? null : x) },
    { name: `commands`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Command`) ? null : x) },
    { name: `constants`, type: `Object`, default: constants },
    { name: `database`, type: `MySQLConnection` },
    { name: `itemPrototypes`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) },
    { name: `items`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) },
    { name: `mobilePrototypes`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Mobile`) ? null : x) },
    { name: `mobiles`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Mobile`) ? null : x) },
    { name: `motd`, type: `string`, default: constants.DEFAULT_MOTD },
    { name: `mysqlConfig`, type: `Object` },
    { name: `port`, type: `number`, default: 7000, setTransform: x => parseInt(x) },
    { name: `rooms`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Room`) ? null : x) },
    { name: `users`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `User`) ? null : x) },
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
World.prototype.listen = function () {
  /** Instantiate pooled MySQL DB connection */
  this.database(new ezobjects.MySQLConnection(this.mysqlConfig()));
  
  /** Create tables if they doesn't exist */
  ezobjects.createTable(this.database(), areas.configArea);
  ezobjects.createTable(this.database(), exits.configExit);
  ezobjects.createTable(this.database(), items.configItem);
  ezobjects.createTable(this.database(), mobiles.configMobile);
  ezobjects.createTable(this.database(), rooms.configRoom);
  ezobjects.createTable(this.database(), users.configUser);

  /** Load the areas from database */
  this.loadAreas();
  
  /** Set the stage */
  this.setStage();
  
  /** Create server -- net.createServer constructor parameter is new connection handler */
  const server = net.createServer((socket) => {
    console.log(`New socket from ${socket.address().address}.`);

    /** Create a new user */
    const user = new users.User({
      socket: socket
    });

    /** 
     * Assign socket a random ID because apparently sockets aren't unique enough for comparison.
     * @todo Find another way
     */
    socket.id = crypto.randomBytes(32).toString(`hex`);

    /** Add user to active users list */
    this.users().push(user);

    /** Log user disconnects */
    socket.on(`end`, () => {
      /** Look up the socket`s user, if one exists */
      const user = this.users().find(x => x.socket() == socket);

      if ( user ) {
        /** User exists, disconnect them */
        console.log(`User ${user.name()} disconnected.`);

        /** Zero the user's socket and update their state to disconnected, but leave them in game */
        user.socket(null);
        user.state(constants.STATE_DISCONNECTED);
      } else {
        /** User doesn`t exist, just log disconnected socket */
        console.log(`Socket ${user.socket().address().address} disconnected.`);
      }
    });

    /** Data received from user */
    socket.on(`data`, (buffer) => {    
      /** Pass input to the input processor */
      //inputProcessor.process(socket, buffer);
      console.log(buffer);
    });

    /** Display welcome message */
    socket.write(this.welcome());
  });

  /** Re-throw errors for now */
  server.on(`error`, (error) => {
    throw error;
  });

  /** Time to get started */
  server.listen(this.port(), () => {
    console.log(`Muddy is up and running on port ${this.port()}!`);
  });
};

/** Export objects */
exports.World = World;
