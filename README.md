# Muddy v0.10.0 [![HitCount](http://hits.dwyl.com/om-mani-padme-hum/muddy.svg)](http://hits.dwyl.com/om-mani-padme-hum/muddy)

A Node.js Multi-User Dungeon (MUD) Framework

## Current Status:

* A good amount of basic functionality in place, but still under development.  
* Ability to build onto world while in game partially in place, now can edit rooms and areas.  
* Web-based builder interface partially in place, not very useful just yet but some editing is possible.
* Basic fighting has now been added, including incapacitated state and natural healing over time!

# Installation 

`git clone https://github.com/om-mani-padme-hum/muddy.git`

Enter muddy directory

`npm install`

Install a MySQL database, create a database schema and import 
the [muddy.sql](https://github.com/om-mani-padme-hum/muddy/blob/master/muddy.sql) file.  Create a file called 
'mysql-config.json' in the muddy directory with the following JSON containing your MySQL authentication 
and schema info:

{
  "host"            : `localhost`,
  "user"            : `muddy`,
  "password"        : `S3cur3UrMuD!`,
  "database"        : `muddy`
}

Start it up!

`npm start`

Login...

`telnet localhost 9000`

For web builder, browse to:

`http://localhost:7001/`
 
## Currently Implemented Commands:

* alist
* astat
* colors
* commands
* create
* down
* drop
* east
* edit (partly functional)
* equipment
* get
* goto
* look
* ilist
* inventory
* istat
* kill
* mlist
* mstat
* north
* northeast (ne)
* northwest (nw)
* quit
* remove
* rlist
* rstat
* say
* save
* shutdown
* south
* southeast (se)
* southwest (sw)
* title
* up
* ustat
* wear
* west
* who
* wield

## Latest Changes

* Ability to look at item details
* Ability to edit item instances and prototypes in game
* Updated database example to match code
* Decided on equipment stats of accuracy, armor, deflection, dodge, power, and speed
* Character positions and command restriction by position
* Basic fighting with incapacitation
* Natural healing over time periodic update

## Planned Track:

* Web-based user interface that can be enabled/disabled for area development and mobile scripting
* Full-fledged fight engine with easy to implement modifiers for powerful, yet easy fight customizability
* Massive, in-game expandable, interactive and dynamic world, with a range of areas, rooms, items, and mobiles
* Random and wide-ranging item rarities and stats, customization on top of that
* Advanced mobile scripting capabilities, along with dynamic weather and other periodic events, all customizable
* Paths and lineages, each with their unique benefits, deficiencies, and skillsets, again completely customizable

# License

MIT