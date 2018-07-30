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
  ITEM_EQUIPPABLE: 1,
  ITEM_CONTAINER: 2,
  ITEM_FIXED: 3,
  
  /** Define item types */
  ITEM_OTHER: 0,
  ITEM_HEAD: 1,
  ITEM_FACE: 2,
  ITEM_NECK: 3,
  ITEM_SHOULDERS: 4,
  ITEM_CHEST: 5,
  ITEM_BACK: 6,
  ITEM_ARMS: 7,
  ITEM_WRISTS: 8,
  ITEM_GLOVES: 9,
  ITEM_WAIST: 10,
  ITEM_LEGS: 11,
  ITEM_FEET: 12,
  ITEM_1H_WEAPON: 13,
  ITEM_2H_WEAPON: 14,
  ITEM_HELD: 15,
  ITEM_SHIELD: 16,
  
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
  
  /** Define user flags */
  AFFECT_CLOAKED: 1,
  
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
  PATH_ARCANIST: 0,
  PATH_ARSONIST: 1,
  PATH_ASCENDED: 2,
  PATH_ASSASSIN: 3,
  PATH_CHEMIST: 4,
  PATH_DRAGONSLAYER: 5,
  PATH_DRUID: 6,
  PATH_ENGINEER: 7,
  PATH_EXPLORER: 8,
  PATH_FARMER: 9,
  PATH_GARDENER: 10,
  PATH_GEOLOGIST: 11,
  PATH_GLADIATOR: 12,
  PATH_HUNTER: 13,
  PATH_MAGE: 14,
  PATH_MEDIC: 15,
  PATH_MONK: 16,
  PATH_NECROMANCER: 17,
  PATH_NINJA: 18,
  PATH_PEACEMAKER: 19,
  PATH_PHEONIX: 20,
  PATH_PRIEST: 21,
  PATH_RANGER: 22,
  PATH_SCIENTIST: 23,
  PATH_SEER: 24,
  PATH_SHAMAN: 25,
  PATH_SORCERER: 26,
  PATH_PSYCHIC: 27,
  PATH_SABOTEUR: 28,
  PATH_SUMMONER: 29,
  PATH_THIEF: 30,
  PATH_TRAVELER: 31,
  PATH_WARLOCK: 32,
  PATH_WARRIOR: 33,
  PATH_WITCH_DOCTOR: 34,
  PATH_WIZARD: 35,
  
  /** Define pair of elemental specializations by path flag */
  pathElements: [
    [2, 8], [0, 3], [2, 6], [5, 6], [5, 8], [0, 6], [1, 8], [2, 5], [6, 8], 
    [4, 7], [4, 6], [1, 7], [3, 5], [1, 6], [0, 2], [4, 5], [0, 4], [3, 4], 
    [0, 7], [3, 8], [2, 3], [4, 8], [2, 4], [0, 1], [5, 7], [2, 7], [7, 8], 
    [1, 4], [3, 6], [1, 2], [0, 5], [6, 7], [3, 7], [1, 5], [1, 3], [0, 8]
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
                 `New features:\r\n`,
                 `  * Basic object interaction, except 'put' which is coming soon\r\n`,
                 `  * All directions implemented\r\n`,
                 `  * Admin commands for goto, rstat, istat, mstat, ustat, astat\r\n`,
                 `  * Create command can so far create areas/rooms/prototypes/instances\r\n`,
                 `  * Ability to look at rooms, or at item/user/mobile/detail descriptions\r\n`,
                 `  * Saving of users, new and existing, taking over body\r\n`,
                 `\r\n`,
                 `--------------------------------------------------------------------------------\r\n`,
                 `Press ENTER to continue...\r\n`,
                 `--------------------------------------------------------------------------------`].join(``)
};
