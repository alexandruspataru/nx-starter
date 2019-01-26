<?php /* Main template */

if ( ! defined( 'ABSPATH' ) ) exit; 

get_header();
?>

<div class="homeTemplate">
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				
				<?php /* The Loop */
				
					if ( have_posts() ) :
						
						while ( have_posts() ) : the_post();

							the_content();

						endwhile;

					else :

						get_template_part( 'parts/content', 'none' );

					endif; 
	
				?>
				
			</div>
		</div>
	</div>
</div>

<?php get_footer(); ?>