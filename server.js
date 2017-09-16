/** External modules */
const mysql = require('mysql');
const net = require('net');
const crypto = require('crypto');

/** Muddy module */
const muddy = require('./muddy');

/** Instantiate pooled MySQL DB connection */
const db  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'muddy',
  password        : 'S3cur3UrMuD!',
  database        : 'muddy'
});

/** Create world */
const world = new muddy.World();

/** Create input processor */
const input = new muddy.InputProcessor({
  db: db, 
  world: world
});

/** Create server -- net.createServer constructor parameter is new connection handler */
const server = net.createServer((socket) => {
  console.log('New socket from ' + socket.address().address + '.');
  
  /** Create a new user */
  var user = new muddy.User({
    socket: socket
  });
  
  /** Assign socket a random ID */
  socket.id = crypto.randomBytes(32).toString('hex');
  
  /** Add user to active users list */
  world.addUser(user);
  
  /** Log user disconnects */
  socket.on('end', () => {
    let user = world.findUserBySocket(socket);
    
    if ( user ) {
      console.log('User ' + user.name() + ' disconnected.');
      user.socket(null);
      user.state(user.STATE_DISCONNECTED);
    } else {
      console.log('Socket disconnected.');
    }
  });
  
  /** Data received from user */
  socket.on('data', (buffer) => {    
    /** Pass input to the input processor */
    input.process(socket, buffer);
  });
  
  /** Display welcome message */
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('                              W E L C O M E    T O\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('                                          _     _\r\n');
  socket.write('                          /\\/\\  _   _  __| | __| |_   _\r\n');
  socket.write('                         /    \\| | | |/ _` |/ _` | | | |\r\n');
  socket.write('                        / /\\/\\ \\ |_| | (_| | (_| | |_| |\r\n');
  socket.write('                        \\/    \\/\\__,_|\\__,_|\\__,_|\\__, |\r\n');
  socket.write('                                                  |___/\r\n');
  socket.write('\r\n');
  socket.write('                              Created by Rich Lowe\r\n');
  socket.write('                                  MIT Licensed\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('\r\n');
  socket.write('Hello, what is your name? ');
});

/** Re-throw errors for now */
server.on('error', (error) => {
  throw error;
});

/** Time to get started */
server.listen(9000, () => {
  console.log('Muddy is up and running on port 9000!');
});