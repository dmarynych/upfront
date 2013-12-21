
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
    .file(__dirname +'/config/config.json');
	console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'dev') {
    nconf.file(__dirname +'/config/config_dev.json');
}


module.exports = nconf;