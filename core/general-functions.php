<?php if ( ! defined( 'ABSPATH' ) ) exit; 

/**
 * Here we'll setup all the required functions.
 *
 * In case that any plugin will fall to be activated or any function is deprecated, the site will continue to work
 * with the except of the selected functions. 
 *
 * Also by firing the function on the "wp" action, we make sure that the plugin can be activated / deactivated safely. 
 *
 */
function nx_mandatory_functions() {

    $mandatoryFunctions = array('get_field', 'have_rows', 'get_sub_field',);

	foreach($mandatoryFunctions as $function){
		
		if(!function_exists($function)){
			
			$create_function	= $function;
			$create_function	= 'function ' . $create_function . "() { return; }";
			eval($create_function);

		}
		
	}
}
add_action('wp', 'nx_mandatory_functions');

// Creating a better var_dump
function nx_dump($toDebug = '', $container = false){

	$html						 = '<div class="nx-debug">';
	$html						.= ($container === true) ? '<div class="container"><div class="row"><div class="col-xs-12">' : '';
	$html						.= '<pre><xmp>' . var_export($toDebug, true) . '</xmp></pre>';
	$html						.= ($container === true) ? '</div></div></div>' : '';
	$html						.= '</div>';
	
	echo $html;
	
}

// Add mobile CSS class to body
function nx_body_classes( $classes ) {
	
	if(wp_is_mobile()){
		
		$classes[]		 = 'nx-mobile';
		
	}
	
	// Add the custom body class
	$pageInfo			 = nx_get_page_custom_fields();
	
	if(is_array($pageInfo) && isset($pageInfo['nx_page_custom_body_class']) && !empty($pageInfo['nx_page_custom_body_class'])){
		
		$classes[]		 = $pageInfo['nx_page_custom_body_class'];
	}
	
	return $classes;
	
}
add_filter( 'body_class', 'nx_body_classes' );

// Register the sidebars
function nx_widgets_init() {
	
	// Main sidebar
	register_sidebar( array(
		'name'          => 'Main Sidebar',
		'id'            => 'sidebar',
		'description'   => '',
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	
	// Footer - Column #1
	register_sidebar( array(
		'name'          => 'Footer - Column 1',
		'id'            => 'footer_1',
		'description'   => '',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	
	// Footer - Column #2
	register_sidebar( array(
		'name'          => 'Footer - Column 2',
		'id'            => 'footer_2',
		'description'   => '',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	
	// Footer - Column #3
	register_sidebar( array(
		'name'          => 'Footer - Column 3',
		'id'            => 'footer_3',
		'description'   => '',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	
	// Footer - Column #4
	register_sidebar( array(
		'name'          => 'Footer - Column 4',
		'id'            => 'footer_4',
		'description'   => '',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	
	
}
add_action( 'widgets_init', 'nx_widgets_init' );

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

// Get the page info
function nx_get_page_custom_fields($id = ''){
	
	// Try to get the cached result
	$pageInfo								 = wp_cache_get( 'nx_page_custom_fields' );
	
	if ( false === $pageInfo ) {
	
		// Store the default data
		$pageInfo						 	 = array(
			'nx_page_custom_css'			 => '',
			'nx_page_custom_js'				 => '',
			'nx_page_custom_body_class'		 => '',
		);
		
		// Store the custom fields
		$customFields						 = array();
		
		// Singular
		if(is_singular()){
			
			$postID							 = (!empty($id) && is_numeric($id)) ? $id : get_the_ID();
			$customFields					 = get_post_meta($postID);

		}
		
		// Category
		elseif(is_category()){
			
			$termInfo						 = get_queried_object();
			$customFields					 = get_term_meta($termInfo->term_id);
		
		}

		// Asign the custom fields
		if(!empty($customFields) && is_array($customFields)){
		
			foreach($pageInfo as $key => $value){
					
				$pageInfo[$key]				 = (isset($customFields[$key][0])) ? $customFields[$key][0] : $pageInfo[$key];
				
			}
		
		}
		
		// Add the page info to caching
		wp_cache_set( 'nx_page_custom_fields', $pageInfo );
		
	}

	return $pageInfo;
	
}

// Insert the page custom meta + styles
function nx_inject_wp_head(){
	
	// Get the site Javascript
	$siteCustomCSS			 = nx_get_site_config('custom_css');
	if(!empty($siteCustomCSS)){
		
		echo "\n\n\t<!-- Site Custom CSS start -->\n\t";
		echo $siteCustomCSS;
		echo "\n\t<!-- Site Custom CSS -->\n\n";
		
	}
	
	// Get the current fields
	$pageInfo				 = nx_get_page_custom_fields();
	
	// Something is wrong
	if(!is_array($pageInfo)) return;
	
	// Store the markup
	$html					 = "\n\n\t<!-- Page Settings start -->";
	
	// Custom CSS
	if(isset($pageInfo['nx_page_custom_css']) && !empty($pageInfo['nx_page_custom_css'])){
		
		$html				.= "\n\t" . $pageInfo['nx_page_custom_css'];
		
	}
	
	$html					.= "\n\t<!-- Page Settings end -->\n\n";
	
	// Output everything
	echo $html;
	
}
add_action('wp_head', 'nx_inject_wp_head');

// Insert page scripts - after page scripts are already loaded (n.r. jQuery & vendor.js).
function nx_inject_wp_footer(){
	
	// Get the site Javascript
	$siteCustomJS			 = nx_get_site_config('custom_js');
	if(!empty($siteCustomJS)){
		
		echo "\n\n\t<!-- Site Custom Javascript start -->\n\t";
		echo $siteCustomJS;
		echo "\n\t<!-- Site Custom Javascript -->\n\n";
		
	}
	
	// Get the current fields
	$pageInfo				 = nx_get_page_custom_fields();
	
	// Something is wrong
	if(!is_array($pageInfo)) return;
	
	// Custom Javascript
	if(isset($pageInfo['nx_page_custom_js']) && !empty($pageInfo['nx_page_custom_js'])){
		
		// Store the markup
		
		$html				 = "\n\n\t<!-- Page Scripts start -->";
		$html				.= "\n\t" . $pageInfo['nx_page_custom_js'];
		$html				.= "\n\t<!-- Page Scripts end -->\n\n";
		
		// Output everything
		echo $html;
		
	}
	
}
add_action('wp_footer', 'nx_inject_wp_footer', 90);

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
		return (array_key_exists($field, $settings)) ? $settings[$field] : '';
	
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
	$meta				 = get_post_meta(get_the_ID());
	
	// Default title
	$cssClass			 = 'nx-default-title';
	
	// Should we display the page title? Default: Yes
	$showTitle			 = (array_key_exists('nx_enable_page_title', $meta)) ? $meta['nx_enable_page_title'][0] : 1;
	
	// Get the subtitle
	$subTitle			 = (array_key_exists('nx_page_subtitle', $meta)) ? $meta['nx_page_subtitle'][0] : '';
	
	
	
	// Get the custom title
	$customTitle		 = '';
	if(array_key_exists('nx_custom_title', $meta)){
		
		$customTitle	 = $meta['nx_custom_title'][0];
		$cssClass		 = 'nx-custom-title';

	}
	
	// Display the title only if we checked that we want to display it
	if($showTitle == 1){
		
		// Get the final title
		$postTitle		 = ($customTitle !== '' && !empty($customTitle)) ? $customTitle : get_the_title();
		
		// Get the subtitle
		$postSubTitle	 = ($subTitle !== '' && !empty($subTitle)) ? '<span class="nx-subtitle">' . $subTitle . '</span>' : '';
		
		// Final title
		$titleHTML		 = '<h1 class="page-title ' . $cssClass . '">' . $postTitle . ' ' . $postSubTitle . '</h1>';
		
		return $titleHTML;
		
	}

}

