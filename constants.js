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
  
  /** Define paths */
  PATH_ADVENTURER: 1,
  PATH_ARCANIST: 2,
  PATH_ARSONIST: 3,
  PATH_ASCENDED: 4,
  PATH_ASSASSIN: 5,
  PATH_CHEMIST: 6,
  PATH_DRAGONKIN: 7,
  PATH_DRUID: 8,
  PATH_ENGINEER: 9,
  PATH_FARMER: 10,
  PATH_GARDENER: 11,
  PATH_GEOLOGIST: 12,
  PATH_GLADIATOR: 13,
  PATH_HUNTER: 14,
  PATH_MAGE: 15,
  PATH_MEDIC: 16,
  PATH_MONK: 17,
  PATH_NECROMANCER: 18,
  PATH_NINJA: 19,
  PATH_PEACEMAKER: 20,
  PATH_PHEONIX: 21,
  PATH_PRIEST: 22,
  PATH_RANGER: 23,
  PATH_SCIENTIST: 24,
  PATH_SEER: 26,
  PATH_SHAMAN: 27,
  PATH_SORCERER: 28,
  PATH_PSYCHIC: 29,
  PATH_SUMMONER: 30,
  PATH_THIEF: 31,
  PATH_TORTURER: 32,
  PATH_TRAVELER: 33,
  PATH_WARLOCK: 34,
  PATH_WARRIOR: 35,
  PATH_WITCH_DOCTOR: 36,
  PATH_WIZARD: 37,
  
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
  
  directionNames: [`north`, `northeast`, `east`, `southeast`, `south`,
                   `southwest`, `west`, `northwest`, `up`, `down`],
  
  directionShortNames: [`n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `nw`, `u`, `d`],
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
