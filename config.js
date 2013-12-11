
var fs    = require('fs'),
    nconf = require('nconf');

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf.argv()
    .env()
    .file('./config/config.json');

if(process.env.NODE_ENV === 'dev') {
    console.log(222);
    nconf.file('./config/config_dev.json');
}


module.exports = nconf;