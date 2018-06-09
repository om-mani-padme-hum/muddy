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
const items = require(`./items`);
const rooms = require(`./rooms`);

/** Configure world object */
const configWorld = {
  className: `World`,
  properties: [
    { name: `areas`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Area`) ? null : x) },
    { name: `characters`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Character`) ? null : x) },
    { name: `commands`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Command`) ? null : x) },
    { name: `constants`, type: `Object`, default: constants },
    { name: `items`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) },
    { name: `mysqlConfig`, type: `Object` },
    { name: `npcs`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Mobile`) ? null : x) },
    { name: `port`, type: `number`, default: 7000, setTransform: x => parseInt(x) },
    { name: `rooms`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Room`) ? null : x) },
    { name: `users`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `User`) ? null : x) }
  ]
};

/** Create world object */
ezobjects.createObject(configWorld);

/**
 * @signature world.loadAreas()
 * @description Load all areas in the `area` directory.
 */
World.prototype.loadAreas = function () {
}

/**
 * @signature world.listen()
 * @description Start the server listening on the configured port!
 */
World.prototype.listen = function () {
  /** Instantiate pooled MySQL DB connection */
  const database  = mysql.createPool(this.mysqlConfig());
  
  /** Load the areas from area files */
  this.loadAreas();
  
  /** Create server -- net.createServer constructor parameter is new connection handler */
  const server = net.createServer((socket) => {
    console.log(`New socket from ${socket.address().address}.`);

    /** Create a new user */
    const user = new characters.User({
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
        user.state(user.STATE_DISCONNECTED);
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
    socket.write(`Welcome message\r\n`);
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
