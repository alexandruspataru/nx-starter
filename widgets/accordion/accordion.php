<?php
/*
Widget Name: Accordion
Description: Accordion
Author: Alex Spataru
Author URI: https://alexspataru.com
*/

if ( ! defined( 'ABSPATH' ) ) exit; 

class nx_accordion_Widget extends SiteOrigin_Widget {

	function __construct() {
		parent::__construct(
			'nx_accordion',
			 'Accordion',
			array(
				'description' =>  esc_html_x('Accordion', 'Widget - Accordion', 'nexus-admin'),
				'panels_groups' => array('nx_widgets'),
				'panels_icon' => 'dashicons dashicons-editor-justify'
			),
			array(),
			array(
			
				'elements' => array(
					'type' => 'repeater',
					'label' => 'Sections',
					'item_name' => 'Section',
					'item_label' => array(
						'selector' => "[id*='elements-title']",
						'update_event' => 'change',
						'value_method' => 'val'
					),
					'fields' => array(
						
						'title' => array(
							'type' => 'text',
							'label' => esc_html_x('Section title', 'Widget - Accordion', 'nexus-admin'),
						),
					
						'info' => array(
							'type' => 'tinymce',
							'label' => esc_html_x('Content', 'Widget - Accordion', 'nexus-admin'),
							'rows' => 5,
							'default_editor' => 'tinymce',
						),
						
					),
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

siteorigin_widget_register('nx_accordion', __FILE__, 'nx_accordion_Widget');