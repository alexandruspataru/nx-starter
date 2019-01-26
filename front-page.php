<?php /* Front Page */

if ( ! defined( 'ABSPATH' ) ) exit; 

get_header();

	if ( have_posts() ) :
	
		/* Start the Loop */
		while ( have_posts() ) : the_post();

			get_template_part( 'parts/content', 'front' );

		endwhile;

	else :

		get_template_part( 'parts/content', 'none' );

	endif;
		
get_footer();