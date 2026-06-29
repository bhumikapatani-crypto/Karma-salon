(function () {
	const initSection = (section) => {
		const searchBanner = section?.querySelector(".search-banner");
		animateHeading(searchBanner);

		const categoryButton = section.querySelector(".category_button");
		const categoryButtonName = section.querySelector(".category_button_name");
		const searchCollectioModal = section.querySelector(
			".search-banner__search"
		);
		const searchModal = section.querySelector(".search__main-form");
		const collectionList = section.querySelector(".collection_list");
		const categoryItems = section.querySelectorAll(".collection_list_items");

		categoryButton?.addEventListener("click", function () {
			searchCollectioModal.classList.toggle("open");
			collectionList.classList.toggle("active");
		});

		document
			.querySelectorAll(".search-banner .search-banner__search")
			.forEach((modal) => {
				document.addEventListener("click", function (e) {
					if (!modal.contains(e.target)) {
						modal.querySelector(".collection_list").classList.remove("active");
						modal.classList.remove("open");
					}
				});
			});

		categoryItems?.forEach((item, index) => {
			item.addEventListener("click", function () {
				const selectedCategory = this.getAttribute("data-category-name");
				const selectedCategoryHandle = this.getAttribute(
					"data-category-handle"
				);

				const isAlreadyActive = this.classList.contains("active");

				if (isAlreadyActive) {
					return;
				} else {
					categoryItems.forEach((i) => i.classList.remove("active"));
					searchModal.classList.forEach((cls) => {
						if (cls.startsWith("category-")) {
							searchModal.classList.remove(cls);
						}
					});

					const oldStyle = searchModal.querySelector("#dynamic-style");
					if (oldStyle) {
						oldStyle.remove();
					}

					this.classList.add("active");
					categoryButtonName.textContent = selectedCategory;
					searchModal.classList.add(`category-${selectedCategoryHandle}`);

					if (index > 0) {
						const style = document.createElement("style");
						style.id = "dynamic-style";
						style.innerHTML = `
							.search__main-collection .predictive-search__list-item:not(.category-${selectedCategoryHandle}) {
								display: none;
							}
						`;
						searchModal.appendChild(style);
					}

					collectionList.classList.remove("active");
					searchCollectioModal.classList.remove("open");
				}
			});
		});

		$(".search-baner_modal").each(function () {
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
				slidesPerView: 1,

				lazy: true,
				preloadImages: false,
				spaceBetween: 14,
				breakpoints: {
					450: {
						slidesPerView: 2,
					},
					576: {
						slidesPerView: 3,
					},
					750: {
						slidesPerView: 4,
					},
					990: {
						slidesPerView: 5,
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
			};

			let initProductCarouselSliders = new Swiper(
				`#${id} .product-carousel-swiper`,
				prodSwiperParams
			);
		});
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	});
})();
