(() => {
	let productSwipers = {};

	let initProductCarouselSliders = () => {
		$(".section-list-collections").each(function () {
			let id = $(this).attr("id");
			if (!id) {
				id = "collection-" + Math.random().toString(36).substring(2, 10);
				$(this).attr("id", id);
			}

			let slideEl = $(this).find(".swiper--collections");
			let productCountMobile = parseInt(slideEl.data("count-mobile")) || 1;

			const indent_value =
				parseFloat((slideEl.data("gap") || "0rem").replace("rem", "")) * 10;

			if (productSwipers[id]) {
				productSwipers[id].destroy(true, true);
				productSwipers[id] = null;
			}

			if (window.innerWidth <= 575) {
				let prodSwiperParams = {
					loop: false,
					autoHeight: true,
					allowTouchMove: true,
					slidesPerView: productCountMobile,
					slidesPerGroup: productCountMobile,
					lazy: true,
					preloadImages: false,
					spaceBetween: indent_value,
					pagination: {
						el: `#${id} .swiper-pagination`,
						clickable: true,
					},
				};

				if ($(`#${id} .swiper--collections`).length > 0) {
					console.log("Initializing Swiper for", id);
					productSwipers[id] = new Swiper(
						`#${id} .swiper--collections`,
						prodSwiperParams
					);
				}
			}

			$(this).addClass("slider_started");
		});
	};

	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			initProductCarouselSliders();
		}, 250);
	});

	document.addEventListener("shopify:section:load", function () {
		console.log("Shopify section load event triggered");
		initProductCarouselSliders();
	});

	document.addEventListener("shopify:section:select", function () {
		console.log("Shopify section select event triggered");
		initProductCarouselSliders();
	});

	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	) {
		setTimeout(initProductCarouselSliders, 1);
	} else {
		document.addEventListener("DOMContentLoaded", initProductCarouselSliders);
	}
})();
