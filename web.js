/** Require external modules */
const express = require(`express`);
const ezobjects = require(`ezobjects`);
const fs = require(`fs`);
const strapped = require(`strapped`);

const mysqlConfig = JSON.parse(fs.readFileSync(`mysql-config.json`));

const db = new ezobjects.MySQLConnection(mysqlConfig);

const app = express();

app.get(`/`, async (req, res, next) => {
  const roomList = await db.query(`SELECT * FROM rooms`);
  
  let markup = ``;
  
  roomList.forEach((row) => {
    markup += `Room: ${row.name}<br>`;
  });
  
  res.send(markup);
});

app.listen(8080, () => {
  console.log(`Web builder app up and runing on port 8080.`);
});