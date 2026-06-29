(() => {
	const addClasses = (slider) => {
		const sliderWrapper = slider.querySelector(".popular-products__wrapper");
		const slides = slider.querySelectorAll(".popular-products__item");
		const slidesPlaceholder = slider.querySelectorAll(
			".popular-products__item_placeholder"
		);

		slider.classList.add("swiper");
		if (sliderWrapper) sliderWrapper.classList.add("swiper-wrapper");

		if (slides.length > 1) {
			slides.forEach((slide) => {
				slide.classList.add("swiper-slide");
			});
		}

		if (slidesPlaceholder.length > 1) {
			slidesPlaceholder.forEach((slide) => {
				slide.classList.add("swiper-slide");
			});
		}
	};

	const removeClasses = (slider) => {
		const sliderWrapper = slider.querySelector(".popular-products__wrapper");
		const slides = slider.querySelectorAll(".popular-products__item");
		const slidesPlaceholder = slider.querySelectorAll(
			".popular-products__item_placeholder"
		);

		slider.classList.remove("swiper");
		if (sliderWrapper) sliderWrapper.classList.remove("swiper-wrapper");

		if (slides.length > 0) {
			slides.forEach((slide) => {
				slide.removeAttribute("style");
				slide.classList.remove("swiper-slide");
			});
		}

		if (slidesPlaceholder.length > 0) {
			slidesPlaceholder.forEach((slide) => {
				slide.removeAttribute("style");
				slide.classList.remove("swiper-slide");
			});
		}
	};

	const initSlider = (section) => {
		const slider = section.querySelector(".swiper--products");

		if (slider) {
			addClasses(slider);
			const numberColumns = slider.dataset.columnsMobile || 1;
			const margin = slider.dataset.margin;

			new Swiper(slider, {
				loop: false,
				spaceBetween: margin,
				breakpoints: {
					320: {
						slidesPerView: Number(numberColumns),
					},
					576: {
						slidesPerView: 2,
					},
				},
				pagination: {
					el: slider.querySelector(".popular-products__pagination"),
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
			});
		}
	};

	const destroySlider = (section) => {
		const slider = section.querySelector(".swiper--products");

		if (slider) {
			removeClasses(slider);
		}
	};

	const initSection = (section) => {
		if (section && section.classList.contains("product-carousel-section")) {
			const resizeObserver = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.contentRect.width < 750) {
						initSlider(entry.target);
					} else {
						destroySlider(entry.target);
					}
				});
			});

			resizeObserver.observe(section);
		}
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (event) {
		initSection(event.target);
	});
})();
