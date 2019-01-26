<?php /* Single page template */

if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

?>

<div class="singlePost">
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