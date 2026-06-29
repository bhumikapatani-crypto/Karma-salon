(function () {
	const blogSlider = () => {
		$(".section-main-blog").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const box = $(this).find(".blog-slider");
			const id = box.data("id");
			const autoplay = box.data("autoplay");
			const isLoop = box.data("loop");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
			const slideSpeed = box.data("speed") * 1000;
			const slideCount = box.data("slide-count");

			let autoplayParam;
			if (autoplay && slideCount > 1) {
				autoplayParam = {
					autoplay: {
						delay: delay,
						pauseOnMouseEnter: stopAutoplay,
						disableOnInteraction: false,
					},
				};
			} else {
				autoplayParam = {
					autoplay: false,
				};
			}

			const commonParams = {
				speed: slideSpeed,
				loop: isLoop && slideCount > 1,
				keyboard: true,
				allowTouchMove: true,
				...autoplayParam,
			};

			const swiperOverlayParams = {
				centeredSlides: false,
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
			};

			const swiperOverlay = new Swiper(`#${id} .blog-slider__swiper`, {
				...commonParams,
				...swiperOverlayParams,
			});
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		blogSlider();
		document.addEventListener("shopify:section:load", function () {
			blogSlider();
		});
	});
})();
