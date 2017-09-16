/** Load all modules required by muddy */
const world = require('./world');
const user = require('./user');
const input = require('./input');

/** Export them for use as a single framework */
exports.World = world.World;
exports.User = user.User;
exports.InputProcessor = input.InputProcessor;