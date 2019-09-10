<?php
/*
Widget Name: Lightbox image / Video
Description: Image / Video with lightbox
Author: Alex Spataru
Author URI: https://alexspataru.com
*/

if ( ! defined( 'ABSPATH' ) ) exit; 

class nx_lightbox_Widget extends SiteOrigin_Widget {

	function __construct() {
		parent::__construct(
			'nx_lightbox',
			 'Lightbox image',
			array(
				'description' =>  'LImage / Video with lightbox',
				'panels_groups' => array('nx_widgets'),
				'panels_icon' => 'dashicons dashicons-format-image'
			),
			array(),
			array(
				
				'image' => array(
					'type' => 'media',
					'label' => esc_html_x('Image file', 'Widget - Lightbox image', 'nexus-admin'),
					'library' => 'image',
					'fallback' => true,
				),
				
				'size' => array(
					'type' => 'image-size',
					'label' => 'Image size',
				),
				
				'url' => array(
					'type' => 'link',
					'label' => esc_html_x('Destination URL - Select only if you want to display something else than the main image, YouTube video, for example.', 'Widget - Lightbox image', 'nexus-admin'),
				),
				
				'is_video'	=> array(
					'type'		=> 'checkbox',
					'label'		=> esc_html_x('Is video lightbox? If yes, we will include the play icon.', 'Widget - Lightbox image', 'nexus-admin'),
					'default'	=> false
				),
				
			),
			plugin_dir_path(__FILE__).'../'
		);
	}

	function get_style_name($instance){
		// We're not using a style
		return false;
	}

	function get_template_name($instance){
		return 'tpl';
	}
	
}

siteorigin_widget_register('nx_lightbox', __FILE__, 'nx_lightbox_Widget');