<?php if ( ! defined( 'ABSPATH' ) ) exit; /* Responsive with Server Side utilities */

/* Body class */
add_filter( 'body_class', 'nexus_body_classes' );
function nexus_body_classes( $classes ) {
	
	
	$detect = new Mobile_Detect;
	
	if (  $detect->isMobile() && !$detect->isTablet()) { $classes[] = 'mobile not-tablet not-desktop'; }	/* Mobile Class */
	if( $detect->isTablet() ){	$classes[] = 'tablet not-mobile not-desktop'; 	}							/* Tablet Class */
	if( !$detect->isMobile() ){	$classes[] = 'desktop not-mobile not-tablet'; }							/* Desktop Class */
	
	return $classes;
}