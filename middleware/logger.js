// First create a logger that creates a log in a .txt file to track everything that happens within our app.
// For now, all that needs to be logged is every time that the application is loaded, it should write a message to the txt file.

// My assumption for the meaning of "application is loaded" is that it is run on the command line

// imports
const EventEmitter = require('events');
const fs = require('fs');

// event
const logger = new EventEmitter();

// create event listener
logger.on('logged', (e) => {
    // write to the text file
    fs.appendFile('middleware/logger.txt', `\nLogged on: ${e}`, (err) => {
        if (err) throw err;
    });
    console.log(e);
});

// emit the event (as if logged on)
logger.emit('logged', getDate());

// the getDate() function gets the current date to append to the logger.txt
// file with the information of when the user is logged in
function getDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();

    var today = `${month}/${day}/${year} ${hour}:${minutes}:${seconds}:${milliseconds}`;
    return today;
}

module.exports = logger;