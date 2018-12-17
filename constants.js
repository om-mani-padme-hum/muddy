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
  ITEM_PLACEHOLDER: 1,
  ITEM_CONTAINER: 2,
  ITEM_FIXED: 3,
  
  /** Define item types */
  ITEM_OTHER: 0,
  ITEM_ARMOR: 1,
  ITEM_1H_WEAPON: 2,
  ITEM_2H_WEAPON: 3,
  ITEM_HELD: 4,
  ITEM_SHIELD: 5,
  
  itemNames: [
    `Other`,
    `Armor`,
    `1H Weapon`,
    `2H Weapon`,
    `Held Item`,
    `Shield`
  ],
  
  /** Define slot flags */
  SLOT_NONE: 0,
  SLOT_HEAD: 1,
  SLOT_FACE: 2,
  SLOT_NECK: 3,
  SLOT_SHOULDERS: 4,
  SLOT_CHEST: 5,
  SLOT_BACK: 6,
  SLOT_ARMS: 7,
  SLOT_WRISTS: 8,
  SLOT_GLOVES: 9,
  SLOT_WAIST: 10,
  SLOT_LEGS: 11,
  SLOT_FEET: 12,
  SLOT_WIELD: 13,
  
  slotNames: [
    `None`,
    `Head`,
    `Face`,
    `Neck`,
    `Shoulders`,
    `Chest`,
    `Back`,
    `Arms`,
    `Wrists`,
    `Gloves`,
    `Waist`,
    `Legs`,
    `Feet`,
    `Wield`
  ],
  
  /** Define affect flags */
  AFFECT_CLOAKED: 0,
  AFFECT_SAFE: 1,
  
  affectNames: [
    `Cloaked`,
    `Safe`
  ],
  
  /** Define element flags */
  ELEMENT_AIR: 0,
  ELEMENT_EARTH: 1,
  ELEMENT_ELECTROMAGNETISM: 2,
  ELEMENT_FIRE: 3,
  ELEMENT_LIFE: 4,
  ELEMENT_METAL: 5,
  ELEMENT_SPACE: 6,
  ELEMENT_TIME: 7,
  ELEMENT_WATER: 8,
  
  /** Define paths */
  PATH_MAGE: 0,      /** Black Magic */
  PATH_WARRIOR: 1,   /** Heavy/Tank Melee */
  PATH_SHAMAN: 2,    /** Red Magic */
  PATH_CELESTIAL: 3, /** White Magic */
  PATH_RANGER: 4,    /** Light/Ranged Melee */

  pathNames: [
    `Mage`,
    `Warrior`,
    `Shaman`,
    `Celestial`,
    `Ranger`
  ],

  /** Define direction flags */
  DIR_NORTH: 0,                    /** n */
  DIR_NORTHEAST: 1,                /** ne */
  DIR_EAST: 2,                     /** e */
  DIR_SOUTHEAST: 3,                /** se */
  DIR_SOUTH: 4,                    /** s */
  DIR_SOUTHWEST: 5,                /** sw */
  DIR_WEST: 6,                     /** w */
  DIR_NORTHWEST: 7,                /** nw */
  DIR_UP: 8,                       /** u */
  DIR_DOWN: 9,                     /** d */
  
  /** Define direction flag lookup by name */
  directions: {
    north: 0,
    northeast: 1,
    east: 2,
    southeast: 3,
    south: 4,
    southwest: 5,
    west: 6,
    northwest: 7,
    up: 8,
    down: 9,
    ne: 1,
    se: 3,
    sw: 5,
    nw: 7
  },
  
  /** Define direction name lookup by direction flag */
  directionNames: [`north`, `northeast`, `east`, `southeast`, `south`,
                   `southwest`, `west`, `northwest`, `up`, `down`],
  
  /** Define direction short name lookup by direction flag */
  directionShortNames: [`n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `nw`, `u`, `d`],
  
  /** Define direction opposites by direction flag */
  directionOpposites: [4, 5, 6, 7, 0, 1, 2, 3, 9, 8],
  
  /** Define start room */
  START_ROOM: 1,
  
  /** Define default port */
  DEFAULT_PORT: 7000,
  
  /** Define default welcome */
  DEFAULT_WELCOME: [`\r\n`.repeat(3),
                    `                              W E L C O M E    T O\r\n`,
                    `\r\n`.repeat(2),
                    `                                          _     _\r\n`,
                    `                          /\\/\\  _   _  __| | __| |_   _\r\n`,
                    `                         /    \\| | | |/ _' |/ _' | | | |\r\n`,
                    `                        / /\\/\\ \\ |_| | (_| | (_| | |_| |\r\n`,
                    `                        \\/    \\/\\__,_|\\__,_|\\__,_|\\__, |\r\n`,
                    `                                                  |___/\r\n`,
                    `\r\n`,
                    `                              Created by Rich Lowe\r\n`,
                    `                                  MIT Licensed\r\n`,
                    `\r\n`.repeat(8),
                    `Hello, what is your name? `].join(``),
    
  /** Define default message of the day */
  DEFAULT_MOTD: [`\r\n`,
                 `--------------------------------------------------------------------------------\r\n`,
                 `Message of the day:\r\n`,
                 `\r\n`,
                 `Current features:\r\n`,
                 `  * #CC#Bo#Pl#Ro#Yr#Gs#W!#n\r\n`,
                 `  * Movement in all directions\r\n`,
                 `  * Full get/drop/put/wear/remove/wield object interaction\r\n`,
                 `  * Looking at rooms, items, mobiles, users, in containers\r\n`,
                 `  * Admin commands for goto, alist, astat, rlist, rstat, ilist, istat, mlist, \r\n`,
                 `    mstat, and ustat\r\n`,
                 `  * Create command can so far create areas/rooms/prototypes/instances\r\n`,
                 `  * Ability to look at rooms, or at item/user/mobile descriptions\r\n`,
                 `  * Saving of users, new and existing, taking over body\r\n`,
                 `\r\n`,
                 `--------------------------------------------------------------------------------\r\n`,
                 `Press ENTER to continue...\r\n`,
                 `--------------------------------------------------------------------------------`].join(``)
};
