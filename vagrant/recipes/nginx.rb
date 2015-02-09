# Make sure Apache is not running
package "apache2" do
  action :remove
end

apt_repository 'nginx' do
  uri "ppa:nginx/stable"
  distribution node['lsb']['codename']
  components ["nginx"]
end

include_recipe 'nginx'

service "nginx" do
  enabled true
  running true
  supports :status => true, :restart => true, :reload => true
  action [:start, :enable]
end

execute "Copy config file" do
  command "sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/drupal"
  action :run
  not_if  do File.exists?("/etc/nginx/sites-available/drupal") end
end

# Sites available
cookbook_file "/etc/nginx/sites-available/drupal" do
  source File.join('nginx', 'drupal.config')
  mode 0640
  notifies :restart, resources(:service => "nginx")
end

execute "nginx sites enabled sym link" do
  command "ln -nfs /etc/nginx/sites-available/drupal /etc/nginx/sites-enabled/drupal"
  notifies :restart, resources(:service => "nginx")
end


execute "remove the default file" do
  command "sudo rm /etc/nginx/sites-available/default"
  notifies :restart, resources(:service => "nginx")
end