<?php
// ~/.drush/policy.drush.inc
/**
* Implementation of drush_hook_COMMAND_validate(). 
*/
function drush_policy_sql_sync_validate($source = NULL, $destination = NULL) { 
   if($destination == '@prod' || $destination == '@staging') { 
      return drush_set_error(dt('Per ./.drush/policy.drush.inc, FOOL OF A TOOK!  You almost overwrote the hosted db!')); 
   }
}