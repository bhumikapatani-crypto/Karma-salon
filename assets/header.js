(function () {
	const initMegaSubmenu = (header) => {
		const megaSubmenuLinks = header.querySelectorAll(
			".list-menu--simple_mega_menu"
		);

		if (!megaSubmenuLinks || !megaSubmenuLinks.length) return;

		megaSubmenuLinks.forEach((link) => {
			const tabs = link.querySelectorAll(".mega-submenu__tab");
			const submenus = link.querySelectorAll(".mega-submenu__submenu");

			const onToggle = (event) => {
				const tab = event.target;
				if (!tab || !tab.classList.contains("mega-submenu__tab")) return;
				const tabId = tab.dataset.tabId;
				tabs.forEach((tab) => {
					tab.classList.remove("active");
				});
				tab.classList.add("active");
				submenus.forEach((submenu) => {
					submenu.classList.remove("active");
					if (submenu.dataset.tabId === tabId) {
						submenu.classList.add("active");
					}
				});
			};

			tabs.forEach((tab) => {
				tab.addEventListener("click", onToggle);
				tab.addEventListener("mouseenter", onToggle);
			});
		});
	};

	const header = () => {
		const header = document.querySelector(".shopify-section-header");
		const menu = document.querySelector(".list-menu--inline");
		const menuLinks = document.querySelectorAll(".list-menu-item");
		const search = document.querySelector("details-modal.header__search");

		const allSubmenu = document.querySelectorAll(".header__submenu");

		header.addEventListener("keydown", (e) => {
			if (e.code === "Escape" && search.isOpen) {
				search.close();
			}
		});

		const annBar = document.querySelector(".section-announcement");

		const annBarFirst = document.querySelector(
			".section-announcement + .shopify-section-header"
		);

		let annBarObserver;
		const createAnnBarObserver = () => {
			if (annBarObserver) annBarObserver.disconnect();
			annBarObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (annBarFirst) {
							if (entry.isIntersecting) {
								const annBarHeight =
									annBar?.getBoundingClientRect().height || 0;
								document.documentElement.style.setProperty(
									"--ann-height",
									`${(annBarHeight * entry.intersectionRatio).toFixed(2)}px`
								);
							} else {
								document.documentElement.style.setProperty(
									"--ann-height",
									"0px"
								);
							}
						}
					});
				},
				{
					threshold: Array.from({ length: 1000 }, (_, i) => i / 1000),
				}
			);

			if (annBar) annBarObserver.observe(annBar);
		};
		createAnnBarObserver();

		if (header && header.classList.contains("color-background-overlay")) {
			header.addEventListener("mouseenter", () => {
				header.classList.remove("color-background-overlay");
				header.classList.add("color-background-overlay-hidden");
			});

			header.addEventListener("mouseleave", () => {
				const drawer = document.querySelector(".drawer.active");

				if (drawer) {
					return;
				}

				header.classList.add("color-background-overlay");
				header.classList.remove("color-background-overlay-hidden");
			});
		}

		$(".header__search_desktop").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}

			$(this).addClass("slider_started");
			let id = $(this).attr("id");
			let slideEl = $(this).find(".swiper-wrapper");
			let productCountMobile = parseInt(slideEl.data("count-mobile"));

			let prodSwiperParams = {
				loop: false,
				allowTouchMove: true,
				slidesPerView: 4,
				lazy: true,
				preloadImages: false,
				spaceBetween: 14,
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

			initProductCarouselSliders.on("resize", function () {
				var windowWidth = window.innerWidth;

				if (windowWidth < 576) {
					this.params.slidesPerView = productCountMobile;
				} else if (windowWidth < 750) {
					this.params.slidesPerView = 2;
				} else if (windowWidth < 1100) {
					this.params.slidesPerView = 3;
				} else {
					this.params.slidesPerView = 4;
				}
			});
		});

		initMegaSubmenu(header);
	};

	document.addEventListener("shopify:section:load", header);
	document.addEventListener("shopify:section:unload", header);
	document.addEventListener("shopify:section:reorder", header);

	header();
})();
