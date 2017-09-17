'use strict'

/** Load all modules required by muddy */
const world = require('./world');
const users = require('./users');
const input = require('./input');

/** Export classes and flags for use as a single framework */
exports.World = world.World;
exports.User = users.User;
exports.InputProcessor = input.InputProcessor;