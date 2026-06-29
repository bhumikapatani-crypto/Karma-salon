(function () {
	const fourthLayoutFeatures = (section_id) => {
		if ($("#" + section_id + " .blog__posts-wrapper--layout4").length > 0) {
			let secondColumnChildren = $(`#${section_id} .blog__post--second-child`);
			let mobileVersion = $(window).width() < 990;
			let isColTwo =
				$("#" + section_id + " .article-card__layout-4--col-2").length > 0;

			if (mobileVersion && isColTwo) {
				secondColumnChildren.unwrap();
			} else if (!isColTwo) {
				secondColumnChildren.wrapAll(
					`<div class="article-card__layout-4--col-2"></div>`
				);
			}
		}
	};

	let placeNextPrevButtons = (section_id, img_selector) => {
		let selectBtn = (btn_pos) =>
			document?.querySelector(`#${section_id} .swiper-button-${btn_pos}`);

		let nextBtn = selectBtn("next");
		let prevBtn = selectBtn("prev");

		let imageWrapper = document?.querySelector(
			`#${section_id} ${img_selector}`
		);
		let isImage = imageWrapper?.querySelector("img") !== null;
		let articleHeight = document?.querySelector(
			`#${section_id} .blog__post`
		)?.clientHeight;
		let imageHeight = imageWrapper?.clientHeight;

		let topValue = (btn) =>
			`${(isImage ? imageHeight : articleHeight - btn?.clientHeight) / 2}px`;

		if (nextBtn && prevBtn && imageHeight) {
			nextBtn.style.top = topValue(nextBtn);
			prevBtn.style.top = topValue(prevBtn);
		}
	};

	const addClasses = (slider) => {
		const sliderWrapper = slider.querySelector(".blog__posts-wrapper");
		const slides = slider.querySelectorAll(".blog__post");

		if (slider.swiper) {
			slider.swiper.destroy(true, true);
		}

		slider.classList.add("swiper");
		if (sliderWrapper) sliderWrapper.classList.add("swiper-wrapper");
		if (slides.length > 1) {
			slides.forEach((slide) => {
				slide.classList.add("swiper-slide");
			});
		}
	};

	const initSlider = (section) => {
		const slider = section.querySelector(".swiper--articles:not(.no-swiper)");
		let id = section.getAttribute("id");

		if (slider) {
			addClasses(slider);
			const numberColumnsMobile = Number(slider.dataset.columnsMobile) || 1;
			const numberColumns = Number(slider.dataset.columns);

			const windowWidth = window.innerWidth;
			let xl = windowWidth > 1099;
			let lg = windowWidth > 989;
			let md = windowWidth > 749;

			let columnsCount;

			switch (numberColumns) {
				case 4:
					if (xl) {
						columnsCount = 4;
					} else if (lg) {
						columnsCount = 3;
					} else if (md) {
						columnsCount = 2;
					}
					break;

				case 3:
					if (lg) {
						columnsCount = 3;
					} else if (md) {
						columnsCount = 2;
					}
					break;
				case 2:
					if (md) {
						columnsCount = 2;
					}
					break;
				default:
					columnsCount = 1;
			}

			new Swiper(slider, {
				loop: false,
				speed: 800,
				slidesPerView: columnsCount,
				slidesPerGroup: 1,
				breakpoints: {
					0: {
						spaceBetween: 8,
						slidesPerView: Number(numberColumnsMobile),
					},
					750: {
						spaceBetween: 16,
					},
					990: {
						spaceBetween: 24,
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

			placeNextPrevButtons(id, `.article-card__image-wrapper`);
		}
	};

	const initSection = (section) => {
		if (section && section.classList.contains("section-featured-blog")) {
			initSlider(section);

			fourthLayoutFeatures(section.getAttribute("id"));
			window.addEventListener("resize", () => {
				fourthLayoutFeatures(section.getAttribute("id"));
			});

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
