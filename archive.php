<?php /* Archive page */

if ( ! defined( 'ABSPATH' ) ) exit; 
get_header();

?>

<div class="archivePage">
	<div class="container">
		<div class="row">
			<?php if ( have_posts() ) : ?>

				<?php /* Archive title & Description */
					the_archive_title( '<h1 class="page-title">', '</h1>' );
					the_archive_description( '<div class="taxonomy-description">', '</div>' );
				?>


				<?php /* Start the Loop */
					while ( have_posts() ) : the_post();
						
						get_template_part( 'parts/content', 'archive' );

					endwhile;
					
					/* Pagination */
					nx_pagination();
				?>
	
				<?php

					else :

						get_template_part( 'parts/content', 'none' );

					endif; 
				?>
		</div>
	</div>
</div>

<?php get_footer(); ?>