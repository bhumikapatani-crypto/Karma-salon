(function () {
	const debounce = (func, wait) => {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	};

	const animateHeadingDebounced = debounce(animateHeading, 100);

	const slideshow = () => {
		$(".slideshow-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const id = $(this).attr("id");
			const box = $(this).find(".slideshow");
			const autoplay = box.data("autoplay");
			const isLoop = box.data("loop");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
			const slideSpeed = box.data("speed") * 1000;
			const slideCount = box.data("slide-count");
			const textEffects = box.data("text-effects");
			let parallaxEffect = false;
			let animationEffect = false;

			if (textEffects == "parallax") {
				parallaxEffect = true;
			}

			if (textEffects == "animation") {
				animationEffect = true;
			}

			let autoplayParam;
			if (autoplay && slideCount > 1) {
				autoplayParam = {
					autoplay: {
						delay: delay,
						pauseOnMouseEnter: stopAutoplay,
						disableOnInteraction: false,
					},
				};
			} else {
				autoplayParam = {
					autoplay: false,
				};
			}

			const commonParams = {
				speed: slideSpeed,
				effect: box.data("effect"),
				loop: isLoop && slideCount > 1,
				keyboard: true,
				...autoplayParam,
			};

			const swiperOverlayParams = {
				parallax: parallaxEffect,
				centeredSlides: false,
				creativeEffect: {
					prev: {
						translate: ["0%", "0%", 0],
					},
					next: {
						translate: ["0%", "0%", 0],
					},
				},
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: true,
				},
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
			};

			const changeColorScheme = (context) => {
				const activeIndex = context.activeIndex;
				const activeSlide = context.slides[activeIndex];
				const changeItems = [
					context.navigation.nextEl,
					context.navigation.prevEl,
					context.pagination.el,
				];

				const colorScheme = activeSlide.dataset.colorScheme;

				changeItems.forEach((item) => {
					if (item && item instanceof HTMLElement) {
						let classNames = item.getAttribute("class");
						classNames = classNames.replace(/color-background-\d+/g, "");
						item.setAttribute("class", classNames);
						item.classList.add(colorScheme);
					}
				});
			};

			const headings = document.querySelectorAll(
				`#${id} .slideshow-slide__content`
			);

			const swiperOverlay = new Swiper(`#${id} .slideshow__swiper`, {
				...commonParams,
				...swiperOverlayParams,
				on: {
					slidePrevTransitionStart: (e) => {
						if (animationEffect) {
							const activeIndex = swiperOverlay.realIndex;
							headings.forEach((item, index) => {
								if (index === activeIndex) {
									animateHeadingDebounced(item);
								}
							});
						}

						if (box.data("effect") == "creative") {
							let outgoingImg = $(`#${id} .slideshow-slide`).eq(
								e.previousIndex
							);

							gsap.fromTo(
								outgoingImg,
								{ x: "0%" },
								{ x: "10%", duration: 0.8, delay: 0, ease: "power3.InOut" }
							);

							let incomingImg = $(`#${id} .slideshow-slide`).eq(e.activeIndex);

							$(`#${id} .swiper-slide`).eq(e.activeIndex).css("z-index", "90");
							$(`#${id} .swiper-slide`)
								.eq(e.previousIndex)
								.css("z-index", "50");

							gsap.fromTo(
								incomingImg,
								{
									x: "-10%",
									clipPath: "polygon(0% 0%, -20% 0%, 0% 100%, 0% 100%)",
								},
								{
									x: "0%",
									clipPath: "polygon(0% 0%, 120% 0%, 100% 100%, 0% 100%)",
									duration: 0.95,
									ease: "power3.InOut",
								}
							);
						}
					},
					slideNextTransitionStart: (e) => {
						if (animationEffect) {
							const activeIndex = swiperOverlay.realIndex;
							headings.forEach((item, index) => {
								if (index === activeIndex) {
									animateHeadingDebounced(item);
								}
							});
						}
						if (box.data("effect") == "creative") {
							let outgoingImg = $(`#${id} .slideshow-slide`).eq(
								e.previousIndex
							);

							gsap.fromTo(
								outgoingImg,
								{ x: "0%" },
								{ x: "-10%", duration: 0.8, delay: 0, ease: "power3.InOut" }
							);

							let incomingImg = $(`#${id} .slideshow-slide`).eq(e.activeIndex);

							$(`#${id} .swiper-slide`).eq(e.activeIndex).css("z-index", "90");
							$(`#${id} .swiper-slide`)
								.eq(e.previousIndex)
								.css("z-index", "50");

							gsap.fromTo(
								incomingImg,
								{
									x: "10%",
									clipPath: "polygon(120% 0%, 100% 0%, 100% 100%, 100% 100%)",
								},
								{
									x: "0%",
									clipPath: "polygon(-20% 0%, 100% 0%, 100% 100%, 0% 100%)",
									duration: 0.95,
									ease: "power3.InOut",
								}
							);
						}
					},
					init: () => {
						if (animationEffect) {
							setTimeout(() => {
								animateHeadingDebounced(headings[0]);
							}, 0);
						}
						if (box.data("effect") == "creative") {
							$(`#${id} .slideshow`).addClass("start");
						}
					},
				},
			});

			const slides = document.querySelectorAll(
				`#${id} .slideshow__swiper .swiper-slide`
			);

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							if (animationEffect) {
								const activeIndex = swiperOverlay.realIndex;
								headings.forEach((item, index) => {
									if (index === activeIndex) {
										animateHeadingDebounced(item);
									}
								});
							}
						}
					});
				},
				{ threshold: 0.5 }
			); 

			slides.forEach((slide) => observer.observe(slide));

			changeColorScheme(swiperOverlay);
			swiperOverlay.on("beforeTransitionStart", function () {
				changeColorScheme(this);
			});

			synchronizeWithTabs(swiperOverlay);
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		slideshow();
		document.addEventListener("shopify:section:load", function () {
			slideshow();
		});
	});
})();
