/** Require external modules */
const fs = require(`fs`);

/** Require muddy */
const muddy = require(`./index`);

/**
 * Read MySQL config from JSON file with the format:
 * {
 *   "host"            : `localhost`,
 *   "user"            : `muddy`,
 *   "password"        : `S3cur3UrMuD!`,
 *   "database"        : `muddy`
 * }
 */
const mysqlConfig = JSON.parse(fs.readFileSync(`mysql-config.json`));

/** Create new Muddy world */
const world = new muddy.World({
  mysqlConfig: mysqlConfig,
  port: 9000
});

/** Bring the world to life */
world.listen();

/** Start up the web builder, if desired */
muddy.webBuilder(world);
