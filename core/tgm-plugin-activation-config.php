<?php if ( ! defined( 'ABSPATH' ) ) exit; 

// Get the main class
require_once NX_CORE . 'classes/tgm-plugin-activation.php';

// Register the plugins list
function nx_admin_register_required_plugins() {

	$plugins = array(
	
		array(
			'name'			=> 'Classic Editor',
			'slug'			=> 'classic-editor',
			'required'		=> true,
		),
		
		array(
			'name'			=> 'Page Builder by SiteOrigin',
			'slug'			=> 'siteorigin-panels',
			'required'		=> false,
		),		
		
		array(
			'name'			=> 'SiteOrigin Widgets Bundle',
			'slug'			=> 'so-widgets-bundle',
			'required'		=> false,
		),

		array(
			'name'			=> 'Contact Form',
			'slug'			=> 'contact-form-7',
			'required'		=> false,
		),
		
		array(
			'name'			=> 'Autoptimize - HTML / CSS / JS code optimization',
			'slug'			=> 'autoptimize',
			'required'		=> false,
		),
		
		array(
			'name'			=> 'WP Super Cache',
			'slug'			=> 'wp-super-cache',
			'required'		=> false,
		),
		
		array(
			'name'			=> 'Advanced Custom Fields',
			'slug'			=> 'advanced-custom-fields',
			'required'		=> false,
		),

	);
	
	// Development plugins
	if(NX_DEV === TRUE){
		
		// Thumbnails regeneration
		$plugins[] = array(
			'name'			=> 'Force Regenerate Thumbnails',
			'slug'			=> 'force-regenerate-thumbnails',
			'required'		=> false,
		);
		
		// WP debug
		$plugins[] = array(
			'name'			=> 'Debug bar',
			'slug'			=> 'debug-bar',
			'required'		=> false,
		);

	}

	// Array of configuration settings.
	$config = array(
		'id'           => 'nexus-admin',				// Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path' => '',							// Default absolute path to bundled plugins.
		'menu'         => 'tgmpa-install-plugins',		// Menu slug.
		'has_notices'  => true,							// Show admin notices or not.
		'dismissable'  => true,							// If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',							// If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => false,						// Automatically activate plugins after installation or not.
		'message'      => '',							// Message to output right before the plugins table.
	);

	tgmpa( $plugins, $config );
	
}
add_action( 'tgmpa_register', 'nx_admin_register_required_plugins' );