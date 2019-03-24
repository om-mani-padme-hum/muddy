/** Require local modules */
const constants = require(`./constants`);
const fighting = require(`./fighting`);

let tick = 1;

module.exports = (world) => {
  /** Loop through each area in the world */
  world.areas().forEach((area) => {
    /** Loop through each room in the area */
    area.rooms().forEach((room) => {
      /** Create array of all characters in room */
      const characters = room.users().concat(room.mobiles());
      
      /** Loop through each character in room who is fighting */
      characters.forEach((character) => {
        /** On every fouorth tick, update fighting for character */
        if ( tick % 4 == 0 ) {
          /** Update any fighting the character is engaged in */
          fighting.updateFighting(world, character);
          
          /** Update health, mana, and energy */
          character.health(Math.min(character.maxHealth(), character.health() + 1));
          character.mana(Math.min(character.maxMana(), character.mana() + 1));
          character.energy(Math.min(character.maxEnergy(), character.energy() + 1));
          
          /** Update position if necessary */
          if ( character.position() == constants.POSITION_INCAPACITATED && character.health() > 0 ) {
            character.send(`You come to your senses and slowly stumble to your feet.\r\n`);
            character.position(constants.POSITION_STANDING);
          }
        }
      });
    });
  });
  
  /** Loop through each user in the world */
  world.users().forEach((user) => {
    /** If the user is connected and has text waiting in the output buffer... */
    if ( user.state() != world.constants().STATE_DISCONNECTED && user.socket() && user.outBuffer().length > 0 ) {
      /** If user is connected, send prompt */
      if ( user.state() == world.constants().STATE_CONNECTED )
        user.prompt(world);
      
      if ( !user.command() )
        user.socket().write(`\r\n`);
      
      /** Send output buffer */
      user.socket().write(user.outBuffer());

      /** Clear output buffer */
      user.outBuffer(``);
      
      /** Unset user's command boolean */
      user.command(false);
    }
  });
  
  /** Increment tick by one */
  tick++;
  
  /** If tick exceeds 256, reset to 1 */
  if ( tick > 256 )
    tick = 1;
    
  /** Update fights every 250 ms */
  setTimeout(module.exports, 250, world);
};
