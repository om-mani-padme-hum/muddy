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
  VT100_CLEAR: `\x1b[0m`,
  VT100_HIDE_TEXT: `\x1b[8m`,
    
  /** Define item flags */
  OBJECT_WEARABLE: 1,
  OBJECT_WIELDABLE_1H: 2,
  OBJECT_WIELDABLE_2H: 3,
  OBJECT_CONTAINER: 4,
    
  /** Define deployment flags */
  DEPLOY_MOBILE_TO_ROOM: 1,
  DEPLOY_ITEM_TO_ROOM: 2,
  DEPLOY_ITEM_TO_MOBILE: 3,
  DEPLOY_ITEM_TO_ITEM: 4,
  
  /** Define direction flags */
  DIR_NORTH: 0,                    /**< n */
  DIR_NORTHEAST: 1,                /**< ne */
  DIR_EAST: 2,                     /**< e */
  DIR_SOUTHEAST: 3,                /**< se */
  DIR_SOUTH: 4,                    /**< s */
  DIR_SOUTHWEST: 5,                /**< sw */
  DIR_WEST: 6,                     /**< w */
  DIR_NORTHWEST: 7,                /**< nw */
  DIR_UP: 8,                       /**< u */
  DIR_DOWN: 9,                    /**< d */
  
  dirNames: [`north`, `northeast`, `east`, `southeast`, `south`,
             `southwest`, `west`, `northwest`, `up`, `down`],
  
  dirShortNames: [`n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `nw`, `u`, `d`],
  dirOpposite: [4, 5, 6, 7, 0, 1, 2, 3, 9, 8],
  
  /** Define start room */
  START_ROOM: 1,
  
  /** Define default port */
  DEFAULT_PORT: 7000,
  
  /** Define default welcome */
  DEFAULT_WELCOME: [`\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `                              W E L C O M E    T O\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `                                          _     _\r\n`,
                    `                          /\\/\\  _   _  __| | __| |_   _\r\n`,
                    `                         /    \\| | | |/ _' |/ _' | | | |\r\n`,
                    `                        / /\\/\\ \\ |_| | (_| | (_| | |_| |\r\n`,
                    `                        \\/    \\/\\__,_|\\__,_|\\__,_|\\__, |\r\n`,
                    `                                                  |___/\r\n`,
                    `\r\n`,
                    `                              Created by Rich Lowe\r\n`,
                    `                                  MIT Licensed\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `\r\n`,
                    `Hello, what is your name? `].join(``),
    
  /** Define default message of the day */
  DEFAULT_MOTD: [`--------------------------------------------------------------------------------\r\n`,
                 `Message of the day:\r\n`,
                 `\r\n`,
                 `New features:\r\n`,
                 `  * Three default rooms to test movement\r\n`,
                 `  * All directions implemented\r\n`,
                 `  * Ability to look at rooms and see exits\r\n`,
                 `  * Saving of users, new and existing\r\n`,
                 `\r\n`,
                 `--------------------------------------------------------------------------------\r\n`,
                 `Press ENTER to continue...\r\n`,
                 `--------------------------------------------------------------------------------`].join(``)
};
