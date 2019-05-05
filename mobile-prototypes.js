/** Configure MobilePrototype object as extension of Character */
module.exports.configMobilePrototype = (world, ext, extConfig) => {
  return {
    tableName: `mobile_prototypes`,
    className: `MobilePrototype`,
    extends: ext,
    extendsConfig: extConfig,
    properties: [
      { name: `author`, type: `varchar`, length: 32, default: `Anonymous` },
      { name: `created`, type: `datetime`, default: new Date() },
      { name: `description`, type: `varchar`, length: 512, default: `They look like the most boring person you could possibly imagine.` },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 }, default: [`person`] },
      { name: `room`, instanceOf: `Room`, store: false },
      { name: `roomDescription`, type: `varchar`, length: 80, default: `a boring person stands here` },
      { name: `scripts`, type: `Array`, arrayOf: { type: `function` } }
    ]
  };
};
