<?php if ( ! defined( 'ABSPATH' ) ) exit; 

// Go ahead only if we have something to display
if( (is_numeric($instance['image']) && $instance['image'] > 0) || !empty($instance['image_fallback'])){
	
	// By default get the external image
	if(!empty($instance['image_fallback'])){
		
		$imgFile			 = $instance['image_fallback'];
	
	}
	
	// ... else, get the internal image
	else {
		
		// Get the source image
		$imgFile			 = wp_get_attachment_image_src( $instance['image'], $instance['size']);
		$imgFile			 = $imgFile[0]; // We want the url only
		
	}
	
	// Get the full image
	if(empty($instance['url'])){
		
		$imgDest		 = wp_get_attachment_image_src( $instance['image'], 'fullhd'); // The image should not be bigger than Full HD
		$imgDest		 = $imgDest[0]; // We want the url only
		
	} 
	
	// ... or the external link
	else {
		
		$imgDest		 = sow_esc_url($instance['url']);
		
	}
	
	// Video embed
	$videoCSS			 = '';
	$videoHTML			 = '';
	if($instance['is_video'] === true){
		
		$videoCSS		 = ' nx-width-video';
		$videoHTML		 = '<i class="fa fa-play-circle-o" aria-hidden="true"></i>';
		
		// Facebook links
		if(false !== strpos($imgDest, 'facebook.com')){
			
			$imgDest	 = nx_get_fb_video_link($imgDest);
			
		}

	}
	
	// Build the HTML
	$html				 = '<div class="nx-lightbox-img' . $videoCSS . '">';
	$html				.= '<a class="nx-fancybox" href="' . $imgDest . '"' . ((false !== strpos($imgDest, 'facebook.com')) ? ' data-type="iframe"' : ''  ) . '>';
	$html				.= '<img src="' . $imgFile . '" alt="Lightbox image" class="img-responsive">';	
	$html				.= $videoHTML;
	$html				.= '</a></div>';
	
	// Output the HTML
	echo $html;
	
}