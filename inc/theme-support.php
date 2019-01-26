<?php /* From here we'll add the theme support */

if ( ! defined( 'ABSPATH' ) ) exit; 

/* 01 - Title Tag */
add_theme_support( 'title-tag' );

/* 02 - Enable support for Post Thumbnails on posts and pages. */
add_theme_support( 'post-thumbnails' );
add_image_size( 'fullhd', 1920, 999999 ); 
add_image_size( 'bootstrap', 1200, 999999 );
add_image_size( 'mobile', 768, 999999 );


/* 03 - Support for HTML5 */
add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', ) );

/* 04 - Posts formats
add_theme_support( 'post-formats', array( 'aside', 'image', 'video', 'quote', 'link', ) ); */

/* 05 - WooCommerce */
add_theme_support( 'woocommerce' );
add_theme_support( 'wc-product-gallery-zoom' );
add_theme_support( 'wc-product-gallery-lightbox' );
add_theme_support( 'wc-product-gallery-slider' );

/* 06 - Custom logo */
add_theme_support( 'custom-logo', array(
	'height'      => 70,
	'width'       => 200,
	'flex-height' => true,
	'flex-width'  => true,
	'header-text' => array( 'site-title', 'site-description' ),
) );

?>