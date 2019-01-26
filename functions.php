<?php if ( ! defined( 'ABSPATH' ) ) exit;

// Theme defines
define('NX_ROOT', get_template_directory() . '/');											// Template root - for Front-End
define('NX_PATH', get_template_directory_uri() . '/');										// Template path - for Back-End (includes)
define('NX_CORE', NX_ROOT . 'core/');														// Core folder path
define('NX_DEV', (strpos($_SERVER['HTTP_HOST'], '.host') !== false) ? TRUE : FALSE);		// Theme development status - True on .host tdl (custom virtual hosts)

// Theme setup
function nx_theme_setup() {
	
	// Load the text domain - Front-End
	load_theme_textdomain( 'nexus', get_template_directory() . '/languages' );
	
	// Load the text domain - Back-End
	load_theme_textdomain( 'nexus-admin', get_template_directory() . '/languages' );

	// Register the menus
	register_nav_menus( array(
		'primary' => esc_html_x( 'Main menu', 'Main menu name', 'nexus-admin' ),
	) );
	
	// Get the theme support
	require_once NX_ROOT . 'core/theme-support.php';

}
add_action( 'after_setup_theme', 'nx_theme_setup' );

// Styles & Scripts
require_once NX_CORE . 'theme-scripts.php';

// Actions & Filters
require_once NX_CORE . 'actions.php';

// WP Bootstrap Navwalker
require_once NX_CORE . 'wp-bootstrap-navwalker.php';

// General functions
require_once NX_CORE . 'general-functions.php';

// Admin

/* Let's define the components we need for this project */
$components = array(

	'mobileDetect' => array( 'enabled' => false, 'path' => '/inc/optional/Mobile_Detect.php'),
	'ress' => array( 'enabled' => false, 'path' => '/inc/optional/ress.php'),
	'sidebars' => array( 'enabled' => false, 'path' => '/inc/sidebars.php'),
	'tgm' => array( 'enabled' => true, 'path' => '/inc/tgm-plugin-activation-options.php'),
	'customFields' => array( 'enabled' => true, 'path' => '/inc/custom-fields.php'),
	'removeActions' => array( 'enabled' => true, 'path' => '/inc/remove-actions.php'),
	'pageBuider' => array( 'enabled' => false, 'path' => '/inc/optional/page-buider.php'),
	'bootstrapNavwalker' => array( 'enabled' => true, 'path' => '/inc/optional/wp_bootstrap_navwalker.php'),
	'walkers' => array( 'enabled' => false, 'path' => '/inc/optional/walkers.php'),
	'title' => array( 'enabled' => false, 'path' => '/inc/optional/title.php'),

);