<?php if ( ! defined( 'ABSPATH' ) ) exit; 

/**
 * @AlexSpataru - 02 Nov 2018
 * Title tag support
 */
add_theme_support( 'title-tag' );
 
/**
 * @AlexSpataru - 02 Nov 2018
 * Post thumbnail support + sizes
 */
add_theme_support( 'post-thumbnails' );
add_image_size( 'fullhd', 1920, 999999 ); 
add_image_size( 'bootstrap', 1200, 999999 );
add_image_size( 'mobile', 768, 999999 );

/**
 * @AlexSpataru - 02 Nov 2018
 * Support for HTML5
 */
add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', ) );

/**
 * @AlexSpataru - 02 Nov 2018
 * Post formats
 */
add_theme_support( 'post-formats', array( 'aside', 'image', 'video', 'quote', 'link', ) );

/**
 * @AlexSpataru - 02 Nov 2018
 * WooCommerce
 */
add_theme_support( 'woocommerce' );
add_theme_support( 'wc-product-gallery-zoom' );
add_theme_support( 'wc-product-gallery-lightbox' );
add_theme_support( 'wc-product-gallery-slider' );

/**
 * @AlexSpataru - 02 Nov 2018
 * Custom logo
 */
add_theme_support( 'custom-logo', array(
	'height'      => 70,
	'width'       => 200,
	'flex-height' => true,
	'flex-width'  => true,
	'header-text' => array( 'site-title', 'site-description' ),
) );

/**
 * @AlexSpataru - 02 Nov 2018
 * You can define the taxonomies below
 */
 
 