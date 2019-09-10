<?php
/*
Widget Name: Modal
Description: Button that opens up a popup with content
Author: Alex Spataru
Author URI: https://alexspataru.com
*/

if ( ! defined( 'ABSPATH' ) ) exit; 

class nx_modal_Widget extends SiteOrigin_Widget {

	function __construct() {
		parent::__construct(
			'nx_modal',
			 'Modal',
			array(
				'description' =>  esc_html_x('Button that opens up a popup with content', 'Widget - Modal', 'nexus-admin'),
				'panels_groups' => array('nx_widgets'),
				'panels_icon' => 'dashicons dashicons-editor-justify'
			),
			array(),
			array(
			
				'modal_btn_text' => array(
					'type' => 'text',
					'label' => esc_html_x('Button text*', 'Widget - Modal', 'nexus-admin'),
				),
			
				'modal_title' => array(
					'type' => 'text',
					'label' => esc_html_x('Modal title*', 'Widget - Modal', 'nexus-admin'),
				),
			
				'modal_content' => array(
					'type' => 'tinymce',
					'label' => esc_html_x('Content*', 'Widget - Modal', 'nexus-admin'),
					'rows' => 5,
					'default_editor' => 'tinymce',
				),
				
				'modal_close_btn' => array(
					'type' => 'text',
					'label' => esc_html_x('Close - Button text*', 'Widget - Modal', 'nexus-admin'),
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

siteorigin_widget_register('nx_modal', __FILE__, 'nx_modal_Widget');