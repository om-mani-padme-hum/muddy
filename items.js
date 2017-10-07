'use strict';

const rooms = require('./rooms');

/**
 * Data model and helper class for items.
 */
class Item {
  /**
   * Instantiate a new item.
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
   * Initialize the item to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    /** In-game properties */
    this.room(data.room == null ? null : data.room);
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
   * World getter/setter.
   * @param (optional) world Desired world
   * @return The item for set call chaining
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
   * @return The item for set call chaining
   */
  room(room = null) {    
    /** Getter */
    if ( room == null )
      return this._room;

    /** Setter */
        
    /** Remove item from room, if one exists */
    if ( this._room )
      this._room.items().splice(this._room.items().indexOf(this), 1);
        
    /** Move user to room */
    if ( typeof room == 'number' )
      this._room = this.world().rooms(room);
    else if ( room instanceof rooms.Room )
      this._room = room;
        
    /** Add user to room */
    this._room.items().push(this);

    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Users getter/setter.
   * @param (optional) contents Desired contents
   * @return The item for set call chaining
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
   * @return The item for set call chaining
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
   * @return The item for set call chaining
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
   * @return The item for set call chaining
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
   * @return The item for set call chaining
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
   * Produce a copy of this item.
   * @return A newly cloned instance of this item
   */
  copy() {
    return new Item(this.world(), {
      id: this.id(),
      name: this.name(),
      description: this.description(),
      flags: this.flags()
    });
  }
}

exports.Item = Item;