<?php if ( ! defined( 'ABSPATH' ) ) exit;

// Theme defines
define('NX_ROOT', get_template_directory() . '/');											// Template root - for Back-End (includes)
define('NX_PATH', get_template_directory_uri() . '/');										// Template path - for Front-End
define('NX_CORE', NX_ROOT . 'core/');														// Core folder path
define('NX_DEV', (strpos($_SERVER['HTTP_HOST'], '.host') !== false) ? TRUE : FALSE);		// Theme development status - True on .host tdl (custom virtual hosts)

// Theme setup
function nx_theme_setup() {
	
	// Load the text domain - Front-End
	load_theme_textdomain( 'nexus', get_template_directory() . '/languages' );
	// Register the menus
	register_nav_menus( array(
		'primary' => 'Main menu',
	) );
	
	// Get the theme support
	require_once NX_CORE . 'theme-support.php';

}
add_action( 'after_setup_theme', 'nx_theme_setup' );

// Includes
require_once (NX_CORE . 'theme-scripts.php');												// Styles & Scripts
require_once (NX_CORE . 'actions.php');														// Actions & Filters
require_once (NX_CORE . 'admin/wp-bootstrap-navwalker.php');								// WP Bootstrap Navwalker
require_once (NX_CORE . 'general-functions.php');											// General functions
require_once (NX_CORE . 'shortcode-gallery.php');											// Gallery shortcode
require_once (NX_ROOT . 'widgets/main.php');												// SiteOrigin Page Builder - Custom widgets
