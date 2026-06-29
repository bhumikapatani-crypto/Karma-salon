(() => {
	let initProductCarouselSliders = () => {
		$(".collection-slider-section").each(function () {
			if ($(this).hasClass("slider_started")) return;

			$(this).addClass("slider_started");
			let id = $(this).attr("id");

			// Init big swiper (fade images)
			let productSwiper = new Swiper(`#${id} .swiper--collections`, {
				loop: false,
				autoHeight: true,
				allowTouchMove: false,
				slidesPerView: 1,
				lazy: true,
				preloadImages: false,
				effect: "fade",
				spaceBetween: 24,
			});

			// Init big swiper mobile (fade images)
			let productSwiper11 = new Swiper(`#${id} .swiper--collections11`, {
				loop: false,
				autoHeight: true,
				allowTouchMove: false,
				slidesPerView: 1,
				lazy: true,
				preloadImages: false,
				effect: "fade",
				spaceBetween: 24,
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
			});

			// Count real slides (not clones)
			const realSlidesCount =
				document.querySelectorAll(
					`#${id} .swiper--collections2 .swiper-slide:not(.swiper-slide-duplicate)`
				).length * 3;

			// Init second swiper (horizontal titles)
			let productSwiper2 = new Swiper(`#${id} .swiper--collections2`, {
				slidesPerView: "auto",
				centeredSlides: true,
				allowTouchMove: true,
				loop: true,
				//loopedSlides: realSlidesCount,
				loopAdditionalSlides: 2,
				spaceBetween: 20,
				slideToClickedSlide: false,
				centerInsufficientSlides: true,
				watchSlidesProgress: true,
				watchSlidesVisibility: true,
				preventClicks: false,
				preventClicksPropagation: false,
				keyboard: true,

				on: {
					init: function () {
						setTimeout(() => {
							this.update();
							if (this.slides.length > 0) {
								this.slideToLoop(0, 0, false);
							}
						}, 150);
						this.slides.forEach((slide) => slide.classList.remove("active"));
					},
					slideChange: function () {
						const realIndex = this.realIndex;
						if (productSwiper) {
							productSwiper.slideTo(realIndex);
						}
					},
					click: function () {
						this.slides.forEach((slide) => slide.classList.remove("active"));
						const clickedSlide = this.clickedSlide;
						if (!clickedSlide) return;

						const realIndex = parseInt(
							clickedSlide.getAttribute("data-swiper-slide-index"),
							10
						);
						if (isNaN(realIndex)) return;

						this.slideToLoop(realIndex, 300);
						if (productSwiper) {
							productSwiper.slideToLoop(realIndex, 300);
						}
					},
					focusin: function (e) {
						const focusedSlide = e.currentTarget;
						const realIndex = parseInt(
							focusedSlide.getAttribute("data-swiper-slide-index"),
							10
						);

						if (isNaN(realIndex)) return;

						slider.slideToLoop(realIndex, 300);
						if (linkedSlider) linkedSlider.slideToLoop(realIndex, 300);
					},
				},
			});

			const sliderContainer = document.querySelector(
				`#${id} .collection-slider`
			);
			if (sliderContainer) {
				sliderContainer.addEventListener("focusin", () => {
					productSwiper2.keyboard.enable();

					document.addEventListener("keydown", (e) => {
						if (e.key === "ArrowRight") {
							updateActiveClass(productSwiper2);
						} else if (e.key === "ArrowLeft") {
							updateActiveClass(productSwiper2);
						}
					});
				});
				sliderContainer.addEventListener("focusout", (e) => {
					productSwiper2.keyboard.disable();

					if (!sliderContainer.contains(e.relatedTarget)) {
						productSwiper2.slides.forEach((slide) =>
							slide.classList.remove("active")
						);
					}

					document.addEventListener("keydown", (e) => {
						if (e.key === "ArrowRight") {
							productSwiper2.slides.forEach((slide) =>
								slide.classList.remove("active")
							);
						} else if (e.key === "ArrowLeft") {
							productSwiper2.slides.forEach((slide) =>
								slide.classList.remove("active")
							);
						}
					});
				});
			}

			function updateActiveClass(swiperInstance) {
				swiperInstance.slides.forEach((slide) =>
					slide.classList.remove("active")
				);
				const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
				if (activeSlide) activeSlide.classList.add("active");
			}

			// Init second swiper mobile (horizontal titles)
			let productSwiper22 = new Swiper(`#${id} .swiper--collections22`, {
				slidesPerView: "auto",
				centeredSlides: true,
				allowTouchMove: true,
				loop: true,
				loopedSlides: 2,
				loopAdditionalSlides: 2,
				spaceBetween: 20,
				slideToClickedSlide: false,
				centerInsufficientSlides: true,
				watchSlidesProgress: true,
				watchSlidesVisibility: true,
				preventClicks: false,
				preventClicksPropagation: false,

				on: {
					init: function () {
						setTimeout(() => {
							this.update();
							if (this.slides.length > 0) {
								this.slideToLoop(0, 0, false);
							}
						}, 150);
					},
					slideChange: function () {
						const realIndex = this.realIndex;
						if (productSwiper11) {
							productSwiper11.slideTo(realIndex);
						}
					},
					click: function () {
						const clickedSlide = this.clickedSlide;
						if (!clickedSlide) return;

						const realIndex = parseInt(
							clickedSlide.getAttribute("data-swiper-slide-index"),
							10
						);
						if (isNaN(realIndex)) return;

						this.slideToLoop(realIndex, 300);
						if (productSwiper11) {
							productSwiper11.slideToLoop(realIndex, 300);
						}
					},
				},
			});

			synchronizeWithTabs(productSwiper2);
		});
	};

	// Reinitialize sliders when sections are modified in Shopify editor
	document.addEventListener("shopify:section:load", function () {
		initProductCarouselSliders();
	});

	initProductCarouselSliders();
})();
