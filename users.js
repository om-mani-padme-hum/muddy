/** Configure User object as extension of Character */
module.exports.configUser = (world, ext, extConfig) => {
  return {
    tableName: `users`,
    className: `User`,
    extends: ext,
    extendsConfig: extConfig,
    otherSearchField: `name`,
    properties: [
      { name: `addresses`, type: `array`, arrayOf: { type: `varchar`, length: 32 } },
      { name: `equipment`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `experience`, type: `int` },
      { name: `fightPromptFormat`, type: `varchar`, length: 64, default: `\r\n[$xpxp] <$hphp $mm $ee> ` },
      { name: `inventory`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `outBuffer`, type: `text`, store: false },
      { name: `password`, type: `varchar`, length: 512 },
      { name: `promptFormat`, type: `varchar`, length: 64, default: `\r\n[$xpxp] <$hphp $mm $ee> ` },
      { name: `room`, instanceOf: `Room`, loadTransform: x => new world.Room({ id: x }) },
      { name: `salt`, type: `varchar`, length: 32 },
      { name: `socket`, instanceOf: `Socket`, store: false },
      { name: `state`, type: `int`, default: world.constants().STATE_NAME, store: false },
      { name: `title`, type: `varchar`, length: 32 }
    ],
    indexes: [
      { name: `name`, type: `BTREE`, columns: [ `name` ] }
    ]
  };
};
