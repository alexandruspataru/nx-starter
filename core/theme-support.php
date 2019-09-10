<?php if ( ! defined( 'ABSPATH' ) ) exit; 

// Title tag
add_theme_support( 'title-tag' );
 
// Post thumbnail support + sizes
add_theme_support( 'post-thumbnails' );
add_image_size( 'fullhd', 1920, 999999 ); 
add_image_size( 'bootstrap', 1200, 999999 );
add_image_size( 'mobile', 768, 999999 );
add_image_size( 'nx_thumb', 500, 312, true );

// Support for HTML5
add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', ) );

// Post formats
// They are not supported by default. They can be enabled only if the theme needs them
// add_theme_support( 'post-formats', array( 'aside', 'image', 'video', 'quote', 'link', ) );

// WooCommerce
add_theme_support( 'woocommerce' );
add_theme_support( 'wc-product-gallery-zoom' );
add_theme_support( 'wc-product-gallery-lightbox' );
add_theme_support( 'wc-product-gallery-slider' );

// Custom logo
add_theme_support( 'custom-logo', array(
	'height'      => 70,
	'width'       => 200,
	'flex-height' => true,
	'flex-width'  => true,
	'header-text' => array( 'site-title', 'site-description' ),
) );

// Add the custom image sizes to gallery shortcode
add_filter( 'image_size_names_choose', function ($sizes) {

	return array_merge( $sizes, array('nx_thumb' => 'Thumbnail - 16:10 ratio', 'bootstrap' => 'Full size - 1200px wide', 'mobile' => 'Tablet size - 768px wide'));

});
