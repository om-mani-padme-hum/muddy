'use strict';

/**
 * Data model and helper class for objects.
 */
class Object {
  /**
   * Instantiate a new object.
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
    this.room(data.room == null ? null : data.room);
    this.user(data.user == null ? null : data.user);
    this.contents(data.contents == null ? [] : data.contents);
  
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
   * Room getter/setter.
   * @param (optional) room Desired room
   * @return The object for set call chaining
   */
  room(room = null) {
    /** Getter */
    if ( room == null )
      return this._room;

    /** Setter */
    this._room = room;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * User getter/setter.
   * @param (optional) room Desired user
   * @return The object for set call chaining
   */
  user(user = null) {
    /** Getter */
    if ( user == null )
      return this._user;

    /** Setter */
    this._user = user;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Users getter/setter.
   * @param (optional) contents Desired contents
   * @return The object for set call chaining
   */
  contents(contents = null) {
    /** Getter */
    if ( contents == null )
      return this._contents;

    /** Setter */
    this._contents = contents;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * ID getter/setter.
   * @param (optional) name Desired ID
   * @return The object for set call chaining
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
   * @return The object for set call chaining
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
   * @return The object for set call chaining
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
   * @return The object for set call chaining
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

exports.Object = Object;