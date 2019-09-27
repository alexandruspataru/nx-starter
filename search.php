<?php /* Search */

if ( ! defined( 'ABSPATH' ) ) exit; 
get_header();

?>

<div class="nx-archive nx-search-page">
	<div class="container">
		<div class="row">

			<?php if ( have_posts() ) : ?>
				
				<div class="nx-archive-title nx-search-title col-xs-12">
					<h1><?php printf( esc_html__( 'Search Results for: %s', 'nexus' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
				</div>
			
				<?php /* Start the Loop */
				
					while ( have_posts() ) : the_post();

						get_template_part( 'parts/content', 'archive' );

					endwhile;

					/* Pagination */
					echo '<div class="col-xs-12">';
					nx_pagination();
					echo '</div>';

			else :

				get_template_part( 'parts/content', 'none' );

			endif;

			?>
			
		</div>
		
	</div>
</div>

<?php get_footer(); ?>