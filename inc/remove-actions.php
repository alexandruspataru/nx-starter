<?php if ( ! defined( 'ABSPATH' ) ) exit; 

remove_action('wp_head', 'wp_generator'); // deletes wp generator
remove_action ('wp_head', 'rsd_link'); // deletes Weblog Client Link
remove_action( 'wp_head', 'wlwmanifest_link'); // deletes Manifest link
remove_action( 'wp_head', 'wp_shortlink_wp_head'); // deletes the Shortlink
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0); // deletes Prev / Next links
remove_action('wp_head', 'rel_canonical'); // deletes rel='canonical' 
remove_action('wp_head', 'feed_links_extra', 3 ); // deletes Comments Feed
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

?>