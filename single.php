<?php /* Single page template */

if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

while ( have_posts() ) : the_post();

?>

<div class="nx-singular nx-single-post">
	<div class="container">
		<div class="row">
			
			<!-- The content -->
			<div class="col-sm-8 nx-post-content">
				<?php
				
					echo nx_page_title();
					
					the_content();
					
				?>
			</div>
			
			<!-- The sidebar -->
			<div class="col-sm-4 nx-post-sidebar">
				<?php get_sidebar(); ?>
			</div>
			
			<div class="clear clearfix"></div>
			
		</div>
	</div>
</div>

<?php 

endwhile;

get_footer(); ?>