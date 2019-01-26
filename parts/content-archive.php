<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>
<div class="archivePost">

	<?php the_title( sprintf( '<h2 class="postTitle"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
	<?php the_excerpt(); ?>
	
	<a href="<?php the_permalink(); ?>">
		<?php
			 
			if ( has_post_thumbnail() ) {
				the_post_thumbnail( 'mobile', array( 'class' => 'img-responsive' ) ); 
			}
			
			else {
				echo '<img src="' . get_bloginfo( 'stylesheet_directory' ) 
					. '/assets/img/placeholder.png" class="img-responsive" alt="placeholder" />';
			}
		?>
	</a>

</div>
