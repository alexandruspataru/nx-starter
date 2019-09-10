<?php if ( ! defined( 'ABSPATH' ) ) exit; ?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<!-- Main Menu -->
<nav class="navbar navbar-default" role="navigation">
	<div class="container">
		<div class="row">
			<div class="col-xs-12">

				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
				
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					
					<a class="navbar-brand" href="<?php echo home_url(); ?>"><?php 
					
						$custom_logo_id = get_theme_mod( 'custom_logo' );
						
						if(!empty($custom_logo_id)){
							
							$image = wp_get_attachment_image_src( $custom_logo_id , 'mobile' );
							echo '<img src="' . $image[0] . '" alt="' . get_bloginfo('name') . '">';
							
						} else {
							
							echo get_bloginfo('name');
							
						}
					
					?></a>
					
				</div>

				<?php /* The menu */
					wp_nav_menu( array(
						'menu'              => 'primary',
						'theme_location'    => 'primary',
						'depth'             => 3,
						'container'         => 'div',
						'container_class'   => 'collapse navbar-collapse',
						'container_id'      => 'bs-example-navbar-collapse-1',
						'menu_class'        => 'nav navbar-nav navbar-right',
						'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
						'walker'            => new wp_bootstrap_navwalker())
					);
				?>
				
			</div>
		</div>
	</div>
</nav>