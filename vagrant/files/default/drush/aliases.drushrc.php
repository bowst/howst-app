<?php
  /**
   * Pantheon drush alias file, to be placed in your ~/.drush directory or the aliases
   * directory of your local Drush home. Once it's in place, clear drush cache:
   *
   * drush cc drush
   *
   * To see all your available aliases:
   *
   * drush sa
   *
   * See http://helpdesk.getpantheon.com/customer/portal/articles/411388 for details.
   */

  $aliases['dev'] = array(
    'uri' => 'dev-monarqrc-2015.pantheon.io',
    'db-url' => 'mysql://pantheon:6f196bdcdc58440f83ead071c3672684@dbserver.dev.0774ae1e-50bd-4d52-9bc6-38b75b65ff75.drush.in:13994/pantheon',
    'db-allows-remote' => TRUE,
    'remote-host' => 'appserver.dev.0774ae1e-50bd-4d52-9bc6-38b75b65ff75.drush.in',
    'remote-user' => 'dev.0774ae1e-50bd-4d52-9bc6-38b75b65ff75',
    'ssh-options' => '-p 2222 -o "AddressFamily inet"',
    'path-aliases' => array(
      '%files' => 'code/sites/default/files',
      '%drush-script' => 'drush',
     ),
  );
  
?>