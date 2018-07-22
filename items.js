/** Configure Item object */
module.exports.configItem = (world) => {
  return {
    tableName: `items`,
    className: `Item`,
    properties: [
      { name: `id`, type: `int` },
      { name: `name`, type: `varchar`, length: 32 },
      { name: `names`, type: `Array`, arrayOf: { type: `varchar`, length: 32 } },
      { name: `description`, type: `varchar`, length: 512 },
      { name: `roomDescription`, type: `varchar`, length: 80 },
      { name: `details`, type: `object` },
      { name: `type`, type: `int` },
      { name: `slot`, type: `int` },
      { name: `flags`, type: `Array`, arrayOf: { type: `int` } },
      { name: `contents`, type: `Array`, arrayOf: { instanceOf: `Item` } }
    ],
    indexes: [
      { name: `type`, type: `BTREE`, columns: [ `type` ] },
      { name: `slot`, type: `BTREE`, columns: [ `slot` ] }
    ]
  };
};
