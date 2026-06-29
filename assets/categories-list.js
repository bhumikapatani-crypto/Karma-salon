(() => {
	let placeNextPrevButtons = (section_id, img_selector) => {
		let nextBtn = document?.querySelector(`#${section_id} .swiper-button-next`);
		let prevBtn = document?.querySelector(`#${section_id} .swiper-button-prev`);

		let imageHeight = document?.querySelector(
			`#${section_id} ${img_selector}`
		)?.clientHeight;
		let topValue = (btn) => `${(imageHeight - btn?.clientHeight) / 2}px`;

		if (nextBtn && prevBtn && imageHeight) {
			nextBtn.style.top = topValue(nextBtn);
			prevBtn.style.top = topValue(prevBtn);
		}
	};

	let initProductCarouselSliders = () => {
		$(".categories-list-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return;
			}

			let slideEl = $(this).find(".swiper-wrapper");
			let productCount = parseInt(slideEl.data("count"));
			let productCountMobile = parseInt(slideEl.data("count-mobile"));

			const slidesPerViewCounter = () => {
				var windowWidth = window.innerWidth;
				if (productCount == 12) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 5;
					} else if (windowWidth < 1360) {
						slidesPerView = 7;
					} else if (windowWidth < 1700) {
						slidesPerView = 9;
					} else {
						slidesPerView = 12;
					}
				} else if (productCount == 11) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 4;
					} else if (windowWidth < 1360) {
						slidesPerView = 6;
					} else if (windowWidth < 1700) {
						slidesPerView = 8;
					} else {
						slidesPerView = 11;
					}
				} else if (productCount == 10) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 4;
					} else if (windowWidth < 1360) {
						slidesPerView = 6;
					} else if (windowWidth < 1600) {
						slidesPerView = 8;
					} else {
						slidesPerView = 10;
					}
				} else if (productCount == 9) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 3;
					} else if (windowWidth < 1360) {
						slidesPerView = 5;
					} else if (windowWidth < 1600) {
						slidesPerView = 7;
					} else {
						slidesPerView = 9;
					}
				} else if (productCount == 8) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 3;
					} else if (windowWidth < 1360) {
						slidesPerView = 4;
					} else if (windowWidth < 1600) {
						slidesPerView = 6;
					} else {
						slidesPerView = 8;
					}
				} else if (productCount == 7) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 3;
					} else if (windowWidth < 1360) {
						slidesPerView = 4;
					} else if (windowWidth < 1600) {
						slidesPerView = 5;
					} else {
						slidesPerView = 7;
					}
				} else if (productCount == 6) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 3;
					} else if (windowWidth < 1360) {
						slidesPerView = 4;
					} else if (windowWidth < 1600) {
						slidesPerView = 5;
					} else {
						slidesPerView = 6;
					}
				} else if (productCount == 5) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 3;
					} else if (windowWidth < 1360) {
						slidesPerView = 4;
					} else {
						slidesPerView = 5;
					}
				} else if (productCount == 4) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else if (windowWidth < 1100) {
						slidesPerView = 3;
					} else {
						slidesPerView = 4;
					}
				} else if (productCount == 3) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else if (windowWidth < 750) {
						slidesPerView = 3;
					} else {
						slidesPerView = 3;
					}
				} else if (productCount == 2) {
					if (windowWidth < 576) {
						slidesPerView = productCountMobile;
					} else {
						slidesPerView = 2;
					}
				}
				return slidesPerView;
			};

			$(this).addClass("slider_started");
			let id = $(this).attr("id");

			const slidesPerGroup =
				window.innerWidth > 1600 && slidesPerViewCounter() > 4
					? 3
					: window.innerWidth > 1100
					? slidesPerViewCounter() > 4
						? 3
						: 2
					: 1;

			let prodSwiperParams = {
				loop: false,
				autoHeight: true,
				allowTouchMove: true,
				slidesPerView:
					window.innerWidth < 576 ? productCountMobile : slidesPerViewCounter(),
				lazy: true,
				preloadImages: false,
				spaceBetween: 24,
				slidesPerGroup: slidesPerGroup,
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
			};

			let productSwiper = new Swiper(
				`#${id} .swiper--collections`,
				prodSwiperParams
			);

			placeNextPrevButtons(id, `.categories-list__item-inner`);

			const updateSwiper = (timeout = 500) => {
				setTimeout(() => {
					let windowWidth = window.innerWidth;
					productSwiper.params.slidesPerView =
						windowWidth < 576 ? productCountMobile : slidesPerViewCounter();
					productSwiper.params.slidesPerGroup =
						windowWidth > 1600 && slidesPerViewCounter() > 4
							? 3
							: windowWidth > 1100
							? slidesPerViewCounter() > 4
								? 3
								: 2
							: 1;
					productSwiper.update();

					placeNextPrevButtons(id, `.categories-list__item-inner`);
				}, timeout);
			};

			updateSwiper();

			animateHeading(document.querySelector(`#${id} .categories-list`));

			window.addEventListener("resize", () => updateSwiper());
			document.addEventListener("shopify:section:select", () =>
				updateSwiper(0)
			);
		});
	};

	document.addEventListener("shopify:section:load", function () {
		initProductCarouselSliders();
	});

	document.addEventListener("shopify:section:select", function () {
		initProductCarouselSliders();
	});

	initProductCarouselSliders();
})();
