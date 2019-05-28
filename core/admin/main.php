<?php if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once(NX_CORE . 'admin/tgm-plugin-activation.php');
require_once(NX_CORE . 'tgm-plugin-activation-config.php');

// Custom fields
if(function_exists('acf_add_options_page')){
	
	// Theme options page
	acf_add_options_page(array(
		'page_title'		 => 'Website settings',
		'menu_title'		 => 'Website settings',
		'menu_slug'			 => 'website-settings',
		'capability'		 => 'edit_posts',
		'redirect'			 => false
	));
	
	// Get the custom fields
	require_once NX_CORE . 'admin/custom-fields.php';
	
}