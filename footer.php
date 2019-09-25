<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>

<div class="nx-footer">
	
	<!-- Widgets side -->
	<div class="nx-footer-top">
		<div class="container">
			<div class="row">
				
				<?php 
					
					// Get all the sidebars
					$allWidgets			 = wp_get_sidebars_widgets();
					
					// Keep the columns number
					$columnsNr			 = 0;
					
					// First Column
					if(isset($allWidgets['footer_1']) && !empty($allWidgets['footer_1']))
						$columnsNr++;
					
					// Second Column
					if(isset($allWidgets['footer_2']) && !empty($allWidgets['footer_2']))
						$columnsNr++;
					
					// Third Column
					if(isset($allWidgets['footer_3']) && !empty($allWidgets['footer_3']))
						$columnsNr++;
					
					// Fourth Column
					if(isset($allWidgets['footer_4']) && !empty($allWidgets['footer_4']))
						$columnsNr++;
					
					// Get the column CSS class
					$columnClass		 = 'col-md-3 col-sm-6';
					
					// 3 Columns
					if($columnsNr == 3)
						$columnClass	 = 'col-sm-4';
					
					// 2 Columns
					if($columnsNr == 2)
						$columnClass	 = 'col-sm-6';
					
					// 1 Column
					if($columnsNr == 1)
						$columnClass	 = 'col-xs-12';
					
					
					for($i = 1; $i <= $columnsNr; $i++){
					
						$currentSidebar	 = 'footer_' . $i;
						
						if ( is_active_sidebar( $currentSidebar ) ) {
						
							echo '<div class="nx-column nx-col-' . $i . ' ' . $columnClass . '"><div class="nx-inside">';
							
							dynamic_sidebar( $currentSidebar );
							
							echo '</div></div>';
						}
						
						// Adding the clearfix
						if($i == 2 && $columnsNr > 2 && is_active_sidebar( 'footer_1' ) && is_active_sidebar( 'footer_2' )){
							
							echo '<div class="clear clearfix visible-sm"></div>';
							
						}
						
					}
					
					// Adding the final clearfix
					echo '<div class="clear clearfix"></div>';
				
				?>
			
			</div>
		</div>
	</div>
	
	<!-- Copyright info -->
	<div class="nx-copyright">
		<div class="container">
			<div class="row">
			
				<!-- Left side -->
				<div class="col-sm-6 nx-left">
					<?php _ex('Copyright', 'Footer', 'nexus'); ?> &copy;
					<?php echo date('Y'); ?> - <?php echo bloginfo('name'); ?>
				</div>
				
				<!-- Right side -->
				<div class="col-sm-6 nx-right">
					<?php /* The menu */
						wp_nav_menu( array(
							'menu'				 => 'footer',
							'theme_location'	 => 'footer',
							'depth'				 => 1,
							'menu_class'		 => 'list-unstyled list-inline',
							)
						);
					?>
				</div>
				
			</div>
		</div>
	
	</div>
	
</div>

<a href="#" id="back-to-top">&uarr;</a>
<?php wp_footer(); ?>

</body>
</html>
