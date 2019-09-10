<?php /* Template name: Playground - Development tests */

if ( ! defined( 'ABSPATH' ) ) exit;

// Only the admins should access this page
if(!is_super_admin()){

	// Redirect to homepage
	wp_safe_redirect( home_url() );
	exit;

}

get_header();

// Start debugging
$info					 = 'some info';
$info					 = nx_get_site_config();

nx_dump($info, true);

?>

<div class="singlePost nx-playground">
	<div class="container">
		<div class="row">
			
			<?php
				while ( have_posts() ) : the_post();
				
					echo nx_page_title();

					the_content();

				endwhile; // End of the loop.
				
				get_sidebar();
			?>		
			
		</div>
	</div>
</div>


<?php get_footer(); ?>