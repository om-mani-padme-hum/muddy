'use strict';

/**
 * Data model and helper class for exits.
 */
class Exit {
  /**
   * Instantiate a new exit.
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
   * Initialize the exit to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** In-game properties */
    this.from(data.from == null ? null : data.from);

    /** Stored properties */
    this.dir(data.dir == null ? null : data.dir);
    this.to(data.to == null ? null : data.to);
    this.flags(data.flags = null ? null : data.flags);
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
   * @return The exit for set call chaining
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
   * Direction getter/setter.
   * @param (optional) dir Desired direction flag
   * @return The exit for set call chaining
   */
  dir(dir = null) {
    /** Getter */
    if ( dir == null )
      return this._dir;

    /** Setter */
    this._dir = dir;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * To-room getter/setter.
   * @param (optional) to Desired to-room
   * @return The exit for set call chaining
   */
  to(to = null) {
    /** Getter */
    if ( to == null )
      return this._to;

    /** Setter */
    this._to = to;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * From-room getter/setter.
   * @param (optional) from Desired from-room
   * @return The exit for set call chaining
   */
  from(from = null) {
    /** Getter */
    if ( from == null )
      return this._from;

    /** Setter */
    this._from = from;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Flags getter/setter.
   * @param (optional) salt Desired flags
   * @return The exit for set call chaining
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
}

exports.Exit = Exit;