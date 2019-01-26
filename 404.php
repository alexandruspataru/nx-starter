<?php /* 404 Page */

if ( ! defined( 'ABSPATH' ) ) exit; 
get_header();

?>

<div class="Page404 error-template">
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
			
				<h1><?php echo __('Oops!', 'nexus'); ?></h1>
				<h2><?php echo __('404 Not Found', 'nexus'); ?></h2>
                    
                <div class="error-details">
                    <?php echo __('Sorry, an error has occured, Requested page not found!', 'nexus'); ?>
                </div>
				
                <div class="error-actions">
                    <a href="<?php echo home_url('/'); ?>" class="btn btn-primary btn-lg">
						<i class="fa fa-home" aria-hidden="true"></i>
						<?php echo __('Take Me Home', 'nexus'); ?>
                    </a>
                </div>
				
			</div>
		</div>
	</div>
</div>

<?php get_footer(); ?>