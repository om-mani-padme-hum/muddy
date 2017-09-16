/**
 * Data model and helper class for a Muddy world.
 */
class World {
  /**
   * Instantiate a new world.
   * @param data (optional) Configuration object
   */
  constructor(data = {}) {
    /** Define direction flags */
    this.DIR_NORTH = 0;                    /**< n */
    this.DIR_NORTHEAST = 1;                /**< ne */
    this.DIR_EAST = 2;                     /**< e */
    this.DIR_SOUTHEAST = 3;                /**< se */
    this.DIR_SOUTH = 4;                    /**< s */
    this.DIR_SOUTHWEST = 5;                /**< sw */
    this.DIR_WEST = 6;                     /**< w */
    this.DIR_NORTHWEST = 7;                /**< nw */
    this.DIR_UP = 8;                       /**< u */
    this.DIR_UP_AND_NORTH = 9;             /**< un */
    this.DIR_UP_AND_NORTHEAST = 10;        /**< une */
    this.DIR_UP_AND_EAST = 11;             /**< ue */
    this.DIR_UP_AND_SOUTHEAST = 12;        /**< use */
    this.DIR_UP_AND_SOUTH = 13;            /**< us */
    this.DIR_UP_AND_SOUTHWEST = 14;        /**< usw */
    this.DIR_UP_AND_WEST = 15;             /**< w */
    this.DIR_UP_AND_NORTHWEST = 16;        /**< nw */
    this.DIR_DOWN = 17;                    /**< d */
    this.DIR_DOWN_AND_NORTH = 18;          /**< dn */
    this.DIR_DOWN_AND_NORTHEAST = 19;      /**< dne */
    this.DIR_DOWN_AND_EAST = 20;           /**< de */
    this.DIR_DOWN_AND_SOUTHEAST = 21;      /**< dse */
    this.DIR_DOWN_AND_SOUTH = 22;          /**< ds */
    this.DIR_DOWN_AND_SOUTHWEST = 23;      /**< dsw */
    this.DIR_DOWN_AND_WEST = 24;           /**< dw */
    this.DIR_DOWNUP_AND_NORTHWEST = 25;    /**< dnw */
    
    this.init(data);
  }

  /**
   * Initialize the object to provided data or defaults.
   * @param data (optional) Configuration object
   */
  init(data = {}) {
    this.areas(data.areas == null ? [] : data.areas);
    this.rooms(data.rooms == null ? [] : data.rooms);
    this.objects(data.objects == null ? [] : data.objects);
    this.users(data.users == null ? [] : data.users);
  }

  /** 
   * Areas getter/setter.
   * @param (optional) areas Desired areas
   * @return The world for set call chaining
   */
  areas(areas = null) {
    /** Getter */
    if ( areas == null )
      return this._areas;

    /** Setter */
    this._areas = areas;

    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Add area.
   * @param area Desired area to add
   * @return Added area
   */
  addArea(area) {
    /** Push area onto list */
    this.areas().push(area);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Rooms getter/setter.
   * @param (optional) rooms Desired rooms
   * @return The world for set call chaining
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
   * Add room.
   * @param room Desired room to add
   * @return Added room
   */
  addRoom(room) {
    /** Push user onto list */
    this.rooms().push(room);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Objects getter/setter.
   * @param (optional) users Desired objects
   * @return The world for set call chaining
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
   * Add object.
   * @param object Desired object to add
   * @return Added object
   */
  addObject(object) {
    /** Push object onto list */
    this.objects().push(object);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /** 
   * Users getter/setter.
   * @param (optional) users Desired users
   * @return The world for set call chaining
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
   * Add user.
   * @param user Desired user to add
   * @return Added user
   */
  addUser(user) {
    /** Push user onto list */
    this.users().push(user);
    
    /** Allow for set call chaining */
    return this;
  }
  
  /**
   * Find user by socket.
   * @param Desired user's socket
   * @return Desired user
   */
  findUserBySocket(socket) {
    return this.users().find((user) => {
      return user.socket().id == socket.id;
    });
  }
  
  /**
   * Find user by name.
   * @param Desired user's name
   * @return Desired user
   */
  findUserByName(name) {
    return this.users().find((user) => {
      return user.name() == name;
    });
  }
  
  /**
   * Remove user.
   * @param Desired user to remove
   */
  removeUser(user) {
    /** Splice user from list */
    this.users().splice(this.users().indexOf(user));
  }
}

exports.World = World;