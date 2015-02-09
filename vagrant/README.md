# Hōwst
Easy Drupal Setup

Requirements
------------
* Vagrant
* Vagrant plugins:
  * vagrant-berkshelf
  * vagrant-omnibus
* Chef Development Kit

=======
##Easy Drupal Setup

###Introduction
Hōwst is how darth vader would have spun up local drupal sites - it is the quick and easy path.  It uses a Virtual Machine to provide an isolated and (hopefully) perfectly configured environment for your local drupal instance.  However, using what can only be some form of sorcery, you can edit all of the drupal directory in /site/code on your local machine (not the VM)...that's a lot better than using VIM!  Plus, you get drush and composer too!

###Dependencies
* Vagrant (version >= 1.7.2)
   * Vagrant-Berkshelf Plugin
   * Vagrant Omnibus Plugin
   * Vagrant Host Shell Plugin
* Chef Development Kit (Chef-DK)

###What's behind door number 1?
After your VM is up and running, you'll have a ready-to-go drupal instance based on the following stack:
* Nginx
* PHP (duh!)
* MySQL
* Drupal (double-duh!)

###Getting Started
1. Install the dependencies
2. Clone the repo
3. Configure your instance in the Vagrant File.  Available options currently include:
   * Drupal version #
   * Database config (user, password, host, etc.)
   * Drupal install directory (default to /var/www/drupal)
   * To configure the port on your local machine you'll visit, change the `host` parameter of the config.vm.network function in the vagrant file.  Defaults to `8080`.
   
###New Projects
1. You've got it easy!  Run the following command to bring up your shiny new drupal instance: `vagrant up`
2. You should now be able to access the drupal install.php for your shiny new instance at localhost:8080 (or whatever port you specified) on your local machine.  Good for you!

###Existing Projects
1. For existing projects, you'll need to specify the following variables BEFORE you run vagrant up:

```ruby
   IS_EXISTING_SITE #boolean, yes or no....pretty straightforward
   GIT_REPO #string, the git repo URI. Be sure it is ONLY the URI
   SITE_ALIAS #string, Drush Site alias (excluding '@') for the existing instance.  The drush alias file should be included in files/default/drush
   IS_PANTHEON #boolean, If existing instance is hosted on Pantheon.  This is important as pantheon doesn't support the latest version of drush
```

2. You'll also need to ensure that the site/code directory is completely empty.  Otherwise the git clone will fail.
3. Be sure the drush site alias file (named aliases.drushrc.php) in `files/drush` contains the alias you specifiy in the `Vagrantfile`
3. Lastly, you'll need to ensure that you're settings.php file in the repo will point to the configured db on the VM.
3. Ok, finally!  Now you can `vagrant up`
4. If there are no errors, you're almost there!  Just ssh into the VM using `vagrant ssh`, then run the `pull-db` command to recreate the db. This can be used anytime from anywhere in the VM.
5. Visit your site at localhost:8080 (or whatever port you specified) and let the drupal goodness begin.

###MySQL Notes
------------
* To login into mysql, specify the host. For example:
    `mysql -h 127.0.0.1 -u root -p`

###The Deets
* Any files in the files/default/drush directory will be copied to the ~/.drush directory on the VM instance.  This is super handy for drush aliases, policy files, etc.  I've included a drush policy file attempting to ensure staging and prod dbs are not overwritten by foolish tooks.
* The NGINX config file can be edited in files/default/nginx
* ssh-ing is easy.  From the root directory of this repo, simply run the following command: `vagrant ssh`
* Drush is already installed - good practice would be to create a local alias for your new drupal site.  You must be wondering...such an onerous task, there must be an easy way to do it.  Well, you're wrong!  Just kidding, it's wicked easy.  Try this command magic from your drupal install directory: `drush site-alias @self --full --with-optional > ~/.drush/local.aliases.php`
* Get Drupally with it!

###TODO
1. Add ability to spin up existing sites using file proxy module.
