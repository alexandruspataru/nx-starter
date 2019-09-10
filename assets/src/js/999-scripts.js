// jQuery functions
// The functions are loaded as non-conflict
jQuery(function($){

	// Go to top
	// if ($('#back-to-top').length) {
		// var scrollTrigger = 100, // px
			// backToTop = function () {
				// var scrollTop = $(window).scrollTop();
				// if (scrollTop > scrollTrigger) {
					// $('#back-to-top').addClass('show');
				// } else {
					// $('#back-to-top').removeClass('show');
				// }
			// };
		// backToTop();
		// $(window).on('scroll', function () {
			// backToTop();
		// });
		// $('#back-to-top').on('click', function (e) {
			// e.preventDefault();
			// $('html,body').animate({
				// scrollTop: 0
			// }, 700);
		// });
	// }
	
	// Shortcode gallery
	$('[data-fancybox="gallery"]').fancybox({
		loop: true,
		buttons: ['close']
	});

	// Scroll to accordion top after the panel is opened
	$('.nx-accordion').on('shown.bs.collapse', '.panel-default', function (e) {
		
		var topDistance = 68;
		if($('body').hasClass('admin-bar')){
			
			topDistance = 100;
			
		}
		
		$('html,body').animate({

			scrollTop: jQuery(this).offset().top-topDistance
			
		}, 500); 
	});
	
	// Widget - Lightbox image
	$(".nx-fancybox").fancybox({});

	// Widget - Image slider
	$('.nx-slider').owlCarousel({
		stagePadding: 0,
		items: 1,
		loop:true,
		margin:0,
		singleItem:true,
		//nav:true,
		nav:false,
		dots:true,
		autoplay:true,
		autoplayTimeout:($('.nx-slider').data('interval') || 3000),
		navText: [
			"<i class='fa fa-angle-left'></i>",
			"<i class='fa fa-angle-right'></i>"
		]
	});

});