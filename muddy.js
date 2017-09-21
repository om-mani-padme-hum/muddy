'use strict';

/** Load all modules required by muddy */
const world = require('./world');
const input = require('./input');
const users = require('./users');
const areas = require('./areas');
const rooms = require('./rooms');
const objects = require('./objects');
const mobiles = require('./mobiles');
const exits = require('./exits');
const commands = require('./commands');

/** Export classes and flags for use as a single framework */
exports.World = world.World;
exports.InputProcessor = input.InputProcessor;
exports.User = users.User;
exports.Area = areas.Area;
exports.Room = rooms.Room;
exports.Object = objects.Object;
exports.Mobile = mobiles.Mobile;
exports.Exit = exits.Exit;
exports.Command = commands.Command;