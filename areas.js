'use strict';

/**
 * Data model and helper class for areas.
 */
class Area {
  /**
   * Instantiate a new area.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
    this.init(data);
  }

  /**
   * Initialize the object to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** In-game properties */
    this.rooms(data.rooms == null ? [] : data.rooms);
  
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
    Object.keys(data).forEach((key) => {
      if ( typeof this[key] == 'function' )
        this[key](data[key]);
    });
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