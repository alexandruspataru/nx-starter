<?php if ( ! defined( 'ABSPATH' ) ) { exit; }

// Page Builder widgets path
add_filter('siteorigin_widgets_widget_folders', function($folders){
	
	$folders[] = get_template_directory() . '/widgets/';
	
	return $folders;
	
});

// Create a group of widgets 
add_filter('siteorigin_panels_widget_dialog_tabs', function($tabs) {
	
    $tabs[] = array(
        'title' => 'Custom Widgets',
        'filter' => array(
			'groups' => array('nx_widgets')
        )
    );
	
    return $tabs;
	
}, 20);

// Automatically activate the new widgets
add_filter('siteorigin_widgets_active_widgets', function($widgets) {
	
	// Thew new widgets
	$tmp_path				 = NX_ROOT . 'widgets/';
	$init_dirs				 = glob($tmp_path . '*' , GLOB_ONLYDIR);

	if(!empty($init_dirs)){

		foreach($init_dirs as $tmp_dir){
			
			$widget_dir		 = str_replace($tmp_path, '', $tmp_dir);
			
			// Activate the widget
			if(!empty($widget_dir)){
				
				$widgets[$widget_dir] = true;
				
			}
			
		}

	}

	// SiteOrigin default widgets
	$widgets['button']			 = false;

	return $widgets;
	
});
