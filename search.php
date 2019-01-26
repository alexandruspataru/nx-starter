<?php /* Search */

if ( ! defined( 'ABSPATH' ) ) exit; 
get_header();

?>

<div class="archivePage searchPage">
	<div class="container">
		<div class="row">

			<?php if ( have_posts() ) : ?>

				<?php printf( esc_html__( 'Search Results for: %s', 'nexus' ), '<span>' . get_search_query() . '</span>' ); ?>
			

				<?php /* Start the Loop */
				
					while ( have_posts() ) : the_post();

						get_template_part( 'parts/content', 'archive' );

					endwhile;

					nexus_pagination();

			else :

				get_template_part( 'parts/content', 'none' );

			endif;

			?>
			
		</div>
		
		<?php get_sidebar(); ?>
		
	</div>
</div>

<?php get_footer(); ?>