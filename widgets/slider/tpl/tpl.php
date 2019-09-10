<?php if ( ! defined( 'ABSPATH' ) ) exit; 

// Check for slides
if(!empty($instance['slides'])){
	
$slideTimeout		 = 5000;
if(!empty($instance['timeout']) && is_numeric($instance['timeout']) && $instance['timeout'] > 2 && $instance['timeout'] < 11){

	$slideTimeout	 = $instance['timeout'] * 1000;
	
}
	
?>
<div class="nx-slider owl-carousel" data-interval="<?php echo $slideTimeout; ?>">
	<?php 
	
		// Get the image size that we're going to use
		$size					 = (wp_is_mobile()) ? 'slider_tablet' : 'slider';

		foreach($instance['slides'] as $slide){
			
			if(!empty($slide['pic']) && is_numeric($slide['pic']) && $slide['pic'] > 0){
				
				// Try to get the image
				$img			 = wp_get_attachment_image_src( $slide['pic'], $size);
				
				// Go ahead if we have an image to show
				if(isset($img[0]) && !empty($img[0]) && is_string($img[0])){
					
					// Wrapper starts
					echo '<div class="item" style="background-image:url(\'' . $img[0] . '\')"><div class="nx-overlay"></div><div class="container"><div class="row"><div class="col-xs-12">';
					
					// Caption title
					if(!empty($slide['caption']) && is_string($slide['caption'])){
						
						echo '<div class="nx-slider-caption">' . $slide['caption'] . '</div>';
						
					}
					
					// Caption description
					if(!empty($slide['description']) && is_string($slide['description'])){
						
						echo '<div class="nx-slider-description">' . $slide['description'] . '</div>';
						
					}
					
					// Link
					if(!empty($slide['label']) && is_string($slide['label']) && !empty($slide['link']) && is_string($slide['link'])){
						
						echo '<a href="' . sow_esc_url($slide['link']) . '" class="nx-slider-btn nx-btn">' . $slide['label'] . '</a>';
						
					}
					
					// Wrapper ends
					echo '</div></div></div></div>';

				}
				
			}

		}	
	
	?>
</div>
<?php } // Checks done ?>