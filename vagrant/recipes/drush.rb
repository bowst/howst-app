#only do this if it's drush version 6 and up
if node['existing']['drush_version'] >= 6
  #Copy appropriate composer.json depending on drupal version - edit the appropriate file in files/composer to change
  if node['existing']['drush_version'] == 6
    drush_version = "6.*"
  else
    drush_version = "dev-master"
  end

  execute "Adding drush globally" do
    cwd "/home/vagrant"                                                           
    user "vagrant" 
    environment ({'HOME' => '/home/vagrant', 'USER' => 'vagrant'})
    command "composer global require drush/drush:#{drush_version}"
    action :run
  end

end

execute "Add Composer's global bin to $PATH" do
  cwd "/home/vagrant"                                                           
  user "vagrant" 
  environment ({'HOME' => '/home/vagrant', 'USER' => 'vagrant'})
  command "sed -i '1i export PATH=\"$HOME/.composer/vendor/bin:$PATH\"' /home/vagrant/.bashrc"
  action :run
end

if node['existing']['is_pantheon']
  #Install Terminus
  bash "Install Terminus" do
    user "vagrant"
    cwd "/home/vagrant"
    environment ({'HOME' => '/home/vagrant', 'USER' => 'vagrant'})
    code <<-EOH
    # Download Terminus.
    git clone https://github.com/pantheon-systems/terminus.git $HOME/.drush/terminus
    # Download dependencies.
    cd $HOME/.drush/terminus
    sudo composer update --no-dev
    # Clear Drush's cache.
    drush cc drush
    EOH
  end
=begin  
  #Log in
  bash "Login to Pantheon" do
    user "vagrant"
    cwd "/home/vagrant"
    environment ({'HOME' => '/home/vagrant', 'USER' => 'vagrant'})
    code <<-EOH
    EOH
  end
=end
end


