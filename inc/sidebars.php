<?php /* We'll register all the sidebars */

if ( ! defined( 'ABSPATH' ) ) exit; 

function nexus_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'nexus' ),
		'id'            => 'sidebar',
		'description'   => '',
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'nexus_widgets_init' );

?>