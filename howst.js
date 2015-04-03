#!/usr/bin/env node
//Configure vagrant interface
var pkg = require('./package.json');
var vagrant = require('vagrant');
var utils = require('./lib/utils');
var manage = require('./lib/manage');
var colors = require('colors');

vagrant.start = utils.howstDir;

//CLI Routing
var program = require('commander');

//Libraries
var help = require('./lib/help');

program
  .version(pkg.version)
  .description(pkg.description)

//Check required parameters
var validated = false;
// if (...) validated = true;

if (validated) {
  //CREATE
  program
    .command('create <hostname>')
    .action(function(hostname, options) {
      manage.newMachine(hostname)
  });

  //CONFIG
  program
    .command('config <hostname>')
    .description("Reconfigure an existing Howst machine")
    .action(function(hostname) {
      manage.editMachine(hostname)
  });

  //REMOVE
  program
    .command('remove <hostname>')
    .description("stops and deletes all traces of the Howst machine")
    .action(function(hostname) {
      manage.destroyMachine(hostname)
  });

  //LIST
  program
    .command('list')
    .description("Lists all known Howst machines")
    .option('-s, --status', 'Show status')
    .action(function(options) {
      manage.listMachines(options);
  });

  //LIST
  program
    .command('info <hostname>')
    .description("Lists the properties of the given Howst machine")
    .action(function(options) {
      manage.getMachineInfo(options);
      
  });

  //Set the remote password
  program
    .command('remote-password <password>')
    .description("Sets password for syncing remote databases")
    .action(function(password) {
      process.env['HOWST_REMOTE_PASSWORD'] = password;
  });



  /* TODO - find a way to have optional arguments with commander so we can use defaults
  //SET DEFAULT
  program
    .command('default <hostname>')
    .description("Sets the default Howst machine")
    .action(function(machine) {
      utils.setDefault(machine);
  });
  */

  //We'll just pass anything else through to vagrant
  program
    .command('*')
    .description("Vagrant passthrough.  See below.")
    .action(function () {
      var parsedArgs = [];
      for (var i = 0; i < arguments.length - 1; i++){
        parsedArgs.push(arguments[i]);
      }
      var command = parsedArgs[0];
      parsedArgs.shift();
      parsedArgs.push(function(){});
      if(utils.vagrantCommands.indexOf(command) == -1){
        console.log("Invalid command.  Use 'howst -h' to see list of available commands.".red);
        return;
      }
      vagrant[command].apply(this, parsedArgs);
  });

  program.parse(process.argv);
}
else {
  //Required parameters not met or --help invoked
  program.help()
}
  

/*
//From a dir with a Vagrantfile, this will ssh into the VM 
var empty = function(){};
vagrant['box']("list", empty)
*/