/** Load all modules required by muddy */
const world = require('./world');
const users = require('./users');
const input = require('./input');

/** Export classes and flags for use as a single framework */
exports.World = world.World;
exports.User = user.User;
exports.InputProcessor = input.InputProcessor;

/** Define VT100 terminal modifiers */
exports.VT100_CLEAR = world.VT100_CLEAR;
exports.VT100_HIDE_TEXT = world.VT100_HIDE_TEXT;

/** Define direction flags */
exports.DIR_NORTH = world.DIR_NORTH;
exports.DIR_NORTHEAST = world.DIR_NORTHEAST;
exports.DIR_EAST = world.DIR_EAST;
exports.DIR_SOUTHEAST = world.DIR_SOUTHEAST;
exports.DIR_SOUTH = world.DIR_SOUTH;
exports.DIR_SOUTHWEST = world.DIR_SOUTHWEST;
exports.DIR_WEST = world.DIR_WEST;
exports.DIR_NORTHWEST = world.DIR_NORTHWEST;
exports.DIR_UP = world.DIR_UP;
exports.DIR_DOWN = world.DIR_DOWN;

/** Define user state flags */
exports.STATE_NAME = world.STATE_NAME;
exports.STATE_OLD_PASSWORD = world.STATE_OLD_PASSWORD;
exports.STATE_NEW_PASSWORD = world.STATE_NEW_PASSWORD;
exports.STATE_CONFIRM_PASSWORD = world.STATE_CONFIRM_PASSWORD;
exports.STATE_MOTD = world.STATE_MOTD;
exports.STATE_CONNECTED = world.STATE_CONNECTED;
exports.STATE_DISCONNECTED = world.STATE_DISCONNECTED;