<?php /* Template name: Playground - Development tests */

if ( ! defined( 'ABSPATH' ) ) exit;

// Only the admins should access this page
if(!is_super_admin()){

	// Redirect to homepage
	wp_safe_redirect( home_url() );
	exit;

}

get_header();

?>

<div class="nx-singular nx-playground-page">
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<?php
					while ( have_posts() ) : the_post();
						
						// Page title & subtitle
						echo nx_page_title();
						
						// Start debugging
						$info					 = 'some info';
						$info					 = nx_get_page_custom_fields('all');

						nx_dump($info, true);
						
						// Display the page content
						the_content();

					endwhile; // End of the loop.
					

				?>		
			</div>
			
		</div>
	</div>
</div>


<?php get_footer(); ?>