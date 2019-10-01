/** Export our constants as a plain object */
module.exports = {
  /** Define affect flags */
  AFFECT_CLOAKED: 0,
  AFFECT_SAFE: 1,
  
  affectNames: [
    `Cloaked`,
    `Safe`
  ],
  
  affectShortcuts: [
    `cloaked`,
    `safe`
  ],
  
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
                 `--------------------------------------------------------------------------------`].join(``),
  
  /** Define deployment types */
  deploymentTypes: {
    ITEMS_TO_ROOM: 0,
    MOBILES_TO_ROOM: 1,
    ITEMS_TO_AREA: 2,
    MOBILES_TO_AREA: 3,
    ITEMS_TO_EQUIPMENT: 4,
    ITEMS_TO_INVENTORY: 5,
    ITEMS_TO_CONTAINER: 6
  },
  
  deploymentTypeNames: [
    `Items To Room`,
    `Mobiles To Room`,
    `Items To Area`,
    `Mobiles To Area`,
    `Items To Equipment`,
    `Items To Inventory`,
    `Items To Container`
  ],
  
  /** Define direction flags */
  directions: {
    NORTH: 0,                    /** n */
    NORTHEAST: 1,                /** ne */
    EAST: 2,                     /** e */
    SOUTHEAST: 3,                /** se */
    SOUTH: 4,                    /** s */
    SOUTHWEST: 5,                /** sw */
    WEST: 6,                     /** w */
    NORTHWEST: 7,                /** nw */
    UP: 8,                       /** u */
    DOWN: 9,                     /** d */
  },
  
  /** Define direction name lookup by direction flag */
  directionNames: [`north`, `northeast`, `east`, `southeast`, `south`,
                   `southwest`, `west`, `northwest`, `up`, `down`],
  
  /** Define direction lookup by name whether short or long */
  directionsLookup: {
    north: 0,                    /** n */
    northeast: 1,                /** ne */
    east: 2,                     /** e */
    southeast: 3,                /** se */
    south: 4,                    /** s */
    southwest: 5,                /** sw */
    west: 6,                     /** w */
    northwest: 7,                /** nw */
    up: 8,                       /** u */
    down: 9,                     /** d */
    ne: 1,                       /** ne */
    se: 3,                       /** se */
    sw: 5,                       /** sw */
    nw: 7                        /** nw */
  },
  
  /** Define direction short name lookup by direction flag */
  directionShortNames: [`n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `nw`, `u`, `d`],
  
  /** Define direction opposites by direction flag */
  directionOpposites: [4, 5, 6, 7, 0, 1, 2, 3, 9, 8],

  /** Define item flags */
  itemFlags: {
    CONTAINER: 0,
    FIXED: 1,
    CLOSED: 2,
    LOCKED: 3,
    CAN_DRINK: 4,
    CAN_EAT: 5,
    CAN_LAY_DOWN: 6,
    CAN_KNEEL: 7,
    CAN_SIT: 8,
    CAN_OPEN_CLOSE: 9,
    CAN_LOCK: 10,
    FLAMMABLE: 11
  },
  
  itemFlagNames: [
    `Container`,
    `Fixed`,
    `Closed`,
    `Locked`,
    `Can Drink`,
    `Can Eat`,
    `Can Lay Down On`,
    `Can Kneel On`,
    `Can Sit On`,
    `Can Open/Close`,
    `Can Lock`,
    `Flammable`
  ],
  
  itemFlagShortcuts: [
    `container`,
    `fixed`,
    `closed`,
    `locked`,
    `candrink`,
    `caneat`,
    `canlaydown`,
    `cankneel`,
    `cansit`,
    `canopenclose`,
    `canlock`,
    `flammable`
  ],

  /** Define item types */
  itemTypes: {
    OTHER: 0,
    ARMOR: 1,
    WEAPON_1H: 2,
    WEAPON_2H: 3,
    HELD: 4,
    SHIELD: 5
  },
  
  itemTypesWieldable: [2, 3, 4, 5],
  
  itemTypeNames: [
    `Other`,
    `Armor`,
    `1H Weapon`,
    `2H Weapon`,
    `Held Item`,
    `Shield`
  ],
  
  itemTypeShortcuts: [
    `other`,
    `armor`,
    `1hweapon`,
    `2hweapon`,
    `held`,
    `shield`
  ],
  
  /** Define paths */
  paths: {
    DRUID: 0,       
    MAGE: 1,        
    NECROMANCER: 2, 
    RANGER: 3,
    SHAMAN: 4,
    WARRIOR: 5,     
    WIZARD: 6
  },
  
  pathNames: [
    `Druid`,
    `Mage`,
    `Necromancer`,
    `Ranger`,
    `Shaman`,
    `Warrior`,
    `Wizard`
  ],
  
  pathShortcuts: [
    `druid`,
    `mage`,
    `necromancer`,
    `ranger`,
    `shaman`,
    `warrior`,
    `wizard`
  ],
  
  /** Define positions */
  positions: {
    DEAD: -7,
    INCAPACITATED: -6,
    SLEEPING: -5,
    MEDITATING: -4,
    LYING_DOWN: -3,
    KNEELING: -2,
    SITTING: -1,
    STANDING: 0,
    FIGHTING: 1
  },
    
  positionsAll: [-7, -6, -5, -4, -3, -2, -1, 0, 1],
  positionsAwake: [-3, -2, -1, 0, 1],
  positionsMobile: [-2, -1, 0, 1],
  positionsSafe: [-5, -4, -3, -2, -1, 0],
  positionsAwake_AND_SAFE: [-3, -2, -1, 0],
  
  positionNames: {
    '-7': `Dead`,
    '-6': `Incapacitated`,
    '-5': `Sleeping`,
    '-4': `Meditating`,
    '-3': `Lying Down`,
    '-2': `Kneeling`,
    '-1': `Sitting`,
    '0': `Standing`,
    '1': `Fighting`
  },
  
  /** Define item rarities */
  rarities: {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    LEGENDARY: 3,
    ANCIENT: 4
  },
  
  /** Define item rarity names */
  rarityNames: [
    `Common`,
    `Uncommon`,
    `Rare`,
    `Legendary`,
    `Ancient`
  ],
  
  /** Define races */
  races: {
    CENTAUR: 0,
    DWARF: 1,
    ELF: 2,
    GIANT: 3,
    GOBLIN: 4,
    HALFLING: 5,
    HUMAN: 6,
    MERFOLK: 7,
    MINOTAUR: 8,
    ORC: 9,
    SATYR: 10,
    WYRM: 11
  },
    
  raceNames: [
    `Centaur`,
    `Dwarf`,
    `Elf`,
    `Giant`,
    `Goblin`,
    `Halfling`,
    `Human`,
    `Merfolk`,
    `Minotaur`,
    `Orc`,
    `Satyr`,
    `Wyrm`
  ],
  
  raceShortcuts: [
    `centaur`,
    `dwarf`,
    `elf`,
    `giant`,
    `goblin`,
    `halfling`,
    `human`,
    `merfolk`,
    `minotaur`,
    `orc`,
    `satyr`,
    `wyrm`
  ],
  
  randomnessFactor: 0.15,
  
  /** Define sexes */
  sexes: {
    MALE: 0,
    FEMALE: 1,
    BOTH: 2,
    NONE: 3
  },
  
  sexNames: [
    `Male`,
    `Female`,
    `Both`,
    `None`
  ],
  
  sexShortcuts: [
    `male`,
    `female`,
    `both`,
    `none`
  ],
  
  /** Define item slots */
  slots: {
    NONE: 0,
    HEAD: 1,
    FACE: 2,
    NECK: 3,
    SHOULDERS: 4,
    CHEST: 5,
    BACK: 6,
    ARMS: 7,
    FOREARMS: 8,
    GLOVES: 9,
    WAIST: 10,
    LEGS: 11,
    FEET: 12,
    WIELD: 13
  },
  
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
  
  slotShortcuts: [
    `none`,
    `head`,
    `face`,
    `neck`,
    `shoulders`,
    `chest`,
    `back`,
    `arms`,
    `forearms`,
    `gloves`,
    `waist`,
    `legs`,
    `feet`,
    `wield`
  ],
  
  /** Define start room */
  START_ROOM: 1,
  
  /** Define socket states */
  states: {
    NAME: 0,
    OLD_PASSWORD: 1,
    NEW_PASSWORD: 2,
    CONFIRM_PASSWORD: 3,
    MOTD: 4,
    CONNECTED: 5,
    DISCONNECTED: 6,
  },
  
  statNames: [
    `Accuracy`,
    `Air`,
    `Armor`,
    `Deflection`,
    `Dodge`,
    `Earth`,
    `Fire`,
    `Life`,
    `Power`,
    `Speed`,
    `Water`
  ],
  
  /** Define stat flags */
  stats: {
    ACCURACY: 0,
    AIR: 1,
    ARMOR: 2,
    DEFLECTION: 3,
    DODGE: 4,
    EARTH: 5,
    FIRE: 6,
    LIFE: 7,
    POWER: 8,
    SPEED: 9,
    WATER: 10
  },
  
  /** Define VT100 terminal modifiers */
  VT100_CLEAR: `\x1b[0m`,
  VT100_HIDE_TEXT: `\x1b[8m`
};
