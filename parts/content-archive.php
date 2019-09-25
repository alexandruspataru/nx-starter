<?php if ( ! defined( 'ABSPATH' ) ) exit;

// Store the post info / defaults
$postInfo				 = array();
$postInfo['title']		 = get_the_title();
$postInfo['link']		 = get_the_permalink();
$postInfo['img']		 = get_template_directory_uri() . '/assets/img/placeholder-thumb.png';
$postInfo['thumbID']	 = (has_post_thumbnail()) ? get_post_thumbnail_id() : 0;

// Post thumbnail
if ( is_numeric($postInfo['thumbID']) && $postInfo['thumbID'] > 0 ) {
	
	$tmpThumb			 = wp_get_attachment_image_src($postInfo['thumbID'], 'nx_thumb');
	$postInfo['img']	 = (isset($tmpThumb[0]) && !empty($tmpThumb[0])) ? $tmpThumb[0] : $postInfo['img'];

}

?>
<div class="nx-archive-post">

	<!-- Thumbnail -->
	<div class="col-sm-4 nx-col-thumb">
		<a href="<?php echo $postInfo['link']; ?>">
			<img src="<?php echo $postInfo['img']; ?>" alt="<?php echo $postInfo['title']; ?>" class="img-responsive">
		</a>
	</div>
	
	<!-- Post Info -->
	<div class="col-sm-8 nx-col-thumb">
		
		<!-- Post title -->
		<a href="<?php echo $postInfo['link']; ?>" class="nx-post-title">
			<h2 class="nx-post-title"><?php echo $postInfo['title']; ?></h2>
		</a>
		
		<!-- Post excerpt -->
		<div class="nx-post-excerpt">
			<?php the_excerpt(); ?>
		</div>
		
		<!-- Read more -->
		<a href="<?php echo $postInfo['link']; ?>" class="btn btn-default"><?php _ex('Read more', 'Archive template', 'nexus'); ?></a>
		
	</div>
	
	<!-- Clearfix -->
	<div class="clearfix"></div>

</div>
