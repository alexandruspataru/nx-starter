<?php if ( ! defined( 'ABSPATH' ) ) exit;

/* From here we'll make the conditionals for displaying the page title */

function nexus_page_title(){
	
	if(is_singular()){
		
		the_title();
		
	} elseif(is_archive()){
		
		the_archive_title();
		
	} elseif(is_search()){
		
		printf( esc_html__( 'Search Results for: %s', 'nexus' ), '<span>' . get_search_query() . '</span>' );
		
	} elseif(is_404()){
		
		echo __( 'Page Not Found', 'nexus' );
		
	}
	
	
}

/* Let's remove the tags from archive */
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
		
		$title = get_the_date( _x( 'Y', 'yearly archives date format' ) );
		
	} elseif ( is_day() ) {
		
        $title = get_the_date( _x( 'j F Y', 'daily archives date format' ) );
		
    } elseif ( is_post_type_archive() ) {
		
        $title = post_type_archive_title( '', false );
		
    } elseif ( is_tax() ) {
		
        $title = single_term_title( '', false );
		
    }

    return $title;

});

