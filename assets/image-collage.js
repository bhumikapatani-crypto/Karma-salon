(function () {
	const initSection = (section) => {
		const id = section.getAttribute("id");
		const swiperSelector = `#${id} .swiper-container`;

		if (document.querySelector(swiperSelector) != null) {
			const swiperContainer = document.querySelector(swiperSelector);
			const isGap = swiperContainer.querySelector(".gap") != null;
			const columns_count = parseInt(swiperContainer?.dataset.columns);
			const mobTwoColumn =
				section.querySelector(".image-collage-list__wrapper--2-mobile") != null;

			const swiper = new Swiper(swiperSelector, {
				slidesPerView: columns_count,
				spaceBetween: isGap ? 24 : 0,
				freeMode: true,
				grabCursor: true,
				onInit: (swiper) => centerSwiper(),
				mousewheel: {
					forceToAxis: true,
				},
				breakpoints: {
					0: {
						slidesPerView: mobTwoColumn ? 2 : 1,
						slidesPerGroup: 1,
						freeMode: false,
						grabCursor: false,
						spaceBetween: isGap ? 16 : 0,
					},
					990: {
						slidesPerView: columns_count > 3 ? 4.25 : columns_count + 1.25,
						freeMode: true,
						grabCursor: true,
						spaceBetween: isGap ? 24 : 0,
					},
					1100: {
						slidesPerView: columns_count > 4 ? 5.25 : columns_count + 1.25,
					},
					1360: {
						slidesPerView: columns_count + 1.25,
						initialSlide: 1,
					},
				},
			});

			function centerSwiper(time = 0) {
				if (!swiper) return;

				const wrapper = swiper.wrapperEl;
				const totalWidth = wrapper.scrollWidth;
				const swiperWidth = swiper.el.clientWidth;

				const offset = (totalWidth - swiperWidth) / 2;

				const isMobile = window.innerWidth < 990;

				isMobile
					? swiper.translateTo(0, time, time !== 0)
					: swiper.translateTo(-offset, time, time !== 0);
				swiper.updateProgress();
			}

			swiper.on("resize", centerSwiper);

			function handleMouseMove(e) {
				if (swiperContainer.contains(e.target)) return;
				const dir = document.querySelector("html").dir;
				const rect = swiperContainer.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const percentage = dir === "rtl" ? 1 - x / rect.width : x / rect.width;
				const maxTranslate = swiper.maxTranslate();
				const translateValue = maxTranslate * percentage;

				swiper.setTranslate(translateValue);
			}

			let isDragging = false;

			swiper.on("touchStart", () => {
				isDragging = true;
			});

			swiper.on("touchEnd", () => {
				isDragging = false;
			});

			const handleMouseLeave = () => {
				if (!isDragging) {
					setTimeout(() => centerSwiper(3000), 100);
				}
			};

			if (window.innerWidth < 990) {
				section.removeEventListener("mousemove", handleMouseMove);
				section.removeEventListener("mouseleave", handleMouseLeave);
				swiper.setTranslate(0);
			} else {
				section.addEventListener("mousemove", handleMouseMove);
				section.addEventListener("mouseleave", handleMouseLeave);
				swiper.on("init", centerSwiper);
			}
		}
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (section) {
		initSection(document.currentScript.parentElement);
	});
})();
