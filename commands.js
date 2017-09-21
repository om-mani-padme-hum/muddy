'use strict';

/**
 * Data model and helper class for commands.
 */
class Command {
  /**
   * Instantiate a new command.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
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
   * Execute the stored command.
   * @param user The user executing the command
   * @param buffer The parameters to the command
   */
  execute(user, buffer) {
    this.command()(user, buffer);
  }
}

exports.Command = Command;