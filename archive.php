<?php /* Archive page */

if ( ! defined( 'ABSPATH' ) ) exit; 
get_header();

?>

<div class="nx-archive">
	<div class="container">
		<div class="row">
			<?php if ( have_posts() ) : ?>

				<div class="nx-archive-title col-xs-12"><?php /* Archive title & Description */
					the_archive_title( '<h1 class="page-title">', '</h1>' );
					the_archive_description( '<div class="taxonomy-description">', '</div>' );
				?></div>

				<?php /* Start the Loop */
					while ( have_posts() ) : the_post();
						
						get_template_part( 'parts/content', 'archive' );

					endwhile;
					
					/* Pagination */
					echo '<div class="col-xs-12">';
					nx_pagination();
					echo '</div>';
					
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