# Muddy [![Build Status](https://www.travis-ci.org/om-mani-padme-hum/muddy.svg?branch=master)](https://www.travis-ci.org/om-mani-padme-hum/muddy) [![HitCount](http://hits.dwyl.com/om-mani-padme-hum/muddy.svg)](http://hits.dwyl.com/om-mani-padme-hum/muddy)
A Node.js Multi-User Dungeon (MUD) Framework

## Current Status:
Operational in limited form.  Three default rooms exist.  One item and one mobile exist in memory and one copy of each are in world.  Login supported for both existing and new users, both can save, multiple users can be on simultaneously and see each other.  Basic movement and the ability to look at rooms and see other users, mobiles, items exist.  Can now take over your body by reconnecting.  Added buffered output for users indirectly affected by other users or world events.

## Future Vision:
* Web-based user interface that can be enabled/disabled for area development and mobile scripting.
* Full-fledged fight engine with easy to implement modifiers for powerful, yet easy fight customizability
* Massive, in-game expandable, interactive and dynamic world, with a range of areas, rooms, items, and mobiles
* Advanced mobile scripting capabilities, along with dynamic weather and other periodic events, all customizable
* Races and lineages, each with their unique benefits, deficiencies, and skillsets, again completely customizable

## Current Commands:
* down
* east
* look
* north
* northeast (ne)
* northwest (nw)
* quit
* save
* south
* southeast (se)
* southwest (sw)
* up
* west

## Project Todo List:

* Finish loading and saving of areas, rooms, items, mobiles with MySQL source
* Add output processor to interpret VT100 colors and styles
* Implement socials
* Implement the ability to get and drop items, use containers, wear equipables
* Implement fight engine with support for user defined fight modifiers
* Implement periodic world updates
* Implement mobile scripting
* Implement user defined races, lineages, skills, spells, etc.

## Example Use:

* See https://github.com/om-mani-padme-hum/muddy_examples
