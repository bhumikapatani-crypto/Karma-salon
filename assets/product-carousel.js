(() => {
	let initProductCarouselSliders = () => {
		$(".product-carousel-section .product_carousel").each(function () {
			if ($(this).hasClass("slider_started")) {
				return;
			}

			$(this).addClass("slider_started");
			let id = $(this).attr("id");
			let slideEl = $(this).find(".swiper-wrapper");
			let productCount = parseInt(slideEl.data("count"));
			let productCountMobile = parseInt(slideEl.data("count-mobile"));
			let margin = slideEl.data("margin");

			let prodSwiperParams = {
				loop: false,
				allowTouchMove: true,
				slidesPerView: productCount,
				lazy: true,
				preloadImages: false,
				spaceBetween: margin,
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
			};

			let initProductCarouselSliders = new Swiper(
				`#${id} .product-carousel-swiper`,
				prodSwiperParams
			);

			function updateSlidesPerView() {
				var windowWidth = window.innerWidth;
				if (productCount == 6) {
					if (windowWidth < 576) {
						initProductCarouselSliders.params.slidesPerView =
							productCountMobile;
					} else if (windowWidth < 750) {
						initProductCarouselSliders.params.slidesPerView = 2;
					} else if (windowWidth < 1100) {
						initProductCarouselSliders.params.slidesPerView = 3;
					} else if (windowWidth < 1360) {
						initProductCarouselSliders.params.slidesPerView = 4;
					} else if (windowWidth < 1600) {
						initProductCarouselSliders.params.slidesPerView = 5;
					} else {
						initProductCarouselSliders.params.slidesPerView = 6;
					}
				} else if (productCount == 5) {
					if (windowWidth < 576) {
						initProductCarouselSliders.params.slidesPerView =
							productCountMobile;
					} else if (windowWidth < 750) {
						initProductCarouselSliders.params.slidesPerView = 2;
					} else if (windowWidth < 1100) {
						initProductCarouselSliders.params.slidesPerView = 3;
					} else if (windowWidth < 1360) {
						initProductCarouselSliders.params.slidesPerView = 4;
					} else {
						initProductCarouselSliders.params.slidesPerView = 5;
					}
				} else if (productCount == 4) {
					if (windowWidth < 576) {
						initProductCarouselSliders.params.slidesPerView =
							productCountMobile;
					} else if (windowWidth < 750) {
						initProductCarouselSliders.params.slidesPerView = 2;
					} else if (windowWidth < 1100) {
						initProductCarouselSliders.params.slidesPerView = 3;
					} else {
						initProductCarouselSliders.params.slidesPerView = 4;
					}
				} else if (productCount == 3) {
					if (windowWidth < 576) {
						initProductCarouselSliders.params.slidesPerView =
							productCountMobile;
					} else if (windowWidth < 750) {
						initProductCarouselSliders.params.slidesPerView = 2;
					} else {
						initProductCarouselSliders.params.slidesPerView = 3;
					}
				} else if (productCount == 2) {
					if (windowWidth < 576) {
						initProductCarouselSliders.params.slidesPerView =
							productCountMobile;
					} else {
						initProductCarouselSliders.params.slidesPerView = 2;
					}
				}
				initProductCarouselSliders.update();
			}

			window.addEventListener("resize", updateSlidesPerView);

			updateSlidesPerView();
		});
	};

	document.addEventListener("shopify:section:load", initProductCarouselSliders);

	initProductCarouselSliders();
})();
