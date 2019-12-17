# Muddy v0.11.1 [![HitCount](http://hits.dwyl.com/om-mani-padme-hum/muddy.svg)](http://hits.dwyl.com/om-mani-padme-hum/muddy)

A Node.js Multi-User Dungeon (MUD) Framework

## Current Status:

* A good amount of basic functionality in place, but still under development.  
* Ability to build onto world while in game partially in place, now can edit items, rooms, and areas.  
* Web-based builder interface partially in place, not very useful just yet but some editing is possible.
* Basic fighting has now been added, including incapacitated state and natural healing over time!
* Item stats have been added, and formulas for their effects on fighting and health, mana, move are developed but not implemented

## Installation 

Clone muddy:

1. `git clone https://github.com/om-mani-padme-hum/muddy.git`

Enter muddy directory and install dependencies:

2. `cd muddy` (symbolic, just get in the directory)

3. `npm install`

Set up the MySQL database:

4. Download [MySQL](https://www.mysql.com/downloads/) and install, if not already installed.

5. Create a database schema for muddy and import the [muddy.sql](https://github.com/om-mani-padme-hum/muddy/blob/master/muddy.sql) file.  

6. Create a JSON file called `mysql-config.json` in the muddy directory with your MySQL info:

```json
{
  "host"            : "localhost",
  "user"            : "muddy",
  "password"        : "S3cur3UrMuD!",
  "database"        : "muddy"
}
```

Start it up!

7. `npm start`

Login:

8. `telnet localhost 9000`

For the web builder, browse to:

9. `http://localhost:7001/`
 
## Currently Implemented Commands:

* alist
* astat
* colors
* commands
* create
* down
* drop
* east
* edit
* equipment
* get
* goto
* look
* help
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
* score
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

* Added mobile instance and prototype editing in game
* Ability to create exits in game
* Added elemental properties to characters
* Added help and score commands, default help added, many more to do
* Fixed bugs with capitalization and colors on new character logins
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
* Paths and races, each with their unique benefits, deficiencies, and skillsets, again completely customizable

# License

MIT