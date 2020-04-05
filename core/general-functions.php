<?php if ( ! defined( 'ABSPATH' ) ) exit; 

// Creating a better var_dump
function nx_dump($toDebug = '', $container = false){

	$html						 = '<div class="nx-debug">';
	$html						.= ($container === true) ? '<div class="container"><div class="row"><div class="col-xs-12">' : '';
	$html						.= '<pre><xmp>' . var_export($toDebug, true) . '</xmp></pre>';
	$html						.= ($container === true) ? '</div></div></div>' : '';
	$html						.= '</div>';
	
	echo $html;
	
}

// Get the page info
function nx_get_page_custom_fields($field = '', $id = ''){
	
	// The function is intended only for singular types
	if(!is_singular())
		return false;
	
	// Get the post ID
	$postID									 = (!empty($id) && is_numeric($id)) ? $id : get_the_ID();
	
	// Create the cached name
	$postCacheName							 = 'nx_page_' . $postID . '_custom_fields';
	
	// Try to get the cached result
	$pageInfo								 = wp_cache_get($postCacheName);
	
	if ($pageInfo === false) {
		
		// Keep all the fields
		$pageInfo							 = array();
	
		// Store the default data
		$pageFields						 	 = array(
			'nx_page_custom_css'			 => '',
			'nx_page_custom_js'				 => '',
			'nx_page_custom_body_class'		 => '',
			'nx_page_disable_top_bar'		 => '',
			'nx_page_disable_header'		 => '',
			'nx_page_disable_footer'		 => '',
		);
		
		// Store the custom fields
		$customFields						 = get_post_meta($postID);
		
		// Asign the custom fields
		if(!empty($customFields) && is_array($customFields)){
		
			foreach($pageFields as $key => $value){
				
				// Store the new key
				$new_key					 = str_replace('nx_page_', '', $key);

				$pageInfo[$new_key]			 = (isset($customFields[$key][0])) ? $customFields[$key][0] : '';
				
			}
		
		}
		
		// Add the page info to caching
		wp_cache_set($postCacheName, $pageInfo);
		
	}

	// Return a specific setting / field or the entire array
	if(!empty($field)){
		
		// Get all the fields
		if($field == 'all'){
			
			return $pageInfo;
			
		}
		
		// Get a specific field
		elseif(isset($pageInfo[$field])){
			
			return $pageInfo[$field];
			
		}

	}

	// Return null
	return null;
	
	
}

// Loops pagination
function nx_pagination($query = '') {
	
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
				
				echo "<li class=\"nx-pagination-li\">$page</li>";
				
			}
			
			echo '</ul></div>';
		}
		
	}
	
}

// Store the website settings
function nx_get_site_config($field = ''){
	
	// Get the database connection
	global $wpdb;
	
	// Store all the settings
	$settings						 = wp_cache_get( 'nx_site_settings' );
	
	if ( false === $settings ) {
	
		// Get all the site settings
		$result						 = $wpdb->get_results ("SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE 'options_nx_site_%'", ARRAY_A);
		
		// Keep the social networks
		$links						 = array();
		$networks					 = array();
		
		if(!empty($result) && is_array($result)){
			
			foreach($result as $option){
				
				// Remove the options_ from name
				$optionName			 = str_replace('options_nx_site_', '', $option['option_name']);
				
				// Social network links
				if(strpos($optionName, 'social_networks_') !== false && strpos($optionName, '_link') !== false){
					
					$links[]		 = $option['option_value'];
					
				}
				
				// Social network links
				elseif(strpos($optionName, 'social_networks_') !== false && strpos($optionName, '_network') !== false){
					
					$networks[]		 = $option['option_value'];
					
				} 
				
				else{
					
					// Add the result to output
					$settings[$optionName] = $option['option_value'];
					
				}
				
			}
			
			// Adding the social networks
			$settings['social_networks'] = (!empty($links) && !empty($networks)) ? array_combine($networks, $links) : array();
		
		}
		
		// Add the page info to caching
		wp_cache_set( 'nx_site_settings', $settings );
	
	}
	
	// Return a specific setting / field or the entire array
	if(!empty($field)){
		
		// Return nothing if the key doesn exist
		return (is_array($settings) && array_key_exists($field, $settings)) ? $settings[$field] : '';
	
	}
	
	// Return everything
	else {
		
		return $settings;
		
	}

}

// Check if the page / post has a custom title 
function nx_page_title(){
	
	// Do nothing if the place from where the function was called is not singular
	if(!is_singular()) return '';
		
	// Get all the site meta into a variable so we'll not make a ton of queries using the get_field() function (from ACF plugin)
	$meta					 = nx_get_page_custom_fields();
	
	// Something is wrong. Stop executing.
	if(empty($meta) || !is_array($meta))
		return '<h1 class="nx-page-title">' . get_the_title() . '</h1>';
	
	// The page title is disabled
	if(isset($meta['nx_enable_page_title']) && $meta['nx_enable_page_title'] == 0)
		return;
	
	// Get the subtitle
	$subTitle				 = (isset($meta['nx_page_subtitle'])) ? $meta['nx_page_subtitle'] : '';
	
	// Get the title
	$postTitle				 = (isset($meta['nx_custom_title']) && !empty($meta['nx_custom_title'])) ? $meta['nx_custom_title'] : get_the_title();
	
	// Create the HTML
	$html					 = '<h1 class="nx-page-title">';
	$html					.= $postTitle;
	$html					.= (!empty($subTitle)) ? '<span class="nx-subtitle">' . $subTitle . '</span>' : '';
	$html					.= '</h1>';
	
	return $html;

}

// Get the embed link for Facebook links
function nx_get_fb_video_link($link = ''){
	
	// Get the iframe source, in case it exists
	if(false !== strpos($link, '<iframe')){
		
		preg_match('/src="([^"]+)"/', $link, $match);
		$link			= (isset($match[1])) ? $match[1] : '';
		
	}
	
	// Store the final link
	$finalLink			 = '';
		
	// Store the video ID
	$videoID			 = '';
	
	// Decode the URL (in case we have an iframe, the final link will be URL-encoded)
	$link				 = urldecode($link);
	
	// Split the link by /
	$linkParts			 = explode('/', $link);
	
	// Get the ID
	foreach($linkParts as $linkPart){

		if(is_numeric($linkPart)){
			
			$videoID	 = $linkPart;
			
			break;
		}
		
	}
	
	// We have a valid link
	if(is_numeric($videoID)){
		
		$finalLink		 = 'https://www.facebook.com/v2.5/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D' . $videoID;
		
	}

	return $finalLink;
	
}

