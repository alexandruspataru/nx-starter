<?php
if ( ! defined( 'ABSPATH' ) ) exit; 

/* If we don't install the plugin, do nothing */
if( !function_exists('acf_add_options_page') ) {
	return;
}

/* Theme Options */
if( function_exists('acf_add_options_page') ) {
	
	acf_add_options_page(array(
		'page_title' 	=> 'Setari Website',
		'menu_title'	=> 'Setari Website',
		'menu_slug' 	=> 'setari-website',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
	
}

/* Logo */
function nexus_site_logo(){
	
	$img = '';
	$imgSrc = '';
	$imgOption = get_field('logo', 'option');
	
	if(!empty($imgOption)){
		
		$imgSrc = $imgOption;
		
	} else{
		
		$imgSrc = get_template_directory_uri() . '/assets/img/logo.png';
		
	}
	
	$img = '<img src="' . $imgSrc . '" alt="' . get_bloginfo('name') . '" />';	
	
	echo $img;
	
}

/* Seo markup */
function nexus_page_seo(){
	if( function_exists('acf_add_local_field_group') && is_page()){
		
		/* Meta description && Keywords */
		$seo_fields = array(
			'description' => get_field('meta_descriere'),
			'keywords' => get_field('meta_keywords'),
		);
		
		/* Facebook Picture */
		$pictureChoice = get_field('poza_facebook');
		$picture = '';
		
		if($pictureChoice == 'Featured Image'){			
			
			$page_id = get_queried_object_id();
			
			if ( has_post_thumbnail( $page_id ) ) :
			
				$image_array = wp_get_attachment_image_src( get_post_thumbnail_id( $page_id ), 'optional-size' );
				$picture = $image_array[0];
				
			else :
			
				$picture = '';
				
			endif;
			
		} else{
			
			$picture = get_field('imagine_facebook');
			
		}
				
		/* Generating the HTML code */		
		$html = '';
		
		/* Meta Description */
		if($seo_fields['description'] != ''){
			
			$html .= '<meta name="description" content="' . $seo_fields['description'] . '">' . "\n";
			$html .= '<meta name="og:description" content="' . $seo_fields['description'] . '">' . "\n";
			
		}
		
		/* Meta Keywords */
		if($seo_fields['keywords'] != ''){
			
			$html .= '<meta name="keywords" content="' . $seo_fields['keywords'] . '">' . "\n";
			
		}
		
		/* Facebook Picture */
		if($picture != ''){
			
			$html .= '<meta name="og:image" content="' . $picture . '">' . "\n";
			
		}
		
		echo $html;

	}
}

/* Custom CSS */
function nexus_custom_css(){
	
	$cssCode = get_field('custom_css', 'option');
	
	/* Displaying the code only if is not empty */
	if(!empty($cssCode)){
		
		echo '<!-- Site Custom CSS -->';
		echo $cssCode;
		
	}
	
}

/* Custom JS */
function nexus_custom_js(){
	
	$jsCode = get_field('custom_js', 'option');
	
	/* Displaying the code only if is not empty */
	if(!empty($jsCode)){
		
		echo '<!-- Site Custom Javascript -->';
		echo $jsCode;
		
	}
	
}

add_action('wp_head','nexus_page_seo', 5); /* Adding the meta tags right before the links */
add_action('wp_head','nexus_custom_css', 200);/* Adding the css */
add_action('wp_footer','nexus_custom_js', 200); /* Adding the js AFTER the other js libraries */

/* Social Media */
function nexus_social_media(){
	
	$networks = get_field('social_links', 'option');
	if($networks){
		
		$html = '';
		$html .= '<ul class="nexusSocial">';

		foreach($networks as $row){
			
			if(!empty($row['retea_sociala']) && !empty($row['link'])){
				
				$cssClass = str_replace('fa-', '', $row['retea_sociala']);
				
				$html .= '<li class="' . $cssClass . '"><a href="' . $row['link'] . '" target="_blank">';
				$html .= '<i class="fa ' . $row['retea_sociala'] . '"></i></a></li>';
				
			}
			
		}

		$html .= '</ul>';
		
		return $html;
		
	}
	
}


?>