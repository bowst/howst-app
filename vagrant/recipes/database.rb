db = node["database"]


mysql_connection_info = {
    :host     => db["host"],
    :username => "root",
    :password => node["mysql"]["server_root_password"]
}

# Create a mysql database
mysql_database db["name"] do
  connection mysql_connection_info
  action :create
end



execute 'user init' do
  command "mysql -h #{db["host"]} -u root -p#{node["mysql"]["server_root_password"]} -e \"GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES ON drupal.* TO '#{db["user"]}'@'localhost' IDENTIFIED BY '#{db["pass"]}';\""
end