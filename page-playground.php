<?php /* Template name: Playground - Development tests */

if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

// Only the developer should access this page
$userID		 = get_current_user_id();

if(!is_numeric($userID) || $userID < 1){

	// Redirect to homepage
	wp_safe_redirect( home_url() );
	exit;

}

// Start debugging
$info					 = 'some info';
nx_dump($info, true);

?>

<div class="singlePost nx-playground">
	<div class="container">
		<div class="row">
			
			<?php
				while ( have_posts() ) : the_post();

					the_content();

				endwhile; // End of the loop.
				
				get_sidebar();
			?>		
			
		</div>
	</div>
</div>


<?php get_footer(); ?>