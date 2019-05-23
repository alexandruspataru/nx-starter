<?php if ( ! defined( 'ABSPATH' ) ) { exit; }

// Custom fields
if(function_exists('acf_add_options_page')){
	
	// Theme options page
	acf_add_options_page(array(
		'page_title'		 => _x('Website settings', '', 'nexus-admin'),
		'menu_title'		 => _x('Website settings', '', 'nexus-admin'),
		'menu_slug'			 => 'website-settings',
		'capability'		 => 'edit_posts',
		'redirect'			 => false
	));
	
	// Get the custom fields
	require_once NX_CORE . 'admin/custom-fields.php';
	
}