<?php if ( ! defined( 'ABSPATH' ) ) exit; 

// Loops pagination
function nx_pagination($query) {
	
	// Need an unlikely integer
	$big				 = 999999999; 
	
	// Get the right query
	if(!empty($query)){
		
		// Avoid throwing errors
		$total			 = (isset($query->max_num_pages)) ? $query->max_num_pages : 0;

	} else {
		
		// Get the global query
		global $wp_query;
		
		$total			 = $wp_query->max_num_pages;
		
	}
	
	// Go ahead if we have 
	if( $total > 1 )  {
		
		// Get the current page
		if( !$current_page = get_query_var('paged') )
			 $current_page = 1;
		 
		// Get the permalink structure
		if( get_option('permalink_structure') ) {
			$format = 'page/%#%/';
		} else {
			$format = '&paged=%#%';
		}
		
		// Get the pages
		$pages =  paginate_links(array(
			'base'			=> str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
			'format'		=> $format,
			'current'		=> max( 1, get_query_var('paged') ),
			'total' 		=> $total,
			'mid_size'		=> 1,
			'end_size'		=> 1,
			'type' 			=> 'array',
			'prev_next'		=> false,
		 ) );			
		
		// Go ahead if we have anything to display
		if( is_array( $pages ) ) {
			
			// Current page
			$paged = ( get_query_var('paged') == 0 ) ? 1 : get_query_var('paged');
			
			echo '<div class="nx-pagination"><ul class="pagination">';
			
			// Pages loop
			foreach ( $pages as $page ) {
				
				echo '<li class="nx-pagination-li">$page</li>';
				
			}
			
			echo '</ul></div>';
		}
		
	}
	
}

