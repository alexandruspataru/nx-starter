<?php if ( ! defined( 'ABSPATH' ) ) exit;

// Defaults
$modal_btn_text				 = (isset($instance['modal_btn_text']) && !empty($instance['modal_btn_text'])) ? $instance['modal_btn_text'] : esc_html_x('Click me', 'Widget - Modal', 'nexus');
$modal_title				 = (isset($instance['modal_title']) && !empty($instance['modal_title'])) ? $instance['modal_title'] : '';
$modal_content				 = (isset($instance['modal_content']) && !empty($instance['modal_content'])) ? $instance['modal_content'] : '';
$modal_close_btn			 = (isset($instance['modal_close_btn']) && !empty($instance['modal_close_btn'])) ? $instance['modal_close_btn'] : esc_html_x('Close', 'Widget - Modal', 'nexus');
$modal_ID					 = 'modal' . rand(100, 999999999);
$modal_label				 = 'ModalLabel' . rand(100, 999999999);

// Go ahead only if we have all the information
if(empty($modal_btn_text) || empty($modal_title) || empty($modal_content) || empty($modal_close_btn)){
	
	echo '<div class="alert alert-danger" role="alert">' . esc_html_x('Widget - Modal - Error: Please complete all the fields.', 'Widget - Modal', 'nexus-admin') . '</div>';
	return '';
	
}

?>

<!-- Button trigger modal -->
<button type="button" class="btn btn-primary nx-btn-modal" data-toggle="modal" data-target="#<?php echo $modal_ID;?>">
  <?php echo $modal_btn_text; ?>
</button>

<!-- Modal -->
<div class="modal fade nx-modal" id="<?php echo $modal_ID;?>" tabindex="-1" role="dialog" aria-labelledby="<?php echo $modal_label; ?>">
	<div class="modal-dialog" role="document">
		<div class="modal-content">

			<!-- Modal header -->
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="<?php echo $modal_label; ?>"><?php echo $modal_title; ?></h4>
			</div>
			
			<!-- Modal content -->
			<div class="modal-body"><?php echo $modal_content; ?></div>
			
			<!-- Modal footer -->
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo $modal_close_btn; ?></button>
			</div>
			
		</div>
	</div>
</div>
