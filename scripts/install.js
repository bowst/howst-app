#!/usr/bin/env node

//This install script copies the vagrant directory to the correct place.

var ncp = require('ncp').ncp;
var utils = require('../lib/utils');

ncp.limit = 16;
 
ncp(__dirname + "/../vagrant", utils.howstDir, function (err) {
 if (err) {
   return console.log(err);
 }
 console.log('Howst has been installed correctly!');
});
