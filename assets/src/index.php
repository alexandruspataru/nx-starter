<?php

// Define the server location
$nx_location	= ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') ? 'https://' : 'http://') . $_SERVER['HTTP_HOST']  . '/';

// Fake info
header( 'HTTP/1.1 301 Moved Permanently' );

// Do the redirect
header( 'Location: ' . $nx_location );
exit;

?>