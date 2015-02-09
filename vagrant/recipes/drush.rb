#only do this it's not pantheon
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

=begin
ruby_block "Prep Drush files for transfer" do
  block do 
    FileUtils.cp_r("#{node['existing']['drush_directory']}/.","#{Dir.home}/.howst/files/default/drush")
  end
end

#Copy over any files we want (drush aliases, policy files, etc.)
remote_directory "/home/vagrant/.drush" do
  files_mode '777'
  files_owner 'vagrant'
  mode '0770'
  owner 'vagrant'
  source 'drush'
end

ruby_block "Drush files clean up" do
  block do 
    FileUtils.rm_rf(Dir.glob("#{node['existing']['drush_directory']}/*"))
  end
end
=end



