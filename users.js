'use strict';

const rooms = require('./rooms');

/**
 * Data model and helper class for users.
 */
class User {
  /**
   * Instantiate a new user.
   * @param world The world item
   * @param data (optional) Configuration object
   */
  constructor(world, data = {}) {
    /** Store the world item */
    this.world(world);
    
    /** Initialize any optional configuration parameters */
    this.init(data);
  }

  /**
   * Initialize the user to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** In-game properties */
    this.socket(data.socket == null ? null : data.socket);
    this.state(data.state == null ? this.world().STATE_NAME : data.state);
    this.room(data.room == null ? null : data.room);
    this.outbuffer('');
    
    /** Stored properties */
    this.id(data.id == null ? -1 : data.id);
    this.name(data.name == null ? "Nobody" : data.name);
    this.password(data.password == null ? "" : data.password);
    this.salt(data.salt == null ? "" : data.salt);
    this.level(data.level == null ? 1 : data.level);
    this.race(data.race == null ? 1 : data.race);
    this.lineage(data.lineage == null ? 1 : data.lineage);
    this.hp(data.hp == null ? 1 : data.hp);
    this.mana(data.mana == null ? 1 : data.mana);
    this.rage(data.rage == null ? 1 : data.rage);
  }
  
  /**
   * Batch load properties, e.g. from database.
   * @param data (optional) Configuration object
   */
  load(data = {}) {    
    /** Loop through the data keys */
    Object.keys(data).forEach((key) => {
      if ( typeof this[key] == 'function' ) {
        /** There exists a class method matching that key, store the value */
        this[key](data[key]);
      }
    });
  }
  
  /** 
   * World getter/setter.
   * @param (optional) world Desired world
   * @return The user for set call chaining
   */
  world(world = null) {
    /** Getter */
    if ( world == null )
      return this._world;

    /** Setter */
    this._world = world;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Socket getter/setter.
   * @param (optional) socket Desired socket
   * @return The user for set call chaining
   */
  socket(socket = null) {
    /** Getter */
    if ( socket == null )
      return this._socket;

    /** Setter */
    this._socket = socket;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * State getter/setter.
   * @param (optional) state Desired state
   * @return The user for set call chaining
   */
  state(state = null) {
    /** Getter */
    if ( state == null )
      return this._state;

    /** Setter */
    this._state = parseInt(state);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Room getter/setter.
   * @param (optional) room Desired room
   * @return The user for set call chaining
   */
  room(room = null) {
    /** Getter */
    if ( room == null )
      return this._room;

    /** Setter */
    
    /** Remove user from room, if one exists */
    if ( this._room )
      this._room.users().splice(this._room.users().indexOf(this), 1);
    
    /** Move user to room */
    if ( typeof room == 'number' )
      this._room = this.world.rooms(room);
    else if ( room instanceof rooms.Room )
      this._room = room;
    
    /** Add user to room */
    this._room.users().push(this);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Output buffer getter/setter.
   * @param (optional) buffer Desired output buffer
   * @return The user for set call chaining
   */
  outbuffer(outbuffer = null) {
    /** Getter */
    if ( outbuffer == null )
      return this._outbuffer;

    /** Setter */
    this._outbuffer = outbuffer.toString();

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * ID getter/setter.
   * @param (optional) name Desired ID
   * @return The user for set call chaining
   */
  id(id = null) {
    /** Getter */
    if ( id == null )
      return this._id;

    /** Setter */
    this._id = parseInt(id);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Name getter/setter.
   * @param (optional) name Desired name
   * @return The user for set call chaining
   */
  name(name = null) {
    /** Getter */
    if ( name == null )
      return this._name;

    /** Setter */
    this._name = name.toString();

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Password getter/setter.
   * @param (optional) password Desired password
   * @return The user for set call chaining
   */
  password(password = null) {
    /** Getter */
    if ( password == null )
      return this._password;

    /** Setter */
    this._password = password.toString();

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Salt getter/setter.
   * @param (optional) salt Desired salt
   * @return The user for set call chaining
   */
  salt(salt = null) {
    /** Getter */
    if ( salt == null )
      return this._salt;

    /** Setter */
    this._salt = salt.toString();

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Level getter/setter.
   * @param (optional) level Desired level
   * @return The user for set call chaining
   */
  level(level = null) {
    /** Getter */
    if ( level == null )
      return this._level;

    /** Setter */
    this._level = parseInt(level);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Race getter/setter.
   * @param (optional) race Desired race
   * @return The user for set call chaining
   */
  race(race = null) {
    /** Getter */
    if ( race == null )
      return this._race;

    /** Setter */
    this._race = parseInt(race);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Lineage getter/setter.
   * @param (optional) lineage Desired lineage
   * @return The user for set call chaining
   */
  lineage(lineage = null) {
    /** Getter */
    if ( lineage == null )
      return this._lineage;

    /** Setter */
    this._lineage = parseInt(lineage);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Hit points getter/setter.
   * @param (optional) hp Desired hit points
   * @return The user for set call chaining
   */
  hp(hp = null) {
    /** Getter */
    if ( hp == null )
      return this._hp;

    /** Setter */
    this._hp = parseInt(hp);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Mana getter/setter.
   * @param (optional) mana Desired mana
   * @return The user for set call chaining
   */
  mana(mana = null) {
    /** Getter */
    if ( mana == null )
      return this._mana;

    /** Setter */
    this._mana = parseInt(mana);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Rage getter/setter.
   * @param (optional) rage Desired rage
   * @return The user for set call chaining
   */
  rage(rage = null) {
    /** Getter */
    if ( rage == null )
      return this._rage;

    /** Setter */
    this._rage = parseInt(rage);

    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Send the user their prompt.
   */
  prompt() {
    this.send('\r\n0xp <100h 100m> ');
  }
  
  /**
   * Write to user's socket (assuming it exists).
   * @param buffer Desired output
   * @param immediate Output immediately (true) or buffer (false)
   * @return Socket existed true/false
   */
  send(buffer = '\r\n', immediate = true) {
    try { 
      if ( immediate ) {
        /** If output is immediate, write to socket */
        this.socket().write(buffer);
      } else {
        /** If output is buffered, append to end of outbuffer */
        this.outbuffer(this.outbuffer() + buffer);
      }
    } catch ( err ) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Flush the output buffer to user's socket (assuming it exists).
   */
  flush() {
    try {       
      if ( this.outbuffer().length > 0 ) {
        console.log(`Sending output ${this.outbuffer()} to user ${this.name()}.`);
        this.socket().write(`\r\n${this.outbuffer()}`);
        this.prompt();
        this.outbuffer("");
      }
      
      setTimeout(this.flush.bind(this), 2000);
    } catch ( err ) {
      console.log('Failed to flush output buffer to socket, terminating output buffer loop.');
    }
  }
}

exports.User = User;