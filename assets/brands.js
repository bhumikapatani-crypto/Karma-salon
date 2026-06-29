(function () {
	const initSlider = (section) => {
		const slider = section?.querySelector(".swiper__brands");
		let id = section.getAttribute("id");

		if (slider) {
			let slideEl = slider.querySelector(".swiper-wrapper");
			let productCount = parseInt(slideEl.dataset.count);
			let productCountMobile = parseInt(slideEl.dataset.countmob);

			if (slider.swiper) {
				slider.swiper.destroy(true, true);
			}

			var windowWidth = window.innerWidth;
			let slidesPerView;

			if (productCount == 9) {
				if (windowWidth < 576) {
					slidesPerView = productCountMobile;
				} else if (windowWidth < 750) {
					slidesPerView = 2;
				} else if (windowWidth < 1100) {
					slidesPerView = 3;
				} else if (windowWidth < 1360) {
					slidesPerView = 4;
				} else if (windowWidth < 1450) {
					slidesPerView = 5;
				} else if (windowWidth < 1600) {
					slidesPerView = 6;
				} else if (windowWidth < 1800) {
					slidesPerView = 7;
				} else if (windowWidth < 1900) {
					slidesPerView = 8;
				} else {
					slidesPerView = 9;
				}
			} else if (productCount == 8) {
				if (windowWidth < 576) {
					slidesPerView = productCountMobile;
				} else if (windowWidth < 750) {
					slidesPerView = 2;
				} else if (windowWidth < 1100) {
					slidesPerView = 3;
				} else if (windowWidth < 1360) {
					slidesPerView = 4;
				} else if (windowWidth < 1450) {
					slidesPerView = 5;
				} else if (windowWidth < 1600) {
					slidesPerView = 6;
				} else if (windowWidth < 1800) {
					slidesPerView = 7;
				} else {
					slidesPerView = 8;
				}
			} else if (productCount == 7) {
				if (windowWidth < 576) {
					slidesPerView = productCountMobile;
				} else if (windowWidth < 750) {
					slidesPerView = 2;
				} else if (windowWidth < 1100) {
					slidesPerView = 3;
				} else if (windowWidth < 1360) {
					slidesPerView = 4;
				} else if (windowWidth < 1450) {
					slidesPerView = 5;
				} else if (windowWidth < 1600) {
					slidesPerView = 6;
				} else {
					slidesPerView = 7;
				}
			} else if (productCount == 6) {
				if (windowWidth < 576) {
					slidesPerView = productCountMobile;
				} else if (windowWidth < 750) {
					slidesPerView = 2;
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
					slidesPerView = 2;
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
					slidesPerView = 2;
				} else if (windowWidth < 1100) {
					slidesPerView = 3;
				} else {
					slidesPerView = 4;
				}
			} else if (productCount == 3) {
				if (windowWidth < 576) {
					slidesPerView = productCountMobile;
				} else if (windowWidth < 750) {
					slidesPerView = 2;
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

			new Swiper(slider, {
				loop: false,
				speed: 800,
				slidesPerView: slidesPerView,
				breakpoints: {
					320: {
						spaceBetween: 40,
					},
					750: {
						spaceBetween: 60,
					},
					990: {
						spaceBetween: 80,
					},
				},
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
			});
		}
	};

	const initSection = (section) => {
		if (section && section.classList.contains("brands-section")) {
			initSlider(section);

			const sectionResizeObserver = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					initSlider(section);
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
