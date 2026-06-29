(function () {
	const addClasses = (slider) => {
		const sliderWrapper = slider.querySelector(".multicolumn-list__wrapper");
		const slides = slider.querySelectorAll(".multicolumn-list__item");

		slider.classList.add("swiper");
		if (sliderWrapper) sliderWrapper.classList.add("swiper-wrapper");
		if (slides.length > 1) {
			slides.forEach((slide) => {
				slide.classList.add("swiper-slide");
			});
		}
	};

	const initSlider = (section) => {
		const slider = section.querySelector(".swiper--multicolumn");
		const id = $(section).attr("id");
		const columnsPerRow = parseInt(slider.dataset.columns_per_row);

		if (slider) {
			addClasses(slider);

			var multicolumnSwiper = new Swiper(slider, {
				loop: false,
				speed: 800,
				spaceBetween: 0,
				breakpoints: {
					320: {
						slidesPerView: 1,
						slidesPerGroup: 1,
						spaceBetween: 0,
					},
					750: {
						slidesPerView: columnsPerRow > 1 ? 2 : columnsPerRow,
						slidesPerGroup: 2,
						spaceBetween: 24,
					},
					1100: {
						slidesPerView: columnsPerRow > 2 ? 3 : columnsPerRow,
						spaceBetween: 24,
					},
					1360: {
						slidesPerView: columnsPerRow > 3 ? 4 : columnsPerRow,
						spaceBetween: 24,
					},
					1600: {
						slidesPerView: columnsPerRow,
						spaceBetween: 24,
					},
				},
				pagination: {
					el: slider.querySelector(".multicolumn__pagination"),
					clickable: true,
					type: "custom",
					renderCustom: function (swiper, current, total) {
						let out = "";
						for (let i = 1; i < total + 1; i++) {
							if (i == current) {
								out = `${out}<span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button" aria-label="Go to slide ${i}"></span>`;
							} else {
								out = `${out}<span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide ${i}"></span>`;
							}
						}
						return out;
					},
				},
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
			});

			setTimeout(() => {
				multicolumnSwiper.update();
			}, 500);
		}
	};

	const initSection = (section) => {
		initSlider(section);

		if (section && section.classList.contains("swiper--multicolumn")) {
			const sectionResizeObserver = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					initSlider(entry.target);
				});
			});

			sectionResizeObserver.observe(section);
		}
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	});
})();
