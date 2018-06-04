/** External modules */
const crypto = require(`crypto`);
const ezobjects = require(`ezobjects`);
const mysql = require(`mysql`);
const net = require(`net`);

/** Muddy modules */
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
 * @signature world.listen()
 * @description Start the server listening on the configured port!
 */
World.prototype.listen = function () {
  /** Instantiate pooled MySQL DB connection */
  const database  = mysql.createPool(this.mysqlConfig());
  
  const server = net.createServer((c) => {
    console.log(`Client connected`);
    
    c.on(`end`, () => {
      console.log(`Client disconnected`);
    });
    
    c.write(`Welcome to Muddy!\r\n`);
    c.pipe(c);
  });
  
  server.on(`error`, (err) => {
    throw err;
  });
  
  server.listen(this.port(), () => {
    console.log(`Muddy up and running on port ${this.port()}!`);
  });
};

/** Export objects */
exports.World = World;
