<?php
/*
Widget Name: Image slider
Description: Image slider - with caption & link button
Author: Alex Spataru
Author URI: https://alexspataru.com
*/

if ( ! defined( 'ABSPATH' ) ) exit; 

class nx_carousel_Widget extends SiteOrigin_Widget {

	function __construct() {
		parent::__construct(
			'nx_carousel',
			 'Image slider',
			array(
				'description' =>  esc_html_x('Image slider - with caption & link button', 'Widget - Image slider', 'nexus-admin'),
				'panels_groups' => array('nx_widgets'),
				'panels_icon' => 'dashicons dashicons-images-alt2'
			),
			array(),
			array(

				'slides' => array(
					'type' => 'repeater',
					'label' => 'Images',
					'item_name' => 'Image',
					'item_label' => array(
						'selector' => "[id*='slides-caption']",
						'update_event' => 'change',
						'value_method' => 'val'
					),
					'fields' => array(
					
						'pic' => array(
							'type' => 'media',
							'label' => esc_html_x('Image - The bigger the section is, the bigger the image should be.', 'Widget - Image slider', 'nexus-admin'),
						),
						
						'caption' => array(
							'type' => 'text',
							'label' => esc_html_x('Caption title', 'Widget - Image slider', 'nexus-admin'),
						),
						
						'description' => array(
							'type' => 'textarea',
							'label' => esc_html_x('Caption description', 'Widget - Image slider', 'nexus-admin'),
						),
						
						'label' => array(
							'type' => 'text',
							'label' => esc_html_x('Button text', 'Widget - Image slider', 'nexus-admin'),
						),
						
						'link' => array(
							'type' => 'link',
							'label' => esc_html_x('Button link', 'Widget - Image slider', 'nexus-admin'),
						),

					),
				),
				
				'timeout' => array(
					'type' => 'select',
					'label' => esc_html_x('Timeout - The time between slides', 'Widget - Image slider', 'nexus-admin'),
					'default' => '4',
					'options' => array(
						'3' => '3 ' . esc_html_x('seconds', 'Widget - Image slider', 'nexus-admin'),
						'4' => '4 ' . esc_html_x('seconds', 'Widget - Image slider', 'nexus-admin'),
						'5' => '5 ' . esc_html_x('seconds', 'Widget - Image slider', 'nexus-admin'),
						'6' => '6 ' . esc_html_x('seconds', 'Widget - Image slider', 'nexus-admin'),
						'7' => '7 ' . esc_html_x('seconds', 'Widget - Image slider', 'nexus-admin'),
						'8' => '8 ' . esc_html_x('seconds', 'Widget - Image slider', 'nexus-admin'),
						'9' => '9 ' . esc_html_x('seconds', 'Widget - Image slider', 'nexus-admin'),
						'10' => '10 ' . esc_html_x('seconds', 'Widget - Image slider', 'nexus-admin'),
					)
				)
				
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

siteorigin_widget_register('nx_carousel', __FILE__, 'nx_carousel_Widget');