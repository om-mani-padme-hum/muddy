'use strict';

/**
 * Data model and helper class for areas.
 */
class Area {
  /**
   * Instantiate a new area.
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
   * Initialize the area to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** In-game properties */
    this.rooms(data.rooms == null ? [] : data.rooms);
    this.items(data.items == null ? [] : data.items);
    this.mobiles(data.mobiles == null ? [] : data.mobiles);

    /** Stored properties */
    this.id(data.id == null ? -1 : data.id);
    this.name(data.name == null ? "" : data.name);
    this.description(data.description == null ? "" : data.description);
    this.flags(data.flags == null ? [] : data.flags);
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
   * @return The area for set call chaining
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
   * Rooms getter/setter.
   * @param (optional) rooms Desired rooms
   * @return The area for set call chaining
   */
  rooms(rooms = null) {
    /** Getter */
    if ( rooms == null )
      return this._rooms;

    /** Setter */
    this._rooms = rooms;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Objects getter/setter.
   * @param (optional) items Desired items
   * @return The area for set call chaining
   */
  items(items = null) {
    /** Getter */
    if ( items == null )
      return this._items;

    /** Setter */
    this._items = items;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Mobiles getter/setter.
   * @param (optional) users Desired mobiles
   * @return The area for set call chaining
   */
  mobiles(mobiles = null) {
    /** Getter */
    if ( mobiles == null )
      return this._mobiles;

    /** Setter */
    this._mobiles = mobiles;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * ID getter/setter.
   * @param (optional) name Desired ID
   * @return The area for set call chaining
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
   * @return The area for set call chaining
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
   * @return The area for set call chaining
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
   * @return The area for set call chaining
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

exports.Area = Area;