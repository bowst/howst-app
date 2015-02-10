//Manage Instances

var utils = require("./utils");
var colors = require("colors");
var vagrant = require('vagrant');
var Table = require('cli-table');
var spawn = require('child_process').spawn;

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

var listMachines = exports.listMachines = function(options){
  //Get Howst settings file
  var howst = utils.loadHowstFile("howst");
  var table = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''} });
  
  var writeTable = function(vagrantSTDOUT){
    var headers = ['Hostname'.bold, 'Port'.bold];
    if(vagrantSTDOUT){
      headers.push("Status".bold);
    }
    table.push(headers);
    
    howst.machines.forEach(function(machine){
      var output = [machine.hostname, machine.port];
      if(vagrantSTDOUT){
        var exp = new RegExp("[\n\r].*" + machine.hostname + "\s*([^\n\r]*)")
        var machineStatus = vagrantSTDOUT.match(exp);
        output.push(machineStatus[1].trim());
      }
      table.push(output);
    });
    console.log("\r\nCurrently registered Howst machines:");
    console.log(table.toString());
    console.log("");
  };
  
  if(options.status){
    
    var child = spawn(vagrant.bin(), ["status"], {
        cwd: vagrant.start,
        env: process.env,
        stdio: 'pipe'
    });

    child.stdout.on('data', function(data) {
      writeTable(data.toString());
    });
  }else{
    writeTable();
  }
};

var statusMachines = exports.statusMachines = function(options){
  
};