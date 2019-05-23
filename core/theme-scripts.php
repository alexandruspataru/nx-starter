<?php if ( ! defined( 'ABSPATH' ) ) exit;
 
/**
 * @AlexSpataru 02 Nov 2018
 * Register & Enqueue the styles / scripts
 */ 
function nx_scripts() {
	
	// Minified or not assets
	$vendor				 = (NX_DEV === TRUE) ? 'vendor' : 'vendor.min';
	
	// Get the theme info
	$theme				 = wp_get_theme();
	
	// Get the theme version
	$version			 = $theme->get( 'Version' );
	
	// Register
	wp_register_style( 'google-fonts', 'http://fonts.googleapis.com/css?family=Open+Sans:400,600,700', false, $version, 'all' );
	wp_register_style( 'vendor', get_template_directory_uri() . '/assets/css/' . $vendor . '.css', false, $version, 'all' );
	wp_register_script( 'vendor', get_template_directory_uri() . '/assets/js/' . $vendor . '.js', array( 'jquery' ), $version, true );
	
	
	// Enqueue	
	wp_enqueue_style( 'google-fonts' );
	wp_enqueue_style( 'vendor' );
	wp_enqueue_style( 'nexus-style', get_stylesheet_uri() );
	wp_enqueue_script( 'vendor' );
	
	// Deregister WP 5.0+ block style
	// This theme is not intended for Gutenberg
	wp_dequeue_style('wp-block-library');

}
add_action( 'wp_enqueue_scripts', 'nx_scripts' );

// Remove version from scripts and styles
// Source: https://wordpress.stackexchange.com/questions/233543/how-to-remove-the-wordpress-version-from-some-css-js-files
function nx_remove_version_scripts_styles($src) {
	
	// PHP Shorthand - https://davidwalsh.name/php-ternary-examples
	$src = (strpos($src, 'ver=')) ? remove_query_arg('ver', $src) : $src;
	
    return $src;
	
}
add_filter('style_loader_src', 'nx_remove_version_scripts_styles', 9999);
add_filter('script_loader_src', 'nx_remove_version_scripts_styles', 9999);