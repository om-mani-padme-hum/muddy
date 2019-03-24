/** Export our constants as a plain object */
module.exports = {
  /** Deployment types */
  DEPLOY_ITEMS_TO_ROOM: 0,
  DEPLOY_MOBILES_TO_ROOM: 1,
  DEPLOY_ITEMS_TO_AREA: 1,
  DEPLOY_MOBILES_TO_AREA: 2,
  DEPLOY_ITEMS_TO_EQUIPMENT: 2,
  DEPLOY_ITEMS_TO_INVENTORY: 3,
  DEPLOY_ITEMS_TO_ITEM: 4,
  
  deploymentNames: [
    `Items To Room`,
    `Mobiles To Room`,
    `Items To Area`,
    `Mobiles To Area`,
    `Items To Equipment`,
    `Items To Inventory`,
    `Items To Item`
  ],
  
  /** Socket states */
  STATE_NAME: 0,
  STATE_OLD_PASSWORD: 1,
  STATE_NEW_PASSWORD: 2,
  STATE_CONFIRM_PASSWORD: 3,
  STATE_MOTD: 4,
  STATE_CONNECTED: 5,
  STATE_DISCONNECTED: 6,
  
  /** Positions */
  POSITION_DEAD: -7,
  POSITION_INCAPACITATED: -6,
  POSITION_SLEEPING: -5,
  POSITION_MEDITATING: -4,
  POSITION_LYING_DOWN: -3,
  POSITION_KNEELING: -2,
  POSITION_SITTING: -1,
  POSITION_STANDING: 0,
  POSITION_FIGHTING: 1,
    
  POSITIONS_ALL: [-7, -6, -5, -4, -3, -2, -1, 0, 1],
  POSITIONS_AWAKE: [-3, -2, -1, 0, 1],
  POSITIONS_MOBILE: [-2, -1, 0, 1],
  POSITIONS_SAFE: [-5, -4, -3, -2, -1, 0],
  POSITIONS_AWAKE_AND_SAFE: [-3, -2, -1, 0],
  
  /** Sex */
  SEX_MALE: 0,
  SEX_FEMALE: 1,
  
  /** Define VT100 terminal modifiers */
  VT100_CLEAR: `\x1b[0m`,
  VT100_HIDE_TEXT: `\x1b[8m`,
  
  /** Define item rarities */
  RARITY_COMMON: 0,
  RARITY_UNCOMMON: 1,
  RARITY_RARE: 2,
  RARITY_EPIC: 3,
  RARITY_LEGENDARY: 4,
  
  /** Define item flags */
  ITEM_CONTAINER: 0,
  ITEM_FIXED: 1,
  ITEM_CLOSED: 2,
  ITEM_LOCKED: 3,
  ITEM_CAN_DRINK: 4,
  ITEM_CAN_EAT: 5,
  ITEM_CAN_LAY_DOWN: 6,
  ITEM_CAN_KNEEL: 7,
  ITEM_CAN_SIT: 8,
  ITEM_CAN_OPEN_CLOSE: 9,
  ITEM_CAN_LOCK: 10,

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
  SLOT_FOREARMS: 8,
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
    `Forearms`,
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
  ELEMENT_FIRE: 2,
  ELEMENT_LIFE: 3,
  ELEMENT_WATER: 4,
  
  /** Define paths */
  PATH_DRUID: 0,       /** Air,   Earth, & Water */
  PATH_MAGE: 1,        /** Air,   Fire,  & Water */
  PATH_NECROMANCER: 2, /** Air,   Fire,  & Life */
  PATH_PRIEST: 3,      /** Air,   Life,  & Water */
  PATH_RANGER: 4,      /** Air,   Earth, & Life */
  PATH_SHAMAN: 5,      /** Earth, Fire,  & Life */
  PATH_SORCERER: 6,    /** Earth, Fire,  & Water */
  PATH_THIEF: 7,       /** Fire,  Life,  & Water */
  PATH_WARRIOR: 8,     /** Air,   Earth, & Fire */
  PATH_WIZARD: 9,      /** Earth, Life,  & Water */
  
  pathNames: [
    `Druid`,
    `Mage`,
    `Necromancer`,
    `Priest`,
    `Ranger`,
    `Shaman`,
    `Sorcerer`,
    `Thief`,
    `Warrior`,
    `Wizard`
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
