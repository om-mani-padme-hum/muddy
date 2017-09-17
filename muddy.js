/** Load all modules required by muddy */
const world = require('./world');
const users = require('./users');
const input = require('./input');

/** Export classes and flags for use as a single framework */
exports.World = world.World;
exports.User = user.User;
exports.InputProcessor = input.InputProcessor;

exports.DIR_NORTH = world.DIR_NORTH;
exports.DIR_NORTHEAST = world.DIR_NORTHEAST;
exports.DIR_EAST = world.DIR_EAST;
exports.DIR_SOUTHEAST = world.DIR_SOUTHEAST;
exports.DIR_SOUTH = world.DIR_SOUTH;
exports.DIR_SOUTHWEST = world.DIR_SOUTHWEST;
exports.DIR_WEST = world.DIR_WEST;
exports.DIR_NORTHWEST = world.DIR_NORTHWEST;
exports.DIR_UP = world.DIR_UP;
exports.DIR_UP_AND_NORTH = world.DIR_UP_AND_NORTH;
exports.DIR_UP_AND_NORTHEAST = world.DIR_UP_AND_NORTHEAST;
exports.DIR_UP_AND_EAST = world.DIR_UP_AND_EAST;
exports.DIR_UP_AND_SOUTHEAST = world.DIR_UP_AND_SOUTHEAST;
exports.DIR_UP_AND_SOUTH = world.DIR_UP_AND_SOUTH;
exports.DIR_UP_AND_SOUTHWEST = world.DIR_UP_AND_SOUTHWEST;
exports.DIR_UP_AND_WEST = world.DIR_UP_AND_WEST;
exports.DIR_UP_AND_NORTHWEST = world.DIR_UP_AND_NORTHWEST;
exports.DIR_DOWN = world.DIR_DOWN;
exports.DIR_DOWN_AND_NORTH = world.DIR_DOWN_AND_NORTH;
exports.DIR_DOWN_AND_NORTHEAST = world.DIR_DOWN_AND_NORTHEAST;
exports.DIR_DOWN_AND_EAST = world.DIR_DOWN_AND_EAST;
exports.DIR_DOWN_AND_SOUTHEAST = world.DIR_DOWN_AND_SOUTHEAST;
exports.DIR_DOWN_AND_SOUTH = world.DIR_DOWN_AND_SOUTH;
exports.DIR_DOWN_AND_SOUTHWEST = world.DIR_DOWN_AND_SOUTHWEST;
exports.DIR_DOWN_AND_WEST = world.DIR_DOWN_AND_WEST;
exports.DIR_DOWNUP_AND_NORTHWEST = world.DIR_DOWNUP_AND_NORTHWEST;