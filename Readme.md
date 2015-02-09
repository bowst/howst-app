# Howst

Tool to quickly and easily spin up local Drupal instances.  It functions essentially as a wrapper around a Vagrantfile with some convienience management methods.

## Installation

Install the following dependencies.

* Vagrant (https://www.vagrantup.com/)
* Vagrant plugins:
   * vagrant-berkshelf
   * vagrant-omnibus
   * Vagrant plugins are easily from the command line: `vagrant plugin install vagrant-berkshelf vagrant-omnibus`
* Chef Development Kit (https://downloads.chef.io/chef-dk/)
* NodeJS (http://nodejs.org/)

Then install from the npm command line.

    $ npm install -g howst

## Usage

```
Usage: howst [options] [command]

  Commands:

    create <hostname>   Create a new Howst machine
    config <hostname>   Reconfigure an existing Howst machine
    destroy <hostname>  stops and deletes all traces of the Howst machine
    *                   Vagrant passthrough.  See below.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Vagrant passthrough commands: 
        box             manages boxes: installation, removal, etc. 
        connect         connect to a remotely shared Vagrant environment 
        default         sets the defaults howst instance 
        global-status   outputs status Vagrant environments for this user 
        halt            stops the vagrant machine 
        help            shows the help for a subcommand 
        init            initializes a new Vagrant environment by creating a Vagrantfile 
        login           log in to HashiCorp's Atlas 
        package         packages a running vagrant environment into a box 
        plugin          manages plugins: install, uninstall, update, etc. 
        provision       provisions the vagrant machine 
        push            deploys code in this environment to a configured destination 
        rdp             connects to machine via RDP 
        reload          restarts vagrant machine, loads new Vagrantfile configuration 
        resume          resume a suspended vagrant machine 
        share           share your Vagrant environment with anyone in the world 
        ssh             connects to machine via SSH 
        ssh-config      outputs OpenSSH valid configuration to connect to the machine 
        status          outputs status of the vagrant machine 
        suspend         suspends the machine 
        up              starts and provisions the vagrant environment 
        version         prints current and latest Vagrant version
```

## Contributing

1. Fork it ( https://github.com/bowst/howst-app/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
