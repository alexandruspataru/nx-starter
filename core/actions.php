<?php 

if ( ! defined( 'ABSPATH' ) ) exit; 

// Cleaning up the wp_head
remove_action('wp_head', 'wp_generator');									// deletes wp generator
remove_action ('wp_head', 'rsd_link');										// deletes Weblog Client Link
remove_action( 'wp_head', 'wlwmanifest_link');								// deletes Manifest link
remove_action( 'wp_head', 'wp_shortlink_wp_head');							// deletes the Shortlink
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);			// deletes Prev / Next links
remove_action('wp_head', 'rel_canonical');									// deletes rel='canonical'
remove_action('wp_head', 'feed_links_extra', 3 );							// deletes Comments Feed
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );				// deletes the emojy styles
remove_action( 'wp_print_styles', 'print_emoji_styles' );					// deletes the emojy styles

/**
 * Filter the excerpt "read more" string.
 *
 * @param string $more "Read more" excerpt string.
 * @return string (Maybe) modified "read more" excerpt string.
 */
function nx_excerpt_more( $more ) {
	
    return '';
	
}
add_filter( 'excerpt_more', 'nx_excerpt_more' );

