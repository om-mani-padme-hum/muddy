/** Require external modules */
const ezobjects = require(`ezobjects`);

/** Configure item object */
const configItem = {
  tableName: `items`,
  className: `Item`,
  properties: [
    { name: `id`, type: `number`, mysqlType: `int`, autoIncrement: true, primary: true, setTransform: x => parseInt(x) },
    { name: `name`, type: `string`, mysqlType: `varchar`, length: 32 },
    { name: `names`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => x.toString()), saveTransform: x => x.join(` `), loadTransform: x => x.split(` `) },
    { name: `description`, type: `string`, mysqlType: `text` },
    { name: `type`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
    { name: `slot`, type: `number`, mysqlType: `int`, setTransform: x => parseInt(x) },
    { name: `flags`, type: `Array`, mysqlType: `text`, setTransform: x => x.map(x => parseInt(x)), saveTransform: x => x.join(`,`), loadTransform: x => x.split(`,`) },
    { name: `area`, instanceOf: `Area` },
    { name: `character`, instanceOf: `Character` },
    { name: `container`, instanceOf: `Item` },
    { name: `contains`, type: `Array`, setTransform: x => x.map(x => ezobjects.instanceOf(x, `Item`) ? null : x) },
    { name: `room`, instanceOf: `Room` }
  ],
  indexes: [
    { name: `name`, type: `BTREE`, columns: [ `name` ] },
    { name: `type`, type: `BTREE`, columns: [ `type` ] },
    { name: `slot`, type: `BTREE`, columns: [ `slot` ] }
  ]
};

/** Create item object */
ezobjects.createObject(configItem);

/** Create table if it doesn't exist */
ezobjects.createTable(configItem);

/** Export configs*/
module.exports.configItem = configItem;

/** Export objects */
module.exports.Item = Item;
