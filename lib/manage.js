//CREATE

var utils = require("./utils");
var colors = require("colors");
var vagrant = require('vagrant');

var setDefault = exports.setDefault = function(hostname){
  var howst = utils.loadHowstFile("howst");
  //if it's found, then we're clear to set as default
  if(utils.getMachineByHostname(hostname, howst)){
    howst["default"] = hostname;
    utils.saveHowstFile("howst", howst);
    console.log("The default machine is now: %s", hostname);
  }else{
    console.log("No Howst machine was found with that name.".red);
  }
}

var getDefault = exports.getDefault = function(hostname){
  var howst = utils.loadHowstFile("howst");
  return howst.default;
}

var newMachine = exports.newMachine = function(hostname, options){
  //Get Howst settings file
  var howst = utils.loadHowstFile("howst");
  if(utils.getMachineByHostname(hostname, howst)){
    console.log("A machine with the hostname: %s already exists.  Please select a unique name for this machine".red, hostname);
  }else{
    //Start with the machine defaults
    var newMachine = utils.loadHowstFile("defaults");
    newMachine.hostname = hostname;
    //Now configure the rest of the machine settings
    utils.configMachine(newMachine, function(configuredMachine){
      howst.machines.push(configuredMachine);
      if(!utils.saveHowstFile("howst", howst)){
        throw new "Error";
      }else{
        console.log("New Howst machine %s has been created.".green, configuredMachine.hostname);
      }
    })
  }
};

var editMachine = exports.editMachine = function(hostname, options){
  //Get Howst settings file
  var howst = utils.loadHowstFile("howst");
  var machine = utils.getMachineByHostname(hostname, howst);
  if(!machine){
    console.log("No machine with that hostname is registered with Howst".red);
  }else{
    utils.configMachine(machine, function(configuredMachine){
      utils.setMachine(configuredMachine, howst);
      if(!utils.saveHowstFile("howst", howst)){
        throw new "Error";
      }else{
        console.log("%s has been saved.".green, configuredMachine.hostname);
      }
    })
  }
  
};

var destroyMachine = exports.destroyMachine = function(hostname, options){
  //Get Howst settings file
  var howst = utils.loadHowstFile("howst");
  var machine = utils.getMachineByHostname(hostname, howst);
  if(!machine){
    console.log("No machine with that hostname is registered with Howst".red);
  }else{
    utils.removeMachine(machine, howst, function(proceed, index){
      if(proceed){
        howst.machines.splice(index, 1);
        utils.saveHowstFile("howst", howst);
        vagrant.destroy(hostname, function(){});
      }
    });
  }
};