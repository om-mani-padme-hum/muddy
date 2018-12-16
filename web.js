/** Require external modules */
const express = require(`express`);
const parser = require(`body-parser`);
const querystring = require(`querystring`);
const strapped = require(`strapped`);

module.exports.webBuilder = (world, port = 7001) => {
  const app = express();

  /** Use external body parser middleware to parse POST params into request body */
  app.use(parser.urlencoded({ extended: true }));

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
  
  app.all(`/`, async (req, res, next) => {
    const p = template();
    
    /** If we're processing a new area... */
    if ( req.query.a == `add` ) {
      try {
        /** Create new area */
        const area = new world.Area();

        area.name(req.body.name);
        area.author(req.body.author);
        area.description(req.body.description);
        area.created(new Date());

        /** Insert area in database */
        await area.insert(world.database());
        
        /** Add area to world */
        world.areas().push(area);

        /** Redirect to success message */
        res.redirect(`/?` + querystring.stringify({ success: 1, message: `New area '${req.body.name}' has been created with ID #${area.id()}!` }));
      } catch ( err ) {
        /** Redirect to error message */
        res.redirect(`/?` + querystring.stringify({ error: 1, message: err.message }));
      }
      
      return;
    }
    
    /** Otherwise, if we're deleting an existing area... */
    else if ( req.query.a == `delete` ) {
      try {
        /** Find area in world */
        const area = world.areas().find(x => x.id() == req.query.id);
        
        /** Loop through each item prototype in the area... */
        for ( let i = area.itemPrototypes().length - 1; i >= 0; i-- ) {
          /** Remove item prototype from world */
          world.itemPrototypes().splice(world.itemPrototypes().indexOf(area.itemPrototypes()[i]), 1);
          
          /** Delete item prototype */
          await area.itemPrototypes()[i].delete(world.database());
        }
        
        /** Loop through each mobile prototype in the area... */
        for ( let i = area.mobilePrototypes().length - 1; i >= 0; i-- ) {
          /** Remove mobile prototype from world */
          world.mobilePrototypes().splice(world.mobilePrototypes().indexOf(area.mobilePrototypes()[i]), 1);
          
          /** Delete mobile prototype */
          await area.mobilePrototypes()[i].delete(world.database());
        }
        
        for ( let i = area.rooms().length - 1; i >= 0; i-- ) {
          /** Remove room from world */
          world.rooms().splice(world.rooms().indexOf(area.rooms()[i]), 1);
          
          /** Delete room */
          await area.rooms()[i].delete(world.database());
        }
        
        /** Remove area from world */
        world.areas().splice(world.areas().indexOf(area), 1);

        /** Delete area */
        await area.delete(world.database());
        
        /** Redirect to success message */
        res.redirect(`/?` + querystring.stringify({ success: 1, message: `Area ID #${req.query.id} has been deleted!` }));
      } catch ( err ) {
        /** Redirect to error message */
        res.redirect(`/?` + querystring.stringify({ error: 1, message: err.message }));
      }
      
      return;
    }

    p.row();
    p.col();
    p.h2().color(`primary`).addClass(`my-3`).text(`Area List`);

    /** If we're to display a success message... */
    if ( req.query.success ) {
      /** Display success message */
      p.row();
      p.col().size(6);
      p.alert().color(`success`).dismissable(true).strong(`Success!`).text(req.query.message);
    }

    /** Otherwise, if we're to display an error message */
    else if ( req.query.error ) {
      /** Display error message */
      p.row();
      p.col().size(6);
      p.alert().color(`danger`).dismissable(true).strong(`Error!`).text(req.query.message);
    }
    
    p.row();
    p.col();
    p.button().color(`primary`).attr(`data-toggle`, `modal`).attr(`data-target`, `#addModal`).text(`Add New Area`);
    p.modal().id(`addModal`).middle(true);
    p.modalHeader();
    p.h5(`modalHeader`).addClass(`modal-title`).text(`Add New Area`);
    p.button(`modalHeader`).addClass(`close`).attr(`data-dismiss`, `modal`).text(`&times;`);
    p.modalBody();
    p.form(`modalBody`).method(`POST`).action(`/?a=add`);
    p.input().cols(8).id(`name`).name(`name`).type(`text`).label(`Name:`);
    p.input().cols(6).id(`author`).name(`author`).type(`text`).label(`Author:`);
    p.textarea().cols(12).id(`description`).name(`description`).label(`Description:`).rows(3);
    p.row(`form`);
    p.col().center(true);
    p.button().color(`secondary`).attr(`data-dismiss`, `modal`).text(`Close`);
    p.button().type(`submit`).color(`primary`).text(`Create Area`);

    p.row();
    p.col().size(4);
    p.lineBreak();
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
      p.buttonLink(`tableData`).href(`/?a=delete&id=${area.id()}`).color(`danger`).addClass(`btn-sm py-0 px-1`).text(`X`);
    });
    
    res.send(p.render());
  });
  
  app.all(`/areas/:id`, async (req, res, next) => {
    const area = world.areas().find(x => x.id() == req.params.id);
    const p = template();
    
    /** If we're processing a new room... */
    if ( req.query.a == `addRoom` ) {
      try {
        /** Create new room */
        const room = new world.Room();
        
        room.area(area);
        room.created(new Date());
        room.description(req.body.description);
        room.name(req.body.name);

        /** Insert room in database */
        await room.insert(world.database());
        
        /** Add m room to area */
        area.rooms().push(room);
        
        /** Update area */
        await area.update(world.database());
        
        /** Add room to world */
        world.rooms().push(room);

        /** Redirect to success message */
        res.redirect(`/areas/${req.params.id}/?` + querystring.stringify({ success: 1, message: `New room '${req.body.name}' has been created with ID #${room.id()}!` }));
      } catch ( err ) {
        /** Redirect to error message */
        res.redirect(`/areas/${req.params.id}/?` + querystring.stringify({ error: 1, message: err.message }));
      }
      
      return;
    }
    
    /** Otherwise, if we're deleting an existing room... */
    else if ( req.query.a == `deleteRoom` ) {
      try {
        /** Find area in world */
        const area = world.areas().find(x => x.id() == req.params.id);
        
        /** Find room in area */
        const room = area.rooms().find(x => x.id() == req.query.id);
        
        /** Find limbo room in world */
        const limbo = world.rooms().find(x => x.id() == 1);
        
        /** Loop through each user in the room... */
        for ( let i = room.users().length - 1; i >= 0; i-- ) {
          /** Move any users from directory to limbo room */
          await world.characterToRoom(room.users()[i], limbo);
        }
        
        /** Loop through each item in the room... */
        for ( let i = room.items().length - 1; i >= 0; i-- ) {
          /** Delete item prototype */
          await room.items()[i].delete(world.database());
        }
        
        /** Loop through each mobile in the room... */
        for ( let i = room.mobiles().length - 1; i >= 0; i-- ) {
          /** Delete mobile prototype */
          await room.mobiles()[i].delete(world.database());
        }
        
        /** Loop through each exit in the room... */
        for ( let i = room.exits().length - 1; i >= 0; i-- ) {
          /** Delete exit from target room */
          await room.exits()[i].target().exits().find(x => x.target().id() == room.id()).delete(world.database());
          
          /** Delete exit from room */
          await room.exits()[i].delete(world.database());
        }
        
        /** Remove room from area */
        area.rooms().splice(area.rooms().indexOf(room), 1);
        
        /** Save area */
        await area.update(world.database());
        
        /** Remove room from world */
        world.rooms().splice(world.rooms().indexOf(room), 1);

        /** Delete room */
        await room.delete(world.database());
        
        /** Redirect to success message */
        res.redirect(`/areas/${req.params.id}/?` + querystring.stringify({ success: 1, message: `Room ID #${req.query.id} has been deleted!` }));
      } catch ( err ) {
        /** Redirect to error message */
        res.redirect(`/areas/${req.params.id}/?` + querystring.stringify({ error: 1, message: err.message }));
      }
      
      return;
    }
    
    /** Otherwise, if we're processing a new mobile... */
    else if ( req.query.a == `addMobile` ) {
      try {
        /** Create new mobile */
        const mobilePrototype = new world.MobilePrototype();
        
        mobilePrototype.created(new Date());
        mobilePrototype.description(req.body.description);
        mobilePrototype.name(req.body.name);
        mobilePrototype.roomDescription(req.body.roomDescription);

        /** Insert mobile in database */
        await mobilePrototype.insert(world.database());
        
        /** Add m mobile to area */
        area.mobilePrototypes().push(mobilePrototype);
        
        /** Update area */
        await area.update(world.database());
        
        /** Add m mobile to world */
        world.mobilePrototypes().push(mobilePrototype);

        /** Redirect to success message */
        res.redirect(`/areas/${req.params.id}/?` + querystring.stringify({ success: 1, message: `New mobile '${req.body.name}' has been created with ID #${mobilePrototype.id()}!` }));
      } catch ( err ) {
        /** Redirect to error message */
        res.redirect(`/areas/${req.params.id}/?` + querystring.stringify({ error: 1, message: err.message }));
      }
      
      return;
    }
    
    /** Otherwise, if we're deleting an existing mobile... */
    else if ( req.query.a == `deleteMobile` ) {
      try {
        /** Find area in world */
        const area = world.areas().find(x => x.id() == req.params.id);
        
        /** Find mobile prototype in world */
        const mobilePrototype = world.mobilePrototypes().find(x => x.id() == req.query.id);
        
        /** Loop through each area in the world... */
        for ( let i = world.areas().length - 1; i >= 0; i-- ) {
          const area = world.areas()[i];
          
          /** Loop through each room in the area... */
          for ( let j = area.rooms().length - 1; j >= 0; j-- ) {
            const room = area.rooms()[j];
          
            /** Loop through each mobile instance in the room... */
            for ( let k = room.mobiles().length - 1; k >= 0; k-- ) {
              const mobile = room.mobiles()[k];
              
              /** If mobile is fighting a mobile of this prototype, stop fighting */
              if ( mobile.fighting() && mobile.fighting().prototype() == mobilePrototype() )
                mobile.fighting(null);
              
              /** If the mobile instance's prototype is this mobile prototype... */
              if ( mobile.prototype() == mobilePrototype ) {
                /** Define recursive helper function for adding any item contents to world and setting container of each */
                const recursiveItemContents = async (item) => {
                  for ( let i = item.contents().length - 1; i >= 0; i++ ) {
                    await recursiveItemContents(content);
                  }
                  
                  await item.delete(world.database());
                };
                
                /** Loop through each item in mobile's inventory */
                for ( let l = mobile.inventory().length - 1; l >= 0; l-- ) {
                  const item = mobile.inventory()[l];
                  
                  await recursiveItemContents(item);
                  
                  await item.delete(world.database());
                }
                
                /** Loop through each item in mobile's equipment */
                for ( let l = mobile.equipment().length - 1; l >= 0; l-- ) {
                  const item = mobile.equipment()[l];
                  
                  recursiveItemContents(item);
                  
                  await item.delete(world.database());
                }
                
                /** Remove mobile instance from room */
                room.mobiles().splice(k, 1);
                
                /** Update the room */
                await room.update(world.database());
                
                /** Delete the mobile instance */
                await mobile.delete(world.database());
              }
            }
            
            /** Loop through each user in the room... */
            for ( let k = room.users().length - 1; k >= 0; k-- ) {
              const user = room.users()[k];
              
              /** If user is fighting a mobile of this prototype, stop fighting */
              if ( user.fighting() && user.fighting() instanceof world.Mobile && user.fighting().prototype() == mobilePrototype() )
                user.fighting(null);
            }
          }
        }
        
        /** Remove mobile prototype from area */
        area.mobilePrototypes().splice(area.mobilePrototypes().indexOf(mobilePrototype), 1);
        
        /** Save area */
        await area.update(world.database());
        
        /** Remove room from world */
        world.mobilePrototypes().splice(world.mobilePrototypes().indexOf(mobilePrototype), 1);
        
        /** Redirect to success message */
        res.redirect(`/areas/${req.params.id}/?` + querystring.stringify({ success: 1, message: `Mobile ID #${req.query.id} has been deleted!` }));
      } catch ( err ) {
        /** Redirect to error message */
        res.redirect(`/areas/${req.params.id}/?` + querystring.stringify({ error: 1, message: err.message }));
      }
      
      return;
    }
    
    p.row();
    p.col().size(4).addClass(`text-center`);
    p.h2().addClass(`my-3`).color(`primary`).text(`Room List`);
    p.col().size(4).addClass(`text-center`);
    p.h2().addClass(`my-3`).color(`primary`).text(`Mobile List`);
    p.col().size(4).addClass(`text-center`);
    p.h2().addClass(`my-3`).color(`primary`).text(`Item List`);
    
    /** If we're to display a success message... */
    if ( req.query.success ) {
      /** Display success message */
      p.row();
      p.col().size(6);
      p.alert().color(`success`).dismissable(true).strong(`Success!`).text(req.query.message);
    }

    /** Otherwise, if we're to display an error message */
    else if ( req.query.error ) {
      /** Display error message */
      p.row();
      p.col().size(6);
      p.alert().color(`danger`).dismissable(true).strong(`Error!`).text(req.query.message);
    }
    
    p.row();
    p.col().size(4).center(true);
    p.button().color(`primary`).attr(`data-toggle`, `modal`).attr(`data-target`, `#addRoomModal`).text(`Add New Room`);
    p.col().size(4).center(true);
    p.button().color(`primary`).attr(`data-toggle`, `modal`).attr(`data-target`, `#addMobileModal`).text(`Add New Mobile`);
    p.col().size(4).center(true);
    p.button().color(`primary`).attr(`data-toggle`, `modal`).attr(`data-target`, `#addItemModal`).text(`Add New Item`);

    p.row();
    p.col().size(4);
    p.modal().id(`addRoomModal`).middle(true);
    p.modalHeader();
    p.h5(`modalHeader`).addClass(`modal-title`).text(`Add New Room`);
    p.button(`modalHeader`).addClass(`close`).attr(`data-dismiss`, `modal`).text(`&times;`);
    p.modalBody();
    p.form(`modalBody`).method(`POST`).action(`/areas/${req.params.id}?a=addRoom`);
    p.input().cols(8).id(`name`).name(`name`).type(`text`).label(`Name:`);
    p.textarea().cols(12).id(`description`).name(`description`).label(`Description:`).rows(3);
    p.row(`form`);
    p.col().center(true);
    p.button().color(`secondary`).addClass(`mx-2`).attr(`data-dismiss`, `modal`).text(`Close`);
    p.button().type(`submit`).addClass(`mx-2`).color(`primary`).text(`Create Room`);
    
    p.lastParent(`row`).append(new strapped.Col().size(4));
    p.modal().id(`addMobileModal`).middle(true);
    p.modalHeader();
    p.h5(`modalHeader`).addClass(`modal-title`).text(`Add New Mobile`);
    p.button(`modalHeader`).addClass(`close`).attr(`data-dismiss`, `modal`).text(`&times;`);
    p.modalBody();
    p.form(`modalBody`).method(`POST`).action(`/areas/${req.params.id}?a=addMobile`);
    p.input().cols(8).id(`name`).name(`name`).type(`text`).label(`Name:`);
    p.textarea().cols(12).id(`description`).name(`description`).label(`Description:`).rows(3);
    p.row(`form`);
    p.col().center(true);
    p.button().color(`secondary`).addClass(`mx-2`).attr(`data-dismiss`, `modal`).text(`Close`);
    p.button().type(`submit`).addClass(`mx-2`).color(`primary`).text(`Create Mobile`);
    
    p.lastParent(`row`).append(new strapped.Col().size(4));
    p.modal().id(`addItemModal`).middle(true);
    p.modalHeader();
    p.h5(`modalHeader`).addClass(`modal-title`).text(`Add New Item`);
    p.button(`modalHeader`).addClass(`close`).attr(`data-dismiss`, `modal`).text(`&times;`);
    p.modalBody();
    p.form(`modalBody`).method(`POST`).action(`/areas/${req.params.id}?a=addItem`);
    p.input().cols(8).id(`name`).name(`name`).type(`text`).label(`Name:`);
    p.textarea().cols(12).id(`description`).name(`description`).label(`Description:`).rows(3);
    p.row(`form`);
    p.col().center(true);
    p.button().color(`secondary`).addClass(`mx-2`).attr(`data-dismiss`, `modal`).text(`Close`);
    p.button().type(`submit`).addClass(`mx-2`).color(`primary`).text(`Create Item`);
    
    p.row().addClass(`mt-3`);
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
      p.buttonLink(`tableData`).href(`/areas/${req.params.id}/?a=deleteRoom&id=${room.id()}`).color(`danger`).addClass(`btn-sm py-0 px-1`).text(`X`);
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
      p.buttonLink(`tableData`).href(`/areas/${req.params.id}/?a=deleteMobile&id=${mobile.id()}`).color(`danger`).addClass(`btn-sm py-0 px-1`).text(`X`);
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
      p.buttonLink(`tableData`).href(`/areas/${req.params.id}/?a=deleteItem&id=${item.id()}`).color(`danger`).addClass(`btn-sm py-0 px-1`).text(`X`);
    });
    
    res.send(p.render());
  });
  
  app.all(`/rooms/:id`, async (req, res, next) => {
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
    
    p.row();
    p.col().center(true);
    p.buttonLink().color(`secondary`).addClass(`mx-2`).href(`javascript:history.back()`).text(`Back`);
    p.button().color(`primary`).addClass(`mx-2`).type(`submit`).text(`Save Changes`);
    
    res.send(p.render());
  });
  
  app.all(`/mobiles/:id`, async (req, res, next) => {
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
    p.input().cols(12).type(`text`).name(`roomDescription`).label(`Room Description:`).value(mobile.roomDescription());
    p.row(`form`);
    p.textarea().label(`Description:`).rows(3).name(`description`).cols(12).text(mobile.description());
    
    p.row();
    p.col().center(true);
    p.buttonLink().color(`secondary`).addClass(`mx-2`).href(`javascript:history.back()`).text(`Back`);
    p.button().color(`primary`).addClass(`mx-2`).type(`submit`).text(`Save Changes`);
    
    res.send(p.render());
  });
  
  app.all(`/items/:id`, async (req, res, next) => {
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
    p.input().cols(12).type(`text`).name(`roomDescription`).label(`Room Description:`).value(item.roomDescription());
    p.row(`form`);
    p.textarea().label(`Description:`).rows(3).name(`description`).cols(12).text(item.description());
    
    p.row();
    p.col().center(true);
    p.buttonLink().color(`secondary`).addClass(`mx-2`).href(`javascript:history.back()`).text(`Back`);
    p.button().color(`primary`).addClass(`mx-2`).type(`submit`).text(`Save Changes`);
    
    res.send(p.render());
  });

  app.listen(port, () => {
    console.log(`Web building app up and runing on port ${port}.`);
  });
};
