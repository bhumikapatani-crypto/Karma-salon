// prettier-ignore
class PredictiveSearch extends SearchForm {
	constructor() {
		super();
		this.cachedResults = {};
		this.predictiveSearchResults = this.querySelector("[data-predictive-search]");
		this.allPredictiveSearchInstances =
			document.querySelectorAll("predictive-search");
		this.isOpen = false;
		this.abortController = new AbortController();
		this.searchTerm = "";
		this.body = document.querySelector("body");
		this.header = document.querySelector(".header-wrapper");
		this.promoModal = this.querySelector(".search__modal");
		this.promoModalBanner = this.querySelector(".search-baner_modal");
		this.collectionList = document.querySelector(".template-404__collections");
		this.headerInput = document.querySelector(".header__search .search__input");
		this.categoryButton =  this.querySelector(".category_button");
		this.collectionListBanner = document.querySelector(".collection_list");
		
		this.setupEventListeners();

		document.querySelectorAll('predictive-search').forEach((modal) => {
			document.addEventListener('click', function(e) {
				if (!modal.contains(e.target)) {
					modal.close(true, true);
				}
			});

			document.addEventListener('focusin', function(e) {
				if (!modal.contains(e.target)) {
					modal.close(true, true);
				}
			});
		});
	}

	setupEventListeners() {
		this.input.form.addEventListener("submit", this.onFormSubmit.bind(this));
		this.input.addEventListener("focus", this.onFocus.bind(this));

		this.addEventListener("keyup", this.onKeyup.bind(this));
	}

	getQuery() {
		return this.input.value.trim();
	}

	onChange() {
		const newSearchTerm = this.getQuery();
		if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
			this.querySelector("#predictive-search-results-groups-wrapper")?.remove();
		}

		this.updateSearchForTerm(this.searchTerm, newSearchTerm);

		this.searchTerm = newSearchTerm;

		if (!this.searchTerm.length) {
			this.close(true);
			return;
		}

		this.getSearchResults(this.searchTerm);

	}

	onFormSubmit(event) {
		if (
			!this.getQuery().length ||
			this.querySelector('[aria-selected="true"] a') 
		)
			event.preventDefault();
	}

	onFormReset(event) {
		super.onFormReset(event);
		if (super.shouldResetForm()) {
			this.searchTerm = "";
			this.abortController.abort();
			this.abortController = new AbortController();
			this.closeResults(true);
		}
	}

	onFocus(event) {
		event.preventDefault();
		const currentSearchTerm = this.getQuery();
		if (this.classList.contains("search-modal__form")) {
			this.header.classList.add("header--search");

			if (this.promoModal) {
				this.promoModal.classList.remove("search__modal--hidden");
				this.header.classList.add("header--search");
			}
			if (this.collectionList) {
				this.collectionList.classList.remove("hidden");
			}
		}

		if (this.promoModalBanner) {
			this.promoModalBanner.classList.remove("search__modal--hidden");
			const parentElemnt = this.promoModalBanner.parentNode.parentNode.parentNode
			parentElemnt.classList.add("active")
		}

		if (this.collectionListBanner) {
			this.collectionListBanner.classList.remove("active");
			document.querySelector(".search-banner__search").classList.remove("open");
		}

		if (!currentSearchTerm.length) {
			return;
		}

		if (this.searchTerm !== currentSearchTerm) {
			this.onChange();
		} else if (this.getAttribute("results") === "true") {
			this.open();
			if (this.promoModal) {
				this.promoModal.classList.add("search__modal--hidden");
				this.header.classList.remove("header--search");
			}
			if (this.promoModalBanner) {
				this.promoModalBanner.classList.add("search__modal--hidden");
				const parentElemnt = this.promoModalBanner.parentNode.parentNode.parentNode
				parentElemnt.classList.remove("active")
			}
			if (this.collectionList) {
				this.collectionList.classList.add("hidden");
			}
		} else {
			this.getSearchResults(this.searchTerm);
		}
	}

	onFocusOut(e) {
		const withBoundaries = e.composedPath().includes(this);

		  const clickedInside = this.contains(e.target);


		if (!withBoundaries && this.classList.contains("search-modal__form-desktop")) {
      this.close(true);
    }

		
  if (!clickedInside && this.classList.contains("search-modal__form-desktop")) {
    this.close(true);
  }
	
	}

	onBlur() {
		this.headerInput.blur();
	}

	onKeyup(event) {
		if (!this.getQuery().length) this.close(true);
		event.preventDefault();

		switch (event.code) {
			case "Enter":
				this.selectOption();
				break;
			case "Escape":
				this.closeResults(clearSearchTerm);
				if (this.promoModal && this.classList.contains("search-modal__form")) {
					this.promoModal.classList.add("search__modal--hidden");
					this.header.classList.remove("header--search");
				}
				if (this.promoModalBanner) {
					this.promoModalBanner.classList.add("search__modal--hidden");
					const parentElemnt = this.promoModalBanner.parentNode.parentNode.parentNode
					parentElemnt.classList.remove("active")
			  }
				break;
		}
	}

	updateSearchForTerm(previousTerm, newTerm) {
		const searchForTextElement = this.querySelector(
			"[data-predictive-search-search-for-text]",
		);
		const currentButtonText = searchForTextElement?.innerText;
		if (currentButtonText) {
			if (
				currentButtonText.matchAll(new RegExp(previousTerm, "g")).length > 1
			) {
				return;
			}
			const newButtonText = currentButtonText.replace(previousTerm, newTerm);
			searchForTextElement.innerText = newButtonText;
		}
	}

	selectOption() {
		const selectedOption = this.querySelector(
			'[aria-selected="true"] a, button[aria-selected="true"]',
		);

		if (selectedOption) selectedOption.click();
	}

	getSearchResults(searchTerm) {
		const queryKey = searchTerm.replace(" ", "-").toLowerCase();
		this.setLiveRegionLoadingState();

		if (this.cachedResults[queryKey]) {
			this.renderSearchResults(this.cachedResults[queryKey]);
			this.clickSearchTabs();
			this.changePosition();
			return;
		}

		if (this.promoModal && this.classList.contains("search-modal__form")) {
			this.promoModal.classList.add("search__modal--hidden");
			this.header.classList.remove("header--search");
		}

		if (this.promoModalBanner) {
			this.promoModalBanner.classList.add("search__modal--hidden");
			const parentElemnt = this.promoModalBanner.parentNode.parentNode.parentNode
			parentElemnt.classList.remove("active")
		}

		if (this.collectionList) {
			this.collectionList.classList.add("hidden");
		}

		fetch(
			`${routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`,
			{ signal: this.abortController.signal },
		)
			.then((response) => {
				if (!response.ok) {
					var error = new Error(response.status);
					this.close();
					throw error;
				}
				return response.text();
			})
			.then((text) => {
				const resultsMarkup = new DOMParser()
					.parseFromString(text, "text/html")
					.querySelector("#shopify-section-predictive-search").innerHTML;
				this.allPredictiveSearchInstances.forEach(
					(predictiveSearchInstance) => {
						predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
					},
				);
				this.renderSearchResults(resultsMarkup);
				this.clickSearchTabs();
				this.changePosition();
				try {
					colorSwatches();
				} catch (err) {}
			})
			.catch((error) => {
				if (error?.code === 20) {
					return;
				}
				this.close();
				throw error;
			});
	}

	setLiveRegionLoadingState() {
		this.statusElement =
			this.statusElement || this.querySelector(".predictive-search-status");
		this.loadingText =
			this.loadingText || this.getAttribute("data-loading-text");

		this.setLiveRegionText(this.loadingText);
		this.setAttribute("loading", true);
	}

	setLiveRegionText(statusText) {
		this.statusElement.setAttribute("aria-hidden", "false");
		this.statusElement.textContent = statusText;

		setTimeout(() => {
			this.statusElement.setAttribute("aria-hidden", "true");
		}, 1000);
	}

	renderSearchResults(resultsMarkup) {
		this.predictiveSearchResults.innerHTML = resultsMarkup;
		this.setAttribute("results", true);

		this.setLiveRegionResults();
		this.open();
		if (this.promoModal && this.classList.contains("search-modal__form")) {
			this.promoModal.classList.add("search__modal--hidden");
			this.header.classList.remove("header--search");
		}
		if (this.promoModalBanner) {
			this.promoModalBanner.classList.add("search__modal--hidden");
		}
		if (this.collectionList) {
			this.collectionList.classList.add("hidden");
		}
	}

	clickSearchTabs() {
		$(".predictive-search").each(function () {			


			$(this).addClass("slider_started");
			let id = $(this).attr("id");

			let prodSwiperParams = {};
			
			if ($(this).data("section") && $(this).data("section") == "banner") {
				prodSwiperParams = {
					loop: false,
					allowTouchMove: true,
					slidesPerView: 1,
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
				};
			}
			else{
				prodSwiperParams = {
					loop: false,
					allowTouchMove: true,
					slidesPerView: 1,
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
					breakpoints: {
						450: {
							slidesPerView: 2,
						},
						750: {
							slidesPerView: 3,
						},
						1100: {
							slidesPerView: 4,
						},
					},
				};
			}

			let initProductCarouselSliders = new Swiper(
				`#${id} .product-carousel-swiper`,
				prodSwiperParams
			);
		});

		const searchBanner = document.querySelector('.search__main-collection')
		if (searchBanner && this.classList.contains("search__main-collection")) {
			const allHidden = Array.from(document.querySelectorAll('.search__main-collection .predictive-search__list-item'))
			.every(el => window.getComputedStyle(el).display === 'none');
			if (allHidden) {
				document.querySelector('.search-banner-no_results').style.display = 'block'
				if (document.querySelector('.search-banner__search .search__main .search__container .product-carousel')) {
					document.querySelector('.search-banner__search .search__main .search__container .product-carousel').style.display = 'none'
				} 
			} else {
				document.querySelector('.search-banner-no_results').style.display = 'none'
				if (document.querySelector('.search-banner__search .search__main .search__container .product-carousel')) {
					document.querySelector('.search-banner__search .search__main .search__container .product-carousel').style.display = 'flex'
				} 
			}
		}
	}

	 changePosition() {
		if (document.querySelector('#search-modal-mobile .predictive-search__result-group')) {
			document.querySelector('#search-modal-mobile .predictive-search__search-for-button-mobile').classList.add("active")
		}
		else{
			document.querySelector('#search-modal-mobile .predictive-search__search-for-button-mobile').classList.remove("active")
		}

		function adjustButtonPosition(height) {
			document.querySelectorAll(`.predictive-search__product .swiper-button`).forEach((button) => {
				button.style.top = height / 2 + 'px';
			});
		}

		if (window.innerWidth < 1100) return;

		const image = document.querySelector(`.predictive-search__product .img_tag`);		

		if (image) {
			if (image.tagName === 'IMG') {
				if (image.complete) {
					adjustButtonPosition(image.offsetHeight);
				} else {
					image.addEventListener('load', function () {
						adjustButtonPosition(this.offsetHeight);
					});
				}
			} else if (image.tagName === 'svg') {
				const height = image.getBoundingClientRect().height;
				adjustButtonPosition(height);
			}
		}
	}

	hidePromoBlock() {
		if (this.classList.contains("search-modal__form")) {
			if (this.promoModal) {
				this.promoModal.classList.add("search__modal--hidden");
				this.header.classList.remove("header--search");
			}
			if (this.promoModalBanner) {
				this.promoModalBanner.classList.add("search__modal--hidden");
				const parentElemnt = this.promoModalBanner.parentNode.parentNode.parentNode
				parentElemnt.classList.remove("active")
			}
			if (this.collectionList) {
				this.collectionList.classList.add("hidden");
			}
		}
	}

	showPromoBlock() {
		if (this.classList.contains("search-modal__form")) {
			if (this.promoModal) {
				this.promoModal.classList.remove("search__modal--hidden");
				this.header.classList.add("header--search");
			}
			if (this.promoModalBanner) {
				this.promoModalBanner.classList.remove("search__modal--hidden");
				const parentElemnt = this.promoModalBanner.parentNode.parentNode.parentNode
				parentElemnt.classList.add("active")
			}
			if (this.collectionList) {
				this.collectionList.classList.remove("hidden");
			}
		}
	}

	setLiveRegionResults() {
		this.removeAttribute("loading");
		this.setLiveRegionText(
			this.querySelector("[data-predictive-search-live-region-count-value]")
				.textContent,
		);
	}

	open() {
		this.setAttribute("open", true);
		this.input.setAttribute("aria-expanded", true);
		this.isOpen = true;
		if (this.promoModal && this.classList.contains("search-modal__form")) {
			this.promoModal.classList.remove("search__modal--hidden");
			this.header.classList.add("header--search");
		}
		if (this.promoModalBanner) {
			this.promoModalBanner.classList.remove("search__modal--hidden");
			const parentElemnt = this.promoModalBanner.parentNode.parentNode.parentNode
			parentElemnt.classList.add("active")
		}
	}

	close(clearSearchTerm = false, closeSearchModal = false) {
		this.closeResults(clearSearchTerm, closeSearchModal);
		this.isOpen = false;
	}

	closeResults(clearSearchTerm = false, closeSearchModal = false) {
		if (clearSearchTerm) {
			this.input.value = "";
			this.removeAttribute("results");
		}
		const selected = this.querySelector('[aria-selected="true"]');

		if (selected) selected.setAttribute("aria-selected", false);

		this.input.setAttribute("aria-activedescendant", "");
		this.removeAttribute("loading");
		this.removeAttribute("open");
		this.input.setAttribute("aria-expanded", false);
		this.predictiveSearchResults.removeAttribute("style");
		if (this.promoModal) {
			if (closeSearchModal) {
				this.promoModal.classList.add("search__modal--hidde");
				setTimeout(() => {
					this.promoModal.classList.add("search__modal--hidden");
				}, 300);

				setTimeout(() => {
					this.promoModal.classList.remove("search__modal--hidde");
				}, 400);
			}
			else {
				this.promoModal.classList.remove("search__modal--hidden");
			}
			if (this.classList.contains("search-modal__form-desktop")) {
				if (closeSearchModal) {
					this.header.classList.remove("header--search");
				}
				else {
					this.header.classList.add("header--search");
				}
			}
		}
		if (this.promoModalBanner) {
			if (closeSearchModal) {
				this.promoModalBanner.classList.add("search__modal--hidden");
			}
			else {
				this.promoModalBanner.classList.remove("search__modal--hidden");
			}
			const parentElemnt = this.promoModalBanner.parentNode.parentNode.parentNode
			parentElemnt.classList.remove("active")
		}
	}
}

customElements.define("predictive-search", PredictiveSearch);
