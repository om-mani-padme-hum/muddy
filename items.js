/** Configure item prototype object */
module.exports.configItem = (world) => {
  return {
    tableName: `items`,
    className: `Item`,
    properties: [
      { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
      { name: `area`, type: `Area`, mysqlType: `int`, setTransform: x => typeof x == 'number' ? world.areas().find(y => y.id() == x) : x, saveTransform: x => x.id(), loadTransform: x => world.areas().find(y => y.id() == x) },
      { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
      { name: `names`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => x.toString()), saveTransform: x => x.join(` `), loadTransform: x => x.split(` `) },
      { name: `description`, type: `string`, mysqlType: `text` },
      { name: `type`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `slot`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
      { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    ],
    indexes: [
      { name: `area`, type: `BTREE`, columns: [ `area` ] },
      { name: `type`, type: `BTREE`, columns: [ `type` ] },
      { name: `slot`, type: `BTREE`, columns: [ `slot` ] }
    ]
  };
};
