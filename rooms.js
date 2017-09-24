'use strict';

/**
 * Data model and helper class for rooms.
 */
class Room {
  /**
   * Instantiate a new room.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
    /** Define room flags */
    this.ROOM_INSIDE = 1;
    this.ROOM_SAFE = 2;
    
    this.init(data);
  }

  /**
   * Initialize the room to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** In-game properties */
    this.area(data.area == null ? null : data.area);
    this.users(data.users == null ? [] : data.users);
    this.objects(data.objects == null ? [] : data.objects);
  
    /** Stored properties */
    this.id(data.id == null ? -1 : data.id);
    this.name(data.name == null ? "" : data.name);
    this.description(data.description == null ? "" : data.description);
    this.flags(data.flags == null ? [] : data.flags);
    this.exits(data.exits == null ? [] : data.exits);
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
   * Area getter/setter.
   * @param (optional) area Desired area
   * @return The room for set call chaining
   */
  area(area = null) {
    /** Getter */
    if ( area == null )
      return this._area;

    /** Setter */
    this._area = area;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Users getter/setter.
   * @param (optional) users Desired users
   * @return The room for set call chaining
   */
  users(users = null) {
    /** Getter */
    if ( users == null )
      return this._users;

    /** Setter */
    this._users = users;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Objects getter/setter.
   * @param (optional) objects Desired objects
   * @return The room for set call chaining
   */
  objects(objects = null) {
    /** Getter */
    if ( objects == null )
      return this._objects;

    /** Setter */
    this._objects = objects;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * ID getter/setter.
   * @param (optional) name Desired ID
   * @return The room for set call chaining
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
   * @return The room for set call chaining
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
   * @return The room for set call chaining
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
   * @param (optional) salt Desired flags
   * @return The room for set call chaining
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
   * Exits getter/setter.
   * @param (optional) exits Desired exits
   * @return The room for set call chaining
   */
  exits(exits = null) {
    /** Getter */
    
    /** If parameter is null, return array */
    if ( exits == null )
      return this._exits;

    /** If parameter is string, return exit by direction */
    if ( typeof exits == 'string' ) {
      let dir = -1;
      
      /** Convert direction string to constant */
      if ( dir == 'north' )
        dir = this.DIR_NORTH;
      else if ( dir == 'northeast' || dir == 'ne' )
        dir = this.DIR_NORTHEAST;
      else if ( dir == 'east' )
        dir = this.DIR_EAST;
      else if ( dir == 'southeast' || dir == 'se' )
        dir = this.DIR_SOUTHEAST;
      else if ( dir == 'south' )
        dir = this.DIR_SOUTH;
      else if ( dir == 'southwest' || dir == 'sw' )
        dir = this.DIR_SOUTHWEST;
      else if ( dir == 'west' )
        dir = this.DIR_WEST;
      else if ( dir == 'northwest' || dir == 'nw' )
        dir = this.DIR_NORTHWEST;
      else if ( dir == 'up' )
        dir = this.DIR_UP;
      else if ( dir == 'down' )
        dir = this.DIR_DOWN;
      else
        throw "Room.exits(): Invalid direction name.";
      
      /** Find and return exit, if it exists */
      return this._exits.find((exit) => {
        return exit.dir() == dir;
      });
    }
    
    /** If parameter is a number, return exit name by direction constant */
    if ( typeof exits == 'number' ) {
      if ( exits == this.DIR_NORTH )
        return 'north';
      else if ( exits == this.DIR_NORTHEAST )
        return 'ne';
      else if ( exits == this.DIR_EAST )
        return 'east';
      else if ( exits == this.DIR_SOUTHEAST )
        return 'se';
      else if ( exits == this.DIR_SOUTH )
        return 'south';
      else if ( exits == this.DIR_SOUTHWEST )
        return 'sw';
      else if ( exits == this.DIR_WEST )
        return 'west';
      else if ( exits == this.DIR_NORTHWEST )
        return 'nw';
      else if ( exits == this.DIR_UP )
        return 'up';
      else if ( exits == this.DIR_DOWN )
        return 'down';
      else
        throw "Room.exits(): Invalid direction constant.";
    }
    
    /** Setter */
    this._exits = exits;

    /** Allow for set call chaining */
    return this;
  }
}

exports.Room = Room;