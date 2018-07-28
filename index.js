/** Load all modules required by muddy */
const world = require(`./world`);
const web = require(`./web`);

/** Export classes and flags for use as a single framework */
module.exports.World = world.World;
module.exports.webBuilder = web.webBuilder;
