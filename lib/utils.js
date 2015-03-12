//Utilities for Howst

var yaml = require('js-yaml');
var fs   = require('fs');
var colors = require('colors');
var promptly = require('promptly');

//howst directory
var userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var howstDir = exports.howstDir = userHome + "/.howst";

//load howst.json
var loadHowstFile = exports.loadHowstFile = function(file){
  try {
    var doc = yaml.safeLoad(fs.readFileSync(howstDir + "/" + file + ".yml", 'utf8'));
    if(!doc.machines){
      doc.machines = [];
    }
    return doc;
  } catch (e) {
    switch (file){
      case "howst":
        var obj = {};
        obj.machines = [];
        return obj;
        break;
      default:
        console.log(e);
        throw "Error loading " + file + ".yml";
        return;
        break;
    }
  }
};

var saveHowstFile = exports.saveHowstFile = function(file, obj){
  try{
    fs.writeFileSync(howstDir + "/" + file + ".yml", yaml.safeDump(obj));
    return {success:true};
  } catch (error){
    throw new error;
    return false;
  }
};

var getMachineByHostname = exports.getMachineByHostname = function(hostname, howst){
  var howst = howst ? howst : loadHowstFile("howst");
  //Check to make sure this hostname is unique
  for(var i = 0; i < howst.machines.length; i++) {
      if (howst.machines[i].hostname == hostname) {
          break;
      }
  }
  return i < howst.machines.length ? howst.machines[i] : false;
}

var setMachine = exports.setMachine = function(machine, howst){
  var howst = howst ? howst : loadHowstFile("howst");
  //find the machine and set it to new object
  for(var i = 0; i < howst.machines.length; i++) {
      if (howst.machines[i].hostname == machine.hostname) {
        howst.machines[i] = machine;
        break;
      }
  }
  if(i >= howst.machines.length){
    console.log("No machine could be found with the hostname: %s".red, machine.hostname);
    return false;
  }else{
    return true;
  }
}

var removeMachine = exports.removeMachine = function(machine, howst, callback){
  if(getType(howst) == "function"){
    callback = howst;
    howst = loadHowstFile("howst");
  }
  
  var howst = howst ? howst : loadHowstFile("howst");
  machine = getType(machine) == "object" ? machine.hostname : machine;
  //find the machine and set it to new object
  for(var i = 0; i < howst.machines.length; i++) {
      if (howst.machines[i].hostname == machine) {
        break;
      }
  }
  if(i >= howst.machines.length){
    console.log("No machine could be found with the hostname: %s".red, machine.hostname);
    callback(false);
  }else{
    promptly.confirm("Are you sure you want to remove " + howst.machines[i].hostname +" (y/n): ", function(err, value){
      callback(true, i);
    });
  }
};

var getType = exports.getType = function(o){
  var TYPES = {
      'undefined'        : 'undefined',
      'number'           : 'number',
      'boolean'          : 'boolean',
      'string'           : 'string',
      '[object Function]': 'function',
      '[object RegExp]'  : 'regexp',
      '[object Array]'   : 'array',
      '[object Date]'    : 'date',
      '[object Error]'   : 'error'
  },
  TOSTRING = Object.prototype.toString;
  return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
}

var configMachine = exports.configMachine = function(newMachine, howst, callback){
  
  if(getType(howst) == "function"){
    callback = howst;
    howst = loadHowstFile("howst");
  }
  
  var config = [
    {
      key: "is_existing_site",
      prompt: "Is this an existing site",
      default: false
    },
    {
      key: "is_pantheon",
      prompt: "Is this a pantheon site",
      default: false,
      condition: "newMachine['is_existing_site']"
    },
    {
      key: "drupal_version",
      prompt: "Drupal Version",
      default: 7,
      condition: "!newMachine['is_existing_site']",
      options: [7, 8]
    },
    {
      key: "host_docroot",
      prompt: "Path to drupal docroot on host machine"
    },
    {
      key: "drush_version",
      prompt: "Drush version to install on guest machine",
      default: 6,
      options: [5, 6, 7]
    },
    {
      key: "path_to_drush_files",
      prompt: "Full path to drush alias file",
      default: userHome + "/.drush/" + newMachine.hostname
    },
    {
      key: "drush_alias",
      prompt: "Drush alias for this site [don't include `@`]",
      condition: "newMachine['is_existing_site']",
      default: newMachine.hostname
    },
    {
      key: "port",
      prompt: "Port to access site on host machine",
      default: 8080
    }
  ];
  
  var portValidator = function(value){
    if(Number(value) == 'NaN'){
      throw new Error("Please enter a valid port.".red);
    }
    var portInUse = false;
    for(var i = 0; i < howst.machines.length; i++) {
        if (howst.machines[i].port == value && howst.machines[i].hostname != newMachine.hostname) {
            portInUse = true;
            break;
        }
    }
    if(portInUse){
      throw new Error("This port is already in use.".red);
    }
    return value;
  };
  var index = 0;
  var promptForConfig = function(){
    //Lets stop the recursion if we're done
    if (index >= config.length){
      callback(newMachine);
      return;
    }
    var option = config[index];
    index++;
    //check to make sure we should ask this question
    
    if(option.condition && !eval(option.condition)){
      promptForConfig();
      return;
    }
    
    var defaultValue = newMachine[option.key] ? newMachine[option.key] : option.default;
    switch (getType(option.default)){
      case "boolean":
        var defaultText = defaultValue ? "yes" : "no";
        promptly.confirm(option.prompt + " (" + defaultText + "): ", {default: defaultValue}, function(err, value){
          newMachine[option.key] = value;
          promptForConfig();
        });
        break;
      case "number":
        if(option.options){
          promptly.choose(option.prompt + " (" + defaultValue + "): ", option.options, {default: defaultValue}, function (err, value) {
              newMachine[option.key] = value;
              promptForConfig();
          });
        }else{
          var promptOptions = {default: defaultValue};
          promptOptions.validator = option.key == "port" ? portValidator : '';
          promptly.prompt(option.prompt + " (" + defaultValue + "): ", promptOptions, function (err, value) {
              newMachine[option.key] = Number(value);
              promptForConfig();
          });
        }
        break;
      default:
        promptly.prompt(option.prompt + " (" + defaultValue + "): ", {default: defaultValue}, function (err, value) {
            newMachine[option.key] = value;
            promptForConfig();
        });
        break;
    }
  };
  promptForConfig();
};

var vagrantCommands = exports.vagrantCommands = [
    'box',
    'destroy',
    'halt',
    'init',
    'package',
    'plugin',
    'provision',
    'reload',
    'resume',
    'ssh',
    'ssh-config',
    'status',
    'suspend',
    'up'
];
 
