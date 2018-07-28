/** Require external modules */
const express = require(`express`);
const strapped = require(`strapped`);

module.exports.webBuilder = (world, port = 7001) => {
  const app = express();

  const template = () => {
    const p = new strapped.Page();

    /** Start content */
    p.html();
    p.head();

    /** Append required Bootstrap 4 meta tags */
    p.meta().charset(`utf-8`);
    p.meta().name(`viewport`).content(`width=device-width, initial-scale=1, shrink-to-fit=no`);

    /** Append example title */
    p.title().text(`Muddy Builder`);

    /** Append required Bootstrap 4 JavaScript */
    p.script().src(`https://code.jquery.com/jquery-3.2.1.slim.min.js`);
    p.script().src(`https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js`);
    p.script().src(`https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js`);

    /** Append required Bootstrap 4 CSS */
    p.link().rel(`stylesheet`).href(`https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css`);

    /** Append body */
    p.body().addClass(`px-5`);
    
    return p;
  };
  
  app.get(`/`, async (req, res, next) => {
    const p = template();
    
    p.row();
    p.col();
    p.h2().addClass(`my-3`).color(`primary`).text(`Area List`);
    p.row();
    p.col().size(4);
    p.table().small(true).bordered(true).striped(true);
    p.tableHead();
    p.tableRow(`tableHead`);
    p.tableHeader().addClass(`text-center`).text(`ID`);
    p.tableHeader().text(`Area Name`);
    p.tableHeader().style(`width: 25px;`);
    p.tableBody();

    world.areas().forEach((area) => {
      p.tableRow();
      p.tableData().addClass(`text-center`).text(area.id());
      p.tableData();
      p.anchor(`tableData`).href(`/areas/${area.id()}`).text(area.name());
      p.tableData().addClass(`p-1`).style(`width: 25px;`);
      p.buttonLink(`tableData`).href(`/areas/${area.id()}?a=delete`).color(`danger`).addClass(`btn-sm py-0 px-1`).text(`X`);
    });

    res.send(p.render());
  });
  
  app.get(`/areas/:id`, async (req, res, next) => {
    const area = world.areas().find(x => x.id() == req.params.id);
    const p = template();
    
    p.row();
    p.col().size(4).addClass(`text-center`);
    p.h2().addClass(`my-3`).color(`primary`).text(`Room List`);
    p.col().size(4).addClass(`text-center`);
    p.h2().addClass(`my-3`).color(`primary`).text(`Mobile List`);
    p.col().size(4).addClass(`text-center`);
    p.h2().addClass(`my-3`).color(`primary`).text(`Item List`);
    p.row();
    p.col().size(4);
    p.table().small(true).bordered(true).striped(true);
    p.tableHead();
    p.tableRow(`tableHead`);
    p.tableHeader().addClass(`text-center`).text(`ID`);
    p.tableHeader().text(`Room Name`);
    p.tableHeader().style(`width: 25px;`);
    p.tableBody();

    area.rooms().forEach((room) => {
      p.tableRow();
      p.tableData().addClass(`text-center`).text(room.id());
      p.tableData();
      p.anchor(`tableData`).href(`/rooms/${room.id()}`).text(room.name());
      p.tableData().addClass(`p-1`).style(`width: 25px;`);
      p.buttonLink(`tableData`).href(`/rooms/${room.id()}?a=delete`).color(`danger`).addClass(`btn-sm py-0 px-1`).text(`X`);
    });
    
    p.col().size(4);
    p.table().small(true).bordered(true).striped(true);
    p.tableHead();
    p.tableRow(`tableHead`);
    p.tableHeader().addClass(`text-center`).text(`ID`);
    p.tableHeader().text(`Mobile Name`);
    p.tableHeader().style(`width: 25px;`);
    p.tableBody();

    area.mobilePrototypes().forEach((mobile) => {
      p.tableRow();
      p.tableData().addClass(`text-center`).text(mobile.id());
      p.tableData();
      p.anchor(`tableData`).href(`/mobiles/${mobile.id()}`).text(mobile.name());
      p.tableData().addClass(`p-1`).style(`width: 25px;`);
      p.buttonLink(`tableData`).href(`/mobiles/${mobile.id()}?a=delete`).color(`danger`).addClass(`btn-sm py-0 px-1`).text(`X`);
    });

    p.col().size(4);
    p.table().small(true).bordered(true).striped(true);
    p.tableHead();
    p.tableRow(`tableHead`);
    p.tableHeader().addClass(`text-center`).text(`ID`);
    p.tableHeader().text(`Item Name`);
    p.tableHeader().style(`width: 25px;`);
    p.tableBody();

    area.itemPrototypes().forEach((item) => {
      p.tableRow();
      p.tableData().addClass(`text-center`).text(item.id());
      p.tableData();
      p.anchor(`tableData`).href(`/items/${item.id()}`).text(item.name());
      p.tableData().addClass(`p-1`).style(`width: 25px;`);
      p.buttonLink(`tableData`).href(`/items/${item.id()}?a=delete`).color(`danger`).addClass(`btn-sm py-0 px-1`).text(`X`);
    });
    
    res.send(p.render());
  });
  
  app.get(`/rooms/:id`, async (req, res, next) => {
    const room = world.rooms().find(x => x.id() == req.params.id);
    const p = template();
    
    p.row();
    p.col();
    p.h2().addClass(`my-3`).color(`primary`).text(`Room Details`);
    p.row();
    p.col().size(7);
    p.form().method(`post`).action(`/rooms/:id`);
    p.input().cols(8).type(`text`).name(`name`).label(`Name:`).value(room.name());
    p.row(`form`);
    p.textarea().label(`Description:`).rows(8).name(`description`).cols(12).text(room.description());
    
    res.send(p.render());
  });
  
  app.get(`/mobiles/:id`, async (req, res, next) => {
    const mobile = world.mobilePrototypes().find(x => x.id() == req.params.id);
    const p = template();
    
    p.row();
    p.col();
    p.h2().addClass(`my-3`).color(`primary`).text(`Mobile Details`);
    p.row();
    p.col().size(7);
    p.form().method(`post`).action(`/mobiles/:id`);
    p.input().cols(8).type(`text`).name(`name`).label(`Name:`).value(mobile.name());
    p.row(`form`);
    p.textarea().label(`Description:`).rows(3).name(`description`).cols(12).text(mobile.description());
    
    res.send(p.render());
  });
  
  app.get(`/items/:id`, async (req, res, next) => {
    const item = world.itemPrototypes().find(x => x.id() == req.params.id);
    const p = template();
    
    p.row();
    p.col();
    p.h2().addClass(`my-3`).color(`primary`).text(`Item Details`);
    p.row();
    p.col().size(7);
    p.form().method(`post`).action(`/items/:id`);
    p.input().cols(8).type(`text`).name(`name`).label(`Name:`).value(item.name());
    p.row(`form`);
    p.textarea().label(`Description:`).rows(3).name(`description`).cols(12).text(item.description());
    
    res.send(p.render());
  });

  app.listen(port, () => {
    console.log(`Web building app up and runing on port ${port}.`);
  });
};
