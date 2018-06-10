/** Load muddy */
const muddy = require(`./index`);

/** Create new Muddy world */
const world = new muddy.World({
  mysqlConfig: {
    connectionLimit : 20,
    host            : `localhost`,
    user            : `muddy`,
    password        : `S3cur3UrMuD!`,
    database        : `muddy`
  },
  port: 9000
});

/** Bring the world to life */
world.listen();
