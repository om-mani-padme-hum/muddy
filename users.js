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
      { name: `password`, type: `varchar`, length: 512 },
      { name: `salt`, type: `varchar`, length: 32 },
      { name: `experience`, type: `int` },
      { name: `promptFormat`, type: `varchar`, length: 64, default: `\r\n[$xpxp] <$hphp $mm $ee> ` },
      { name: `fightPromptFormat`, type: `varchar`, length: 64, default: `\r\n[$xpxp] <$hphp $mm $ee> ` },
      { name: `title`, type: `varchar`, length: 32 },
      { name: `socket`, instanceOf: `Socket`, store: false },
      { name: `state`, type: `int`, default: world.constants().STATE_NAME, store: false },
      { name: `room`, instanceOf: `Room`, loadTransform: x => new world.Room({ id: x }) },
      { name: `equipment`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } },
      { name: `inventory`, type: `Array`, arrayOf: { instanceOf: `ItemInstance` } }
    ],
    indexes: [
      { name: `name`, type: `BTREE`, columns: [ `name` ] }
    ]
  };
};
