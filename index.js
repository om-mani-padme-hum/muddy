/** Load all modules required by muddy */
const areas = require(`./areas`);
const characters = require(`./characters`);
const commands = require(`./commands`);
const constants = require(`./constants`);
const exits = require(`./exits`);
const items = require(`./items`);
const rooms = require(`./rooms`);
const world = require(`./world`);

/** Export classes and flags for use as a single framework */
module.exports = constants;
module.exports.Area = areas.Area;
module.exports.Character = characters.Character;
module.exports.Command = commands.Command;
module.exports.Exit = exits.Exit;
module.exports.Item = items.Item;
module.exports.Mobile = characters.Mobile;
module.exports.Room = rooms.Room;
module.exports.User = characters.User;
module.exports.World = world.World;
