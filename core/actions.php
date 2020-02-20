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

// Remove the "Read more" text
add_filter( 'excerpt_more', function(){
	
	return '';
	
});

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

// WordPress logs rotation
add_filter( 'admin_init', function () {
	
	// This function is intended to keep your debug.log file as small as possible
	// The response time might be big if the file is 100MB or bigger

	// Do nothing if the debug log is disabled
	if(!defined('WP_DEBUG') || WP_DEBUG !== true) return;
	
	// Logs folder & Default log file
	$logsPath				 = WP_CONTENT_DIR . '/nx-logs/';
	$logsFile				 = WP_CONTENT_DIR . '/debug.log';
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////				Part #1 - Directory checks				/////////////////////////////////////////
	/////////////						Create the log directoty, in case it doesn't already exist								/////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if(!file_exists($logsPath)){
		
		// Create the index.php file
		if(mkdir($logsPath)){
			
			$logsIndex		 = $logsPath . 'index.php';
			$indexContent	 = "<?php \n\n";
			$indexContent	.= "// The public access to this directory is forbidden\n";
			$indexContent	.= "// We'll send the 'user' to the main page of the site\n";
			$indexContent	.= "header( 'HTTP/1.1 404 Not Found' );\n";
			$indexContent	.= "header( 'Location: http://' . $" . "_SERVER['HTTP_HOST']" . ");\n"; // Avoid  - Fatal error: syntax error, unexpected '' (T_ENCAPSED_AND_WHITESPACE),
			$indexContent	.= "exit;\n\n";
			$indexContent	.= "?>";
			
			if(!file_exists($logsIndex)){
				
				file_put_contents($logsIndex, $indexContent);
				
			}
			
		}

	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////					Part #2 - Archive files				////////////////////////////////////////
	/////////////					Check if the log file is bigger than it should be and "archive" it							/////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if(file_exists($logsFile)){
		
		$maxFileSize			 = 10485760; // 10485760 = 10MB
		$logFileSize			 = filesize($logsFile);

		if($logFileSize > $maxFileSize){
			
			// New file name
			$logNewName			 = 'nx-debug-' . date('Y-m-d_H-i-s');
			
			// Try to archive the file
			if(class_exists('ZipArchive')){
				
				// Create the archive
				$zip			 = new ZipArchive();											
				
				// Store the full path of the archive
				$zipLocation	 = $logsPath . $logNewName . '.zip';								

				// Try to add the file to the archive
				if ($zip->open($zipLocation, ZIPARCHIVE::CREATE) === TRUE) {
					
					$zip->addFile($logsFile, $logNewName . '.log');
					
					// Close and save the archive
					$zip->close(); 
				}

			}
			
			// No archive software present
			else {
				
				// Create the old log file
				$oldFilePath	 = $logsPath . $logNewName . '.log';
				$oldFileContent	 = file_get_contents($logsFile);
				file_put_contents($oldFilePath, $oldFileContent);
				
			}

			// Remove the old file
			unlink($logsFile);
			
		}

	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////					 Part #3 - Clear logs				 ////////////////////////////////////////
	/////////////							Check if any log file is older than 90 days and remove it							/////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Get the folder content
	$folderContent				 = array_diff(scandir($logsPath), array('.', '..'));

	// Store the valid zip file
	$zipFiles					 = array();

	// Filter folder files
	foreach($folderContent as $file){
		
		if(pathinfo($file, PATHINFO_EXTENSION) == 'zip'){
			
			$zipFiles[]			 = $file;
			
		}
		
	}

	// Go ahead if we have something
	if(count($zipFiles) > 0){
		
		foreach($zipFiles as $zipFile){
					
			// File location
			$filePath			 = $logsPath . $zipFile;
			
			// Making sure the file exists
			if(!file_exists($filePath)) continue;
			
			// File timestamp
			$fileTime			 = filemtime($filePath);
			
			// Current timestamp
			$currentTime		 = time();
			
			// Difference days
			$days				 = round(($currentTime - $fileTime) / (60 * 60 * 24));
			
			// Logs older than 90 days will be deleted
			if($days >= 90){
				
				// Remove the old file
				if(unlink($filePath)){
					
					$logMessage	 = date('F j, Y - H:i:s') . ' - Succesfully removed - ' . $filePath . "\n";
					
					file_put_contents($logsPath . 'nx-removed-logs.log', $logMessage, FILE_APPEND);
					
				} else {
					
					$logMessage	 = date('F j, Y - H:i:s') . ' - Could not remove - ' . $filePath . "\n";
					
					file_put_contents($logsPath . 'nx-removed-logs.log', $logMessage, FILE_APPEND);
					
				}
				
			}
			
		}
		
	}
	
});

// Add table support to WP editor
add_filter( 'mce_buttons', function($buttons) {
    array_push( $buttons, 'separator', 'table' );
    return $buttons;
});

// Register the new TinyMCE plugin
add_filter( 'mce_external_plugins', function($plugins) {
	
	$plugins['table'] = NX_PATH . 'assets/js/tinymce-table.js';
	return $plugins;
	
}, 99 );

// Mandatory functions
add_action( 'wp', function (){
	
	/**
	 * Here we'll setup all the required functions.
	 *
	 * In case that any plugin will fall to be activated or any function is deprecated, the site will continue to work
	 * with the except of the selected functions. 
	 *
	 * Also by firing the function on the "wp" action, we make sure that the plugin can be activated / deactivated safely. 
	 *
	 */

	$mandatoryFunctions					 = array('get_field', 'have_rows', 'get_sub_field',);

	foreach($mandatoryFunctions as $function){
		
		if(!function_exists($function)){
			
			$create_function			 = $function;
			$create_function			 = 'function ' . $create_function . "() { return; }";
			eval($create_function);

		}
		
	}

});

// Add body custom CSS classes
add_filter( 'body_class', function($classes) {
	
	if(wp_is_mobile()){
		
		$classes[]		 = 'nx-mobile';
		
	}
	
	// Add the custom body class
	$pageInfo			 = nx_get_page_custom_fields();
	
	if(is_array($pageInfo) && isset($pageInfo['nx_body_class']) && !empty($pageInfo['nx_body_class'])){
		
		$classes[]		 = $pageInfo['nx_body_class'];
		
	}
	
	return $classes;

});

// Register the sidebars
add_action( 'widgets_init', function() {
	
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

}, 10, 2);

// Insert the page custom meta + styles
add_action('wp_head', function(){
	
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
	
});

// Insert page scripts - after page scripts are already loaded (n.r. jQuery & vendor.js).
add_action('wp_footer', function(){
	
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
	
}, 90);

// The following function will add the Bootstrap responsive embed support
add_filter( 'embed_oembed_html', function($html, $url, $attr, $post_ID) {
	
	// YouTube / Vimeo
	if ( false !== strpos( $url, 'youtube.com' ) || false !== strpos( $url, 'vimeo.com' ) ) {
		
		$cssClass				 = '';
		
		// YouTube
		if(false !== strpos( $url, 'youtube.com'))
			$cssClass			 = 'nx-youtube';
		
		// Vimeo
		elseif(false !== strpos( $url, 'vimeo.com'))
			$cssClass			 = 'nx-vimeo';
			
		// Creating the new markup
		$newHTML				 = '<div class="embed-responsive embed-responsive-16by9 ' . $cssClass . '">';
		$newHTML				.= str_replace('<iframe', '<iframe class="embed-responsive-item"', $html);
		$newHTML				.= '</div>';
		
		return $newHTML;
		
    }
	
	// Default HTML
	return $html;
	
}, 99, 4 );
