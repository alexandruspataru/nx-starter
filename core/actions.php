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

// Edit the archives title format
add_filter( 'get_the_archive_title', function ($title) {

	if ( is_category() ) {

		$title = single_cat_title( '', false );

	} elseif ( is_tag() ) {

		$title = single_tag_title( '', false );

	} elseif ( is_author() ) {

		$title = get_the_author();

	} elseif ( is_month() ){
		
		$title = single_month_title('', false);
		
	} elseif ( is_year() ){
		
		$title = get_the_date( 'Y' );
		
	} elseif ( is_day() ) {
		
        $title = get_the_date( 'j F Y' );
		
    } elseif ( is_post_type_archive() ) {
		
        $title = post_type_archive_title( '', false );
		
    } elseif ( is_tax() ) {
		
        $title = single_term_title( '', false );
		
    }

    return $title;

});
