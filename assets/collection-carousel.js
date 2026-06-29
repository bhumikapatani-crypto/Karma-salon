(() => {
	let slideupAnimation = (section) => {
		if (
			section.querySelector(".collection-carousel__item.appear-from-bottom") !==
			null
		) {
			section
				.querySelectorAll(".collection-carousel__item.appear-from-bottom")
				.forEach((item) => {
					const btn = item?.querySelector(
						".collection-carousel__item__content__button.hover-effect"
					);

					if (btn) {
						const content = item.querySelector(
							".collection-carousel__item__content__main"
						);
						const container = content.parentNode;
						const transformValue =
							btn.clientHeight +
							parseInt(window.getComputedStyle(content).marginBottom);

						container.style = `--translate: ${transformValue}px`;
					}
				});
		}
	};

	let placeNextPrevButtons = (section_id, img_selector) => {
		let nextBtn = document.querySelector(`#${section_id} .swiper-button-next`);
		let prevBtn = document.querySelector(`#${section_id} .swiper-button-prev`);
		let imageHeight = document.querySelector(
			`#${section_id} ${img_selector}`
		)?.clientHeight;

		if (nextBtn && prevBtn && imageHeight) {
			let topValue = (btn) => `${(imageHeight - btn.clientHeight) / 2}px`;
			nextBtn.style.top = topValue(nextBtn);
			prevBtn.style.top = topValue(prevBtn);
		}
	};

	let calculateSlidesPerView = (
		productCount,
		productCountMobile,
		windowWidth
	) => {
		if (windowWidth < 576) return productCountMobile;

		switch (productCount) {
			case 8:
				if (windowWidth < 750) return 2;
				if (windowWidth < 1100) return 3;
				if (windowWidth < 1360) return 4;
				if (windowWidth < 1600) return 6;
				return 8;
			case 7:
				if (windowWidth < 750) return 2;
				if (windowWidth < 1100) return 3;
				if (windowWidth < 1360) return 4;
				if (windowWidth < 1600) return 5;
				return 7;
			case 6:
				if (windowWidth < 750) return 2;
				if (windowWidth < 1100) return 3;
				if (windowWidth < 1360) return 4;
				if (windowWidth < 1600) return 5;
				return 6;
			case 5:
				if (windowWidth < 750) return 2;
				if (windowWidth < 1100) return 3;
				if (windowWidth < 1360) return 4;
				return 5;
			case 4:
				if (windowWidth < 750) return 2;
				if (windowWidth < 1100) return 3;
				return 4;
			case 3:
				if (windowWidth < 750) return 2;
				return 3;
			case 2:
				return 2;
			default:
				return productCountMobile;
		}
	};

	let initProductCarouselSliders = () => {
		document
			.querySelectorAll(".collection-carousel-section")
			.forEach((section) => {
				if (section.classList.contains("slider_started")) return;

				let slideEl = section.querySelector(".swiper-wrapper");
				let productCount = parseInt(slideEl.dataset.count);
				let productCountMobile = parseInt(slideEl.dataset.countMobile);
				let id = section.id;

				let createSwiper = () => {
					let windowWidth = window.innerWidth;
					let slidesPerView = calculateSlidesPerView(
						productCount,
						productCountMobile,
						windowWidth
					);

					return new Swiper(`#${id} .swiper--collections`, {
						loop: false,
						allowTouchMove: true,
						slidesPerView,
						lazy: true,
						preloadImages: false,
						spaceBetween: 24,
						navigation: {
							nextEl: `#${id} .swiper-button-next`,
							prevEl: `#${id} .swiper-button-prev`,
						},
						pagination: {
							el: `#${id} .swiper-pagination`,
							clickable: true,
						},
					});
				};

				section.classList.add("slider_started");
				let productSwiper = createSwiper();
				placeNextPrevButtons(id, `.collection-carousel__item-inner`);

				slideupAnimation(section);

				window.addEventListener("resize", () => {
					let windowWidth = window.innerWidth;
					let slidesPerView = calculateSlidesPerView(
						productCount,
						productCountMobile,
						windowWidth
					);
					productSwiper.params.slidesPerView = slidesPerView;
					productSwiper.update();
					placeNextPrevButtons(id, `.collection-carousel__item-inner`);
					slideupAnimation(section);
				});
			});
	};

	document.addEventListener("shopify:section:load", initProductCarouselSliders);
	document.addEventListener(
		"shopify:section:select",
		initProductCarouselSliders
	);

	initProductCarouselSliders();
})();
