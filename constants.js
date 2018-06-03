/** Export our constants as a plain object */
module.exports = {
  /** Socket states */
  STATE_NAME: 0,
  STATE_OLD_PASSWORD: 1,
  STATE_NEW_PASSWORD: 2,
  STATE_CONFIRM_PASSWORD: 3,
  STATE_MOTD: 4,
  STATE_CONNECTED: 5,
  STATE_DISCONNECTED: 6,
    
  /** Define VT100 terminal modifiers */
  VT100_CLEAR: '\x1b[0m',
  VT100_HIDE_TEXT: '\x1b[8m',
    
  /** Define item flags */
  OBJECT_WEARABLE: 1,
  OBJECT_WIELDABLE_1H: 2,
  OBJECT_WIELDABLE_2H: 3,
  OBJECT_CONTAINER: 4,
    
  /** Define direction flags */
  DIR_NORTH: 1,                    /**< n */
  DIR_NORTHEAST: 2,                /**< ne */
  DIR_EAST: 3,                     /**< e */
  DIR_SOUTHEAST: 4,                /**< se */
  DIR_SOUTH: 5,                    /**< s */
  DIR_SOUTHWEST: 6,                /**< sw */
  DIR_WEST: 7,                     /**< w */
  DIR_NORTHWEST: 8,                /**< nw */
  DIR_UP: 9,                       /**< u */
  DIR_DOWN: 10,                    /**< d */
};
