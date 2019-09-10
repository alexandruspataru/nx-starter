<?php /* Template name: Full Width */

if ( ! defined( 'ABSPATH' ) ) exit; 
get_header();

?>

<div class="singlePage nx-full-width">
	<div class="container-fluid">
		<div class="row">
			<?php /* The Loop */

				while ( have_posts() ) : the_post();
				
					echo nx_page_title();

					the_content();

				endwhile;
				
			?>
		</div>
	</div>
</div>

<?php get_footer(); 