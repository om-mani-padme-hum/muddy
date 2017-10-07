'use strict';

/**
 * Data model and helper class for commands.
 */
class Command {
  /**
   * Instantiate a new command.
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
   * Initialize the command to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** In-game properties */
    this.name(data.name == null ? '' : data.name);
    this.command(data.command == null ? null : data.command);
    this.priority(data.priority == null ? false : data.priority);
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
   * @return The command for set call chaining
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
   * Name getter/setter.
   * @param (optional) name Desired name
   * @return The command for set call chaining
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
   * Command function getter/setter.
   * @param (optional) to Desired command function
   * @return The command for set call chaining
   */
  command(command = null) {
    /** Getter */
    if ( command == null )
      return this._command;

    /** Setter */
    this._command = command;

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Priority getter/setter.
   * @param (optional) to Desired priority
   * @return The command for set call chaining
   */
  priority(priority = null) {
    /** Getter */
    if ( priority == null )
      return this._priority;

    /** Setter */
    this._priority = priority;

    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Execute the stored command.
   * @param user The user executing the command
   * @param buffer The parameters to the command
   */
  execute(user, buffer) {
    this.command()(user, buffer);
  }
}

exports.Command = Command;