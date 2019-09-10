<?php if ( ! defined( 'ABSPATH' ) ) exit;

$wrapper					 = '';
if(is_array($instance) && !empty($instance['elements'])){
	
	$accordionID			 = 'accordion' . rand(100, 999999999);
	
?>

<div class="panel-group nx-accordion" id="<?php echo $accordionID; ?>" role="tablist" aria-multiselectable="false">

	<?php if(!empty($instance['title'])) : ?>
	<div class="accordion-title h3"><?php echo $instance['title']; ?></div>
	<?php endif; ?>

	<?php 
		foreach($instance['elements'] as $element) : 
			if(!empty($element['title']) && !empty($element['info'])) :
			$panelID	= 'collapse' . rand(100, 999999999);
			$headingID	= 'heading' . rand(100, 999999999);
	?>
	<div class="panel panel-default">
	
		<a role="button" data-toggle="collapse" data-parent="#<?php echo $accordionID; ?>" href="#<?php echo $panelID; ?>" aria-expanded="false" aria-controls="<?php echo $panelID; ?>" class="panel-heading collapsed">
			<?php echo $element['title']; ?>
			<span class="arrow-icon"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
		</a>
		
		<div id="<?php echo $panelID; ?>" class="panel-collapse collapse" role="tabpanel" aria-labelledby="<?php echo $headingID; ?>">
			<div class="panel-body"><?php echo $element['info']; ?></div>
		</div>
			
	</div>
	<?php 
		endif;
		endforeach;
	?>

</div>

<?php

}

echo $wrapper;

?>