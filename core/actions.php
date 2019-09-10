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

// WordPress logs rotation
add_filter( 'admin_init', function () {

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
