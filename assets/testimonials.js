(function () {
	let placeNextPrevButtons = (section_id, img_selector) => {
		let nextBtn = document.querySelector(`#${section_id} .swiper-button-next`);
		let prevBtn = document.querySelector(`#${section_id} .swiper-button-prev`);
		let image = document.querySelector(`#${section_id} ${img_selector}`);
		let imageHeight = image?.clientHeight;
		let imageTop = image?.offsetTop;

		if (nextBtn && prevBtn && imageHeight) {
			let topValue = (btn) =>
				`${(imageHeight - btn.clientHeight) / 2 + imageTop}px`;
			nextBtn.style.top = topValue(nextBtn);
			prevBtn.style.top = topValue(prevBtn);
		}
	};

	const initTestimonials = () => {
		$(".testimonials-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return;
			}
			$(this).addClass("slider_started");

			const id = $(this).attr("id");
			const box = $(this).find(".testimonials");
			const autoplay = box.data("autoplay");
			const isLoop = box.data("loop");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;

			let autoplayParam = autoplay
				? {
						autoplay: {
							delay: delay,
							pauseOnMouseEnter: stopAutoplay,
							disableOnInteraction: false,
						},
				  }
				: { autoplay: false };

			if (box[0].swiper) {
				box[0].swiper.destroy(true, true);
			}

			const swiperReviewsParams = {
				speed: box.data("speed") * 1000,
				effect: "slide",
				loop: isLoop,
				slidesPerView: 1,
				slidesPerGroup: 1,
				spaceBetween: 24,
				autoHeight: false,
				...autoplayParam,
				centeredSlides: false,
				allowTouchMove: true,
				breakpoints: {
					990: {
						slidesPerView: 2,
					},
				},
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .testimonials__pagination`,
					clickable: true,
				},
			};

			const swiperReviews = new Swiper(
				`#${id} .testimonials__swiper.swiper`,
				swiperReviewsParams
			);

			if (
				document.querySelector(`#${id} .testimonials__swiper.swiper`) !== null
			) {
				swiperReviews.update();
				placeNextPrevButtons(id, `.testimonials__swiper`);

				window.addEventListener("resize", () => {
					setTimeout(
						() => placeNextPrevButtons(id, `.testimonials__swiper`),
						1000
					);
				});
			}
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		initTestimonials();
		document.addEventListener("shopify:section:load", function () {
			initTestimonials();
		});
	});
})();
