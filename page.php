<?php /* Page default template */

if ( ! defined( 'ABSPATH' ) ) exit; 
get_header();

?>

<div class="nx-singular nx-single-page">
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<?php /* The Loop */

					while ( have_posts() ) : the_post();
					
						echo nx_page_title();

						the_content();

					endwhile;
					
				?>
			</div>	
		</div>
	</div>
</div>

<?php get_footer(); 