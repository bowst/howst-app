mysql_service 'default' do
  version '5.6'
  bind_address '0.0.0.0'
  port '3306'  
  initial_root_password node["mysql"]["server_root_password"]
  action [:create, :start]
end

mysql_client 'default' do
  action :create
end