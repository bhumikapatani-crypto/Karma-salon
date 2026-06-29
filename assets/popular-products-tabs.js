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
		const sliders = section.querySelectorAll(".swiper--products");

		sliders.forEach((slider) => {
			if (slider) {
				if (slider.classList.contains("slider_started")) {
					return;
				}

				slider.classList.add("slider_started");

				addClasses(slider);
				const numberColumns = slider.dataset.columnsMobile || 1;
				const margin = slider.dataset.margin;

				new Swiper(slider, {
					loop: false,
					allowTouchMove: true,
					lazy: true,
					preloadImages: false,
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
					},
				});
			}
		});
	};

	const destroySlider = (section) => {
		const sliders = section.querySelectorAll(".swiper--products");
		sliders.forEach((slider) => {
			if (slider) {
				removeClasses(slider);
			}
		});
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

	const collectionTabs = () => {
		const tabsSections = document.querySelectorAll(".popular-products");
		tabsSections.forEach((tabSection) => {
			const tabs = tabSection.querySelectorAll("[data-tab-target]");
			const tabContents = tabSection.querySelectorAll("[data-tab-content]");
			let maxHeight = 0;
			tabContents.forEach((tabContent) => {
				tabContent.classList.add("measureable");
				let contentHeight = tabContent.clientHeight;
				if (contentHeight > maxHeight) {
					maxHeight = contentHeight;
				}
				tabContent.classList.remove("measureable");
			});

			tabContents.forEach((tabContent) => {
				tabContent.style.height = `${maxHeight}px`;
			});

			tabs.forEach((tab) => {
				const activateTab = () => {
					const target = tabSection.querySelector(tab.dataset.tabTarget);

					tabContents.forEach((tabContent) => {
						tabContent.classList.remove("active");
					});
					tabs.forEach((t) => t.classList.remove("active"));

					tab.classList.add("active");
					target.classList.add("active");

					initializeScrollAnimationTrigger();
				};

				tab.addEventListener("click", activateTab);

				tab.addEventListener("keydown", (e) => {
					if (e.key === "Enter" || e.keyCode === 13) {
						activateTab();
					}
				});
			});
		});
	};

	initSection(document.currentScript.parentElement);
	collectionTabs();

	document.addEventListener("shopify:section:load", function (event) {
		initSection(event.target);
		collectionTabs();
	});
})();
