# Muddy [![Build Status](https://www.travis-ci.org/om-mani-padme-hum/muddy.svg?branch=master)](https://www.travis-ci.org/om-mani-padme-hum/muddy) [![HitCount](http://hits.dwyl.com/om-mani-padme-hum/muddy.svg)](http://hits.dwyl.com/om-mani-padme-hum/muddy)
A Node.js Multi-User Dungeon (MUD) Framework

## Current Status:
Operational in limited form.  Three default rooms exist.  One item and one mobile exist in memory are one copy of each are in world.  Login supported for both existing and new users, both can save, multiple users can be on simultaneously and see each other.  Basic movement and the ability to look at rooms and see other users, mobiles, items exist.

#### Current Commands:
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
* Implement the ability to get and drop items, containers, wearables, wieldables
* Implement fight engine with support for user defined fight modifiers
* Implement periodic world updates
* Implement mobile scripting
* Implement user defined races, lineages, skills, spells, etc.

## Example Use:

* See https://github.com/om-mani-padme-hum/muddy_examples
