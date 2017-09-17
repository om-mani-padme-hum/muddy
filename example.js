/** External modules */
const mysql = require('mysql');

/** Muddy module */
const muddy = require('./muddy');

/** Instantiate pooled MySQL DB connection */
const db  = mysql.createPool({
  connectionLimit : 20,
  host            : 'localhost',
  user            : 'muddy',
  password        : 'S3cur3UrMuD!',
  database        : 'muddy'
});

/** Create world */
const world = new muddy.World({
  db: db, 
  port: 5000
});

/** @todo database query for areas, rooms, objects, npcs to load */
areas.forEach((area) => {
  world.addArea(area);
});

world.addCommand({
  name: 'north',
  execute: (user, buffer) => {
    let exit = user.room().exit(muddy.DIR_NORTH)
    
    if ( exit )
      user.room(exit.toRoom());
    else
      user.send('You cannot go that way.');
  }
});

world.addFightModifier(muddy.STAT_HIT_ROLL, -20, (user) => {
  return user.hasEffect(muddy.EFFECT_PLAGUE);
});

world.addMobileScript(muddy.STAT_HIT_ROLL, -20, (user) => {
  return user.hasEffect(muddy.EFFECT_PLAGUE);
});