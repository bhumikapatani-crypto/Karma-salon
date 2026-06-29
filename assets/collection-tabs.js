(() => {
	let initProductCarouselSliders = () => {
		$(".product-carousel-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return;
			}

			$(this).addClass("slider_started");
			let id = $(this).attr("id");
			let slideEl = $(this).find(".swiper-wrapper");
			let productCount = parseInt(slideEl.data("count"));
			let productCountMobile = parseInt(slideEl.data("count-mobile"));
			let margin = slideEl.data("margin");

			$(`#${id} [id^="product-carousel-main-"]`).each(function () {
				let prodSwiperParams = {
					loop: false,
					allowTouchMove: true,
					slidesPerView: productCount,
					lazy: true,
					preloadImages: false,
					spaceBetween: margin,
					navigation: {
						nextEl: $(this).find(".swiper-button-next")[0],
						prevEl: $(this).find(".swiper-button-prev")[0],
					},
					pagination: {
						el: $(this).find(".swiper-pagination")[0],
						clickable: true,
					},
				};

				let initProductCarouselSliders = new Swiper(
					$(this).find(".product-carousel-swiper")[0],
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
		});
	};

	const collectionTabs = () => {
		const tabsSections = document.querySelectorAll(".product-carousel");

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

	document.addEventListener("DOMContentLoaded", function () {
		initProductCarouselSliders();
		collectionTabs();
		document.addEventListener("shopify:section:load", function () {
			initProductCarouselSliders();
			collectionTabs();
		});
	});
})();
