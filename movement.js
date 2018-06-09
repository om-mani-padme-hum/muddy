/** Require local modules */
const commands = require(`./commands`);

/** Create template for all direction commands */
const dirCommand = (dir) => {
  return new commands.Command(this, {
    name: dir,
    command: (world, user, buffer) => {
      /** Look for an exit in that direction */
      const exit = user.room().exits(dir);

      if ( exit ) {
        /** If it exists, get the room it goes to */
        const room = this.rooms(exit.to());

        if ( room ) {
          /** If room exists, move user to room and look */
          user.room(room);

          /** Find the look command and execute it for this user */
          this.commands(`look`).execute(user, ``);
        } else {
          /** If room doesn`t exist, notify imps and send user an error message */
          console.log(`Bad exit: direction ${dir} from room ${user.room().id()}.`);

          user.send(`Some kind of force is blocking your way.\r\n`);
        }
      } else {
        /** If it doesn`t exist, send error message */
        user.send(`You cannot go that way.\r\n`);
      }
    },
    priority: dir == `north` || dir == `south` ? true : false
  });
};

module.exports = [
  dirCommand(`north`),
  dirCommand(`northeast`),
  dirCommand(`ne`),
  dirCommand(`east`),
  dirCommand(`southeast`),
  dirCommand(`se`),
  dirCommand(`south`),
  dirCommand(`southwest`),
  dirCommand(`sw`),
  dirCommand(`west`),
  dirCommand(`northwest`),
  dirCommand(`nw`),
  dirCommand(`up`),
  dirCommand(`down`)
];
