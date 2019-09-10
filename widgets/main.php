<?php if ( ! defined( 'ABSPATH' ) ) { exit; }

/* 
 * All folders are created for Siteorigin Page Builder. 
 * If you want to create any other widgets (not for Siteorigin Page Builder), please create another folder
 * so we'll not have problems with the page builder.
 */

// Page Builder widgets path
function nx_widgets_collection($folders){
	
	$folders[] = get_template_directory() . '/widgets/';
	return $folders;
	
}
add_filter('siteorigin_widgets_widget_folders', 'nx_widgets_collection');

// Create a group of widgets 
function nx_add_widget_tabs($tabs) {
    $tabs[] = array(
        'title' => 'Custom Widgets',
        'filter' => array(
            'groups' => array('nx_widgets')
        )
    );
    return $tabs;
}
add_filter('siteorigin_panels_widget_dialog_tabs', 'nx_add_widget_tabs', 20);

// Make sure to activate the widgets
function nx_default_widgets( $widgets ) {
	
  $widgets['accordion']			 = true;
  $widgets['lightbox-img']		 = true;
  $widgets['slider']			 = true;
  $widgets['modal']				 = true;
  
  // SiteOrigin default widgets
  $widgets['button']			 = false;
  
  return $widgets;
}
add_filter('siteorigin_widgets_active_widgets', 'nx_default_widgets');
