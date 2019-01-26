<?php if ( ! defined( 'ABSPATH' ) ) exit;
 
/**
 * @AlexSpataru 02 Nov 2018
 * Register & Enqueue the styles / scripts
 */ 
function nexus_scripts() {
	
	// Register
	wp_register_style( 'google-fonts', 'http://fonts.googleapis.com/css?family=Open+Sans:400,600,700', false, '1.0.0', 'all' );
	wp_register_style( 'vendor', get_template_directory_uri() . '/assets/css/vendor.css', false, '1.0.0', 'all' );
	wp_register_script( 'vendor', get_template_directory_uri() . '/assets/js/vendor.js', array( 'jquery' ), '1.0.0', true );
	
	
	// Enqueue	
	wp_enqueue_style( 'google-fonts' );
	wp_enqueue_style( 'vendor' );
	wp_enqueue_style( 'nexus-style', get_stylesheet_uri() );
	wp_enqueue_script( 'vendor' );

}
add_action( 'wp_enqueue_scripts', 'nexus_scripts' );