'use strict';

/**
 * Data model and helper class for users.
 */
class Mobile {
  /**
   * Instantiate a new user.
   * @param world The world object
   * @param data (optional) Configuration object
   */
  constructor(world, data = {}) {    
    /** Store the world object */
    this.world(world);
    
    /** Initialize any optional configuration parameters */
    this.init(data);
  }

  /**
   * Initialize the mobile to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** Stored properties */
    this.id(data.id == null ? -1 : data.id);
    this.name(data.name == null ? "" : data.name);
    this.description(data.description == null ? "" : data.description);
    this.flags(data.flags == null ? [] : data.flags);
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
   * @return The mobile for set call chaining
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
   * Room getter/setter.
   * @param (optional) room Desired room
   * @return The mobile for set call chaining
   */
  room(room = null) {
    /** Getter */
    if ( room == null )
      return this._room;

    /** Setter */
    
    /** Remove mobile from room, if one exists */
    if ( this._room )
      this._room.mobiles().splice(this._room.mobiles().indexOf(this), 1);
    
    /** Move mobile to room */
    if ( typeof room == 'number' )
      this._room = this.world(room);
    else if ( room instanceof rooms.Room )
      this._room = room;
    
    /** Add mobile to room */
    room.mobiles().push(this);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * ID getter/setter.
   * @param (optional) name Desired ID
   * @return The mobile for set call chaining
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
   * @return The mobile for set call chaining
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
   * Description getter/setter.
   * @param (optional) description Desired description
   * @return The mobile for set call chaining
   */
  description(description = null) {
    /** Getter */
    if ( description == null )
      return this._description;

    /** Setter */
    this._description = description.toString();

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Flags getter/setter.
   * @param (optional) flags Desired flags
   * @return The mobile for set call chaining
   */
  flags(flags = null) {
    /** Getter */
    if ( flags == null )
      return this._flags;

    /** Setter */
    this._flags = flags;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Level getter/setter.
   * @param (optional) level Desired level
   * @return The mobile for set call chaining
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
   * @return The mobile for set call chaining
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
   * @return The mobile for set call chaining
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
   * @return The mobile for set call chaining
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
   * @return The mobile for set call chaining
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
   * @return The mobile for set call chaining
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
}

exports.Mobile = Mobile;