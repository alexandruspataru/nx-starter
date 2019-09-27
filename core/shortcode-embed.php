<?php if ( ! defined( 'ABSPATH' ) ) exit;

// The following function will add the Bootstrap responsive embed support
add_filter( 'embed_oembed_html', 'nx_change_video_embed', 99, 4 );
function nx_change_video_embed( $html, $url, $attr, $post_ID ) {
	
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
	
}