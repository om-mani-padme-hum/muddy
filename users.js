'use strict';

/**
 * Data model and helper class for users.
 */
class User {
  /**
   * Instantiate a new user.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
    /** Define user state flags */
    this.STATE_NAME = 0;
    this.STATE_OLD_PASSWORD = 1;
    this.STATE_NEW_PASSWORD = 2;
    this.STATE_CONFIRM_PASSWORD = 3;
    this.STATE_MOTD = 4;
    this.STATE_CONNECTED = 5;
    this.STATE_DISCONNECTED = 6;
    
    this.init(data);
  }

  /**
   * Initialize the object to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** In-game properties */
    this.socket(data.socket == null ? null : data.socket);
    this.state(data.state == null ? this.STATE_NAME : data.state);

    /** Stored properties */
    this.id(data.id == null ? -1 : data.id);
    this.name(data.name == null ? "" : data.name);
    this.password(data.password == null ? "" : data.password);
    this.salt(data.salt == null ? "" : data.salt);
    this.level(data.level == null ? 1 : data.level);
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
   * Write to user's socket (assuming it exists).
   * @param buffer Desired output
   * @return Socket existed true/false
   */
  send(buffer = '\r\n') {
    if ( this.socket() ) {
      this.socket().write(buffer);
      return true;
    }
    
    return false;
  }
}

exports.User = User;