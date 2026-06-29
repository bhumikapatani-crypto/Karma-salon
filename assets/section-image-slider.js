(function () {
	const imageSlider = () => {
		$(".image-slider-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const id = $(this).attr("id");
			const box = $(this).find(".image-slider");
			animateHeading(box[0]);
			const autoplay = box.data("autoplay");
			const isLoop = box.data("loop");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
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
				speed: box.data("speed") * 1000,
				effect: box.data("effect"),
				loop: isLoop && slideCount > 1,
				autoHeight: false,
				calculateHeight: false,
				centeredSlides: false,
				creativeEffect: {
					prev: {
						shadow: true,
						translate: [0, 0, -400],
					},
					next: {
						translate: ["100%", 0, 0],
					},
				},
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: true,
				},
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
				...autoplayParam,
			};

			const imageSliderswiper = new Swiper(`#${id} .image-slider__swiper`, {
				...commonParams,
			});
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		imageSlider();
		document.addEventListener("shopify:section:load", function () {
			imageSlider();
		});
	});
})();
