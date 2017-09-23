'use strict';

const users = require('./users');

/**
 * Data model and helper class for users.
 */
class Mobile extends users.User {
  /**
   * Instantiate a new user.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
    super();
    
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
    this.level(data.level == null ? 1 : data.level);
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
}

exports.Mobile = Mobile;