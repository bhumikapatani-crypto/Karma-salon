(function () {
	const videoBehavior = (section) => {
		const videos = section.querySelectorAll(
			".simple-image-multicolumn-card__image video"
		);

		if (videos.length > 0) {
			videos.forEach((video) => {
				const card = video.closest(".simple-image-multicolumn-card");

				video.pause();

				card.addEventListener("mouseenter", () => video.play());
				card.addEventListener("mouseleave", () => video.pause());
			});
		}
	};

	const initSection = (section) => {
		const id = section.getAttribute("id");
		const swiperSelector = `#${id} .swiper-container`;
		const swiperContainer = document.querySelector(swiperSelector);
		const columns_count = swiperContainer.dataset.columns;
		const mobTwoColumn =
			section.querySelector(
				".simple-image-multicolumn-list__wrapper--2-mobile"
			) != null;

		const swiper = new Swiper(swiperSelector, {
			slidesPerView: columns_count,
			spaceBetween: 24,
			freeMode: true,
			grabCursor: true,
			onInit: (swiper) => centerSwiper(),
			mousewheel: {
				forceToAxis: true,
				sensitivity: 0.5,
				releaseOnEdges: true,
			},
			breakpoints: {
				0: {
					slidesPerView: mobTwoColumn ? 2 : 1,
					slidesPerGroup: 1,
					freeMode: false,
					grabCursor: false,
					spaceBetween: 16,
				},
				990: {
					slidesPerView: columns_count > 3 ? 3 : columns_count,
					freeMode: true,
					grabCursor: true,
					spaceBetween: 24,
				},
				1100: {
					slidesPerView: columns_count > 4 ? 3 : columns_count,
				},
				1360: {
					slidesPerView: columns_count,
				},
			},
			pagination: {
				el: section.querySelector(`.swiper-pagination`),
				clickable: true,
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

		swiper.on("resize", () => {
			centerSwiper();
		});

		const handleMouseMove = (e) => {
			const rect = swiperContainer.getBoundingClientRect();
			const dir = document.querySelector("html").dir;
			const x = e.clientX - rect.left;
			const percentage = dir === "rtl" ? 1 - x / rect.width : x / rect.width;
			const maxTranslate = swiper.maxTranslate();
			const translateValue = maxTranslate * percentage;

			swiper.setTranslate(translateValue);
		};

		const handleMouseLeave = () => {
			centerSwiper(1500);
		};

		if (window.innerWidth < 990) {
			swiperContainer.removeEventListener("mousemove", handleMouseMove);
			swiperContainer.removeEventListener("mouseleave", handleMouseLeave);
			swiper.setTranslate(0);
		} else {
			swiperContainer.addEventListener("mousemove", handleMouseMove);
			swiperContainer.addEventListener("mouseleave", handleMouseLeave);
			swiper.on("init", centerSwiper);
		}

		videoBehavior(section);

		const slideItems = swiperContainer.querySelectorAll(".swiper-slide");

		slideItems.forEach((slide) => {
			slide.addEventListener("mouseenter", () => {
				section.removeEventListener("mousemove", handleMouseMove);
				section.removeEventListener("mouseleave", handleMouseLeave);
				swiper.allowTouchMove = false;
			});

			slide.addEventListener("mouseleave", () => {
				section.addEventListener("mousemove", handleMouseMove);
				section.addEventListener("mouseleave", handleMouseLeave);
				swiper.allowTouchMove = true;
			});
		});
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (section) {
		initSection(document.currentScript.parentElement);
	});
})();
