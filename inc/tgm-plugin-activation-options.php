<?php
if ( ! defined( 'ABSPATH' ) ) exit; 
/**
 * Include the TGM_Plugin_Activation class.
 */
require_once dirname( __FILE__ ) . '/tgm-plugin-activation.php';

add_action( 'tgmpa_register', 'nexus_register_required_plugins' );

function nexus_register_required_plugins() {

	$plugins = array(

		array(
			'name'               => 'ACF Pro',
			'slug'               => 'advanced-custom-fields-pro',
			'source'             => get_stylesheet_directory() . '/inc/plugins/advanced-custom-fields-pro.zip',
			'required'           => true,
			'force_activation'   => false, 
			'force_deactivation' => true, 
		),
		
		array(
			'name'               => 'Github Updater',
			'slug'               => 'github-updater',
			'source'             => get_stylesheet_directory() . '/inc/plugins/github-updater.zip',
			'required'           => false,
			'force_activation'   => false, 
			'force_deactivation' => false, 
		),
		
		array(
			'name'      => 'Page Builder by SiteOrigin',
			'slug'      => 'siteorigin-panels',
			'required'  => false,
		),		
		
		array(
			'name'      => 'SiteOrigin Widgets Bundle',
			'slug'      => 'so-widgets-bundle',
			'required'  => false,
		),

		array(
			'name'      => 'Contact Form',
			'slug'      => 'contact-form-7',
			'required'  => false,
		),
		
		array(
			'name'      => 'Contact Form - Tracking',
			'slug'      => 'contact-form-7-leads-tracking',
			'required'  => false,
		),
		
		array(
			'name'      => 'Autoptimize - HTML / CSS / JS code optimization',
			'slug'      => 'autoptimize',
			'required'  => false,
		),
		
		array(
			'name'      => 'EU Cookie Law',
			'slug'      => 'eu-cookie-law',
			'required'  => false,
		),
		
		array(
			'name'      => 'WP Super Cache',
			'slug'      => 'wp-super-cache',
			'required'  => false,
		),

	);

	$config = array(
		'id'           => 'tgmpa',                 
		'default_path' => '',                      
		'menu'         => 'tgmpa-install-plugins', 
		'parent_slug'  => 'themes.php',            
		'capability'   => 'edit_theme_options',    
		'has_notices'  => false,                    
		'dismissable'  => true,                    
		'dismiss_msg'  => '',                      
		'is_automatic' => false,                   
		'message'      => '',                      

		
	);

	tgmpa( $plugins, $config );
}
