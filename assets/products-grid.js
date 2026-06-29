(function () {
	const addSliderClasses = (slider) => {
		const sliderWrapper = slider.querySelector(".products-grid__wrapper");
		const slides = slider.querySelectorAll(".collection-product-card");

		slider.classList.add("swiper");
		if (sliderWrapper) sliderWrapper.classList.add("swiper-wrapper");

		slides.forEach((slide) => {
			slide.classList.add("swiper-slide");
		});
	};

	const removeSliderClasses = (slider) => {
		const sliderWrapper = slider.querySelector(".products-grid__wrapper");
		const slides = slider.querySelectorAll(".collection-product-card");

		slider.classList.remove("swiper");
		if (sliderWrapper) sliderWrapper.classList.remove("swiper-wrapper");

		slides.forEach((slide) => {
			slide.removeAttribute("style");
			slide.classList.remove("swiper-slide");
		});
	};

	const initSlider = (section) => {
		const slider = section.querySelector(".swiper--products-grid");

		if (slider) {
			addSliderClasses(slider);
			const numberColumns = slider.dataset.columnsMobile || 1;
			const margin = slider.dataset.margin;

			new Swiper(slider, {
				loop: false,
				spaceBetween: margin,
				breakpoints: {
					320: {
						slidesPerView: Number(numberColumns),
						spaceBetween: 8,
					},
					576: {
						slidesPerView: 2,
					},
				},
				pagination: {
					el: slider.querySelector(".products-grid__pagination"),
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
		const slider = section.querySelector(".swiper--products-grid");

		if (slider) {
			removeSliderClasses(slider);
		}
	};

	async function handleResponse(response, section) {
		const responseText = await response.text()
		const html = document.createElement('div')
		html.innerHTML = responseText

		const sourceGrid = html.querySelector('.products-grid--search-perfomed')
		const targetWrapper = section.querySelector('.products-grid')

		if (!sourceGrid || !targetWrapper) {
			section.classList.add('products-grid-section--empty')
			return
		}

		targetWrapper.innerHTML = sourceGrid.innerHTML
	}

	const initSliderObserver = (section) => {
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
	};

	const initSection = async (section, retryCount = 0) => {
		if (!section || !section.classList.contains('products-grid-section')) {
			return
		}

		const box = section.querySelector('.products-grid')
		if (!box) return

		const isDynamicLoad = box.dataset.isDynamicLoad === 'true'
		const collectionUrl = box.dataset.collectionUrl
		const loadingEl = box.querySelector('.loading-overlay')
		const hasMobileSlider = box.dataset.sliderMobile === 'true'

		if (isDynamicLoad && collectionUrl && collectionUrl !== 'none') {
			box.classList.add('products-grid--loading')

			try {
				const response = await fetch(collectionUrl)
				if (response.status === 404 && retryCount === 0) {
					await new Promise((resolve) => setTimeout(resolve, 500))
					return initSection(section, retryCount + 1)
				}
				await handleResponse(response, section)
				if (hasMobileSlider) initSliderObserver(section)
				try {
					colorSwatches()
				} catch (err) {}
			} catch (error) {
				console.error('Error when fetching products:', error)
				section.classList.add('products-grid-section--empty')
			} finally {
				box.classList.remove('products-grid--loading')
				if (loadingEl) loadingEl.remove()
			}
		} else {
			box.classList.remove('products-grid--loading')
			if (loadingEl) loadingEl.remove()
			if (hasMobileSlider) initSliderObserver(section)
		}
	}

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (event) {
		initSection(event.target);
	});
})();
