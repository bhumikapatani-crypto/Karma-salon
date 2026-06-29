const pillsSpace = () => {
	if (
		!document.querySelectorAll(
			"#FacetFiltersPillsForm .active-facets__items facet-remove"
		)
	)
		return;
	const items = document.querySelectorAll(
		"#FacetFiltersPillsForm .active-facets__items facet-remove"
	);
	let currentTop = null;
	let firstInEachRow = [];

	items.forEach((item) => {
		const top = item.offsetTop;

		if (top !== currentTop) {
			firstInEachRow.push(item);
			currentTop = top;
			item.querySelector("a").classList.add("first-in-row");
		} else {
			item.querySelector("a").classList.remove("first-in-row");
		}
	});
};

const setGridColumnsFacets = () => {
	const container = document.getElementById("ProductGridContainer");
	if (!container) return;

	const dataInRow = container.dataset.productsInRow;
	const columns = dataInRow === "small" ? 6 : dataInRow === "large" ? 2 : 4;
	const ul = container.querySelector("ul");

	if (!ul) return;

	const specials = [
		...ul.querySelectorAll("li.collection-product-card--special"),
	];

	const setSpecialHeight = () => {
		specials.forEach((special) => {
			special.style.height = "auto";
			special.style.height =
				special.previousElementSibling !== null
					? `${special.previousElementSibling?.scrollHeight}px`
					: `${special.nextsElementSibling?.scrollHeight}px`;
		});
	};

	setSpecialHeight();
	window.addEventListener("resize", () =>
		setTimeout(() => setSpecialHeight(), 500)
	);
};

const updateFacetsWrapper = () => {
	if (document.querySelector(".facets__sort-wrapper") !== null) {
		const facetsWrapper = document.querySelector(".facets__sort-wrapper");
		if (facetsWrapper.querySelector("#ProductCountDesktop") !== null) {
			const countElement = facetsWrapper.querySelector("#ProductCountDesktop");
			const facetsCount = parseInt(countElement.innerText.match(/\d+/));
			const isZero = facetsCount == 0;

			facetsWrapper.style.display = isZero ? "none" : "flex";
		}
	}

	setTimeout(() => pillsSpace(), 500);
};

window.addEventListener("resize", () => {
	setTimeout(() => pillsSpace(), 1000);
});

class FacetFiltersForm extends HTMLElement {
	constructor() {
		super();
		this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

		this.debouncedOnSubmit = debounce((event) => {
			this.onSubmitHandler(event);
		}, 500);

		const facetForm = this.querySelector("form");
		facetForm.addEventListener("input", this.debouncedOnSubmit.bind(this));

		const facetWrapper = this.querySelector("#FacetsWrapperDesktop");
		if (facetWrapper) facetWrapper.addEventListener("keyup", onKeyUpEscape);

		pillsSpace();
	}

	static setListeners() {
		const onHistoryChange = (event) => {
			const searchParams = event.state
				? event.state.searchParams
				: FacetFiltersForm.searchParamsInitial;
			if (searchParams === FacetFiltersForm.searchParamsPrev) return;
			FacetFiltersForm.renderPage(searchParams, null, false);
		};
		window.addEventListener("popstate", onHistoryChange);
	}

	static toggleActiveFacets(disable = true) {
		document.querySelectorAll(".js-facet-remove").forEach((element) => {
			element.classList.toggle("disabled", disable);
		});
	}

	static renderPage(searchParams, event, updateURLHash = true) {
		FacetFiltersForm.searchParamsPrev = searchParams;
		const sections = FacetFiltersForm.getSections();
		const countContainer = document.getElementById("ProductCount");
		const countContainerDesktop = document.getElementById(
			"ProductCountDesktop"
		);
		document
			.getElementById("ProductGridContainer")
			.querySelector(".collection")
			.classList.add("loading");
		if (countContainer) {
			countContainer.classList.add("loading");
		}
		if (countContainerDesktop) {
			countContainerDesktop.classList.add("loading");
		}

		sections.forEach((section) => {
			const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
			const filterDataUrl = (element) => element.url === url;

			FacetFiltersForm.filterData.some(filterDataUrl)
				? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
				: FacetFiltersForm.renderSectionFromFetch(url, event);
		});

		if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
	}

	static renderSectionFromFetch(url, event) {
		fetch(url)
			.then((response) => response.text())
			.then((responseText) => {
				const html = responseText;
				FacetFiltersForm.filterData = [
					...FacetFiltersForm.filterData,
					{ html, url },
				];
				FacetFiltersForm.renderFilters(html, event);
				FacetFiltersForm.renderProductGridContainer(html);
				FacetFiltersForm.renderProductCount(html);
				FacetFiltersForm.renderPaginationStatus();
				setGridColumnsFacets();
			});
	}

	static renderSectionFromCache(filterDataUrl, event) {
		const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
		FacetFiltersForm.renderFilters(html, event);
		FacetFiltersForm.renderProductGridContainer(html);
		FacetFiltersForm.renderProductCount(html);
		FacetFiltersForm.renderPaginationStatus();
	}

	static updateImageFilterColumns() {
		const facetsList = document.querySelector(".facets__list");
		if (!facetsList) return;

		const styleAttr = facetsList.getAttribute("style");
		const match = styleAttr?.match(/--image_filter_columns:\s*(.+?);/);
		const columnValue = match?.[1]?.trim();

		if (columnValue) {
			facetsList.style.setProperty("--image_filter_columns", columnValue);
			console.log("Updated grid columns to:", columnValue);
		}
	}

	static renderProductGridContainer(html) {
		document.getElementById("ProductGridContainer").innerHTML = new DOMParser()
			.parseFromString(html, "text/html")
			.getElementById("ProductGridContainer").innerHTML;

		FacetFiltersForm.updateImageFilterColumns();

		if (
			document.querySelector(".js-load-more") ||
			document.querySelector(".js-infinite-scroll")
		) {
			loadMore();
		}

		colorSwatches();
	}

	static renderProductCount(html) {
		const count =
			new DOMParser()
				.parseFromString(html, "text/html")
				.getElementById("ProductCount")?.innerHTML || "0 results";
		const container = document.getElementById("ProductCount");
		const containerDesktop = document.getElementById("ProductCountDesktop");
		const containerMobile = document.querySelector(".mobile-facets__count");
		container.innerHTML = count;
		container.classList.remove("loading");
		if (containerDesktop) {
			containerDesktop.innerHTML = count;
			containerDesktop.classList.remove("loading");

			updateFacetsWrapper();
		}
		if (containerMobile) {
			containerMobile.innerHTML = count;
		}
	}

	static renderPaginationStatus() {
		const productsCount = parseInt(
			document.getElementById("ProductCountDesktop").innerHTML
		);
		const productsPerPage = parseInt(
			document.getElementById("product-grid").dataset.itemsPerPage
		);

		const totalPages = Math.ceil(productsCount / productsPerPage);
		const urlParams = new URLSearchParams(window.location.search);
		const currentPage = parseInt(urlParams.get("page")) || 1;

		const container = document.getElementById("FacetPaginationStatus");
		const currentPageElement = container.querySelector(".current-page");
		const totalPagesElement = container.querySelector(".total-pages");

		currentPageElement.textContent = currentPage;
		totalPagesElement.textContent = totalPages;
		container.classList.remove("loading");
	}

	static renderFilters(html, event) {
		const parsedHTML = new DOMParser().parseFromString(html, "text/html");

		const facetDetailsElements = parsedHTML.querySelectorAll(
			"#FacetFiltersForm .js-filter, #FacetFiltersPillsForm .js-filter, #FacetFiltersForm1 .js-filter"
		);
		const matchesIndex = (element) => {
			const jsFilter = event ? event.target.closest(".js-filter") : undefined;
			return jsFilter
				? element.dataset.index === jsFilter.dataset.index
				: false;
		};
		const facetsToRender = Array.from(facetDetailsElements).filter(
			(element) => !matchesIndex(element)
		);
		const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

		facetsToRender.forEach((element) => {
			document.querySelector(
				`.js-filter[data-index="${element.dataset.index}"]`
			).innerHTML = element.innerHTML;
		});

		FacetFiltersForm.renderActiveFacets(parsedHTML);
		FacetFiltersForm.renderAdditionalElements(parsedHTML);

		if (countsToRender)
			FacetFiltersForm.renderCounts(
				countsToRender,
				event.target.closest(".js-filter")
			);
	}

	static renderActiveFacets(html) {
		const activeFacetElementSelectors = [
			".active-facets-mobile",
			".active-facets-desktop",
		];

		activeFacetElementSelectors.forEach((selector) => {
			const activeFacetsElement = html.querySelector(selector);
			if (!activeFacetsElement) return;
			document.querySelector(selector).innerHTML =
				activeFacetsElement.innerHTML;
		});

		FacetFiltersForm.toggleActiveFacets(false);
	}

	static renderAdditionalElements(html) {
		const mobileElementSelectors = [
			".mobile-facets__open",
			".mobile-facets__count",
			".sorting",
		];

		mobileElementSelectors.forEach((selector) => {
			if (!html.querySelector(selector)) return;
			document.querySelector(selector).innerHTML =
				html.querySelector(selector).innerHTML;
		});
	}

	static renderCounts(source, target) {
		const targetElement = target.querySelector(".facets__selected");
		const sourceElement = source.querySelector(".facets__selected");

		const targetElementAccessibility = target.querySelector(".facets__summary");
		const sourceElementAccessibility = source.querySelector(".facets__summary");

		if (sourceElement && targetElement) {
			target.querySelector(".facets__selected").outerHTML =
				source.querySelector(".facets__selected").outerHTML;
		}

		if (targetElementAccessibility && sourceElementAccessibility) {
			target.querySelector(".facets__summary").outerHTML =
				source.querySelector(".facets__summary").outerHTML;
		}
	}

	static updateURLHash(searchParams) {
		history.pushState(
			{ searchParams },
			"",
			`${window.location.pathname}${searchParams && "?".concat(searchParams)}`
		);
	}

	static getSections() {
		return [
			{
				section: document.getElementById("product-grid").dataset.id,
			},
		];
	}

	createSearchParams(form) {
		const formData = new FormData(form);
		return new URLSearchParams(formData).toString();
	}

	onSubmitForm(searchParams, event) {
		FacetFiltersForm.renderPage(searchParams, event);
	}

	onSubmitHandler(event) {
		event.preventDefault();
		const sortFilterForms = document.querySelectorAll(
			"facet-filters-form form"
		);
		if (event.srcElement.className == "mobile-facets__checkbox") {
			const searchParams = this.createSearchParams(
				event.target.closest("form")
			);
			this.onSubmitForm(searchParams, event);
		} else {
			const forms = [];
			const isMobile =
				event.target.closest("form").id === "FacetFiltersFormMobile";

			sortFilterForms.forEach((form) => {
				if (!isMobile) {
					if (
						form.id === "FacetSortForm" ||
						form.id === "FacetFiltersForm" ||
						form.id === "FacetSortDrawerForm"
					) {
						const noJsElements = document.querySelectorAll(".no-js-list");
						noJsElements.forEach((el) => el.remove());
						forms.push(this.createSearchParams(form));
					}
				} else if (form.id === "FacetFiltersFormMobile") {
					forms.push(this.createSearchParams(form));
				}
			});
			this.onSubmitForm(forms.join("&"), event);
		}

		updateFacetsWrapper();
	}

	onActiveFilterClick(event) {
		event.preventDefault();
		FacetFiltersForm.toggleActiveFacets();
		const url =
			event.currentTarget.href.indexOf("?") == -1
				? ""
				: event.currentTarget.href.slice(
						event.currentTarget.href.indexOf("?") + 1
				  );
		FacetFiltersForm.renderPage(url);
	}
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define("facet-filters-form", FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
	constructor() {
		super();
		this.querySelectorAll("input").forEach((element) =>
			element.addEventListener("change", this.onRangeChange.bind(this))
		);
		this.setMinAndMaxValues();
		this.controlSlider();
		this.controlInput();
	}

	onRangeChange(event) {
		this.adjustToValidValues(event.currentTarget);
		this.setMinAndMaxValues();
	}

	setMinAndMaxValues() {
		const inputs = this.querySelectorAll("input");
		const minInput = inputs[0];
		const maxInput = inputs[1];
		if (maxInput.value) minInput.setAttribute("max", maxInput.value);
		if (minInput.value) maxInput.setAttribute("min", minInput.value);
		if (minInput.value === "") maxInput.setAttribute("min", 0);
		if (maxInput.value === "")
			minInput.setAttribute("max", maxInput.getAttribute("max"));
	}

	adjustToValidValues(input) {
		const value = Number(input.value);
		const min = Number(input.getAttribute("min"));
		const max = Number(input.getAttribute("max"));

		if (value < min) input.value = min;
		if (value > max) input.value = max;
	}

	fillSlider() {
		const inputRangeWrappers = document.querySelectorAll(
			".facets__price .facets__range"
		);
		inputRangeWrappers.forEach((inputWrapper) => {
			const inputsRange = inputWrapper.querySelectorAll(".field__range");
			const inputRangeFrom = inputsRange[0];
			const inputRangeTo = inputsRange[1];

			const range = parseFloat(inputRangeTo.max) - parseFloat(inputRangeTo.min);
			const fromCurrent = inputRangeFrom.value - inputRangeTo.min;
			const toCurrent = inputRangeTo.value - inputRangeTo.min;
			const minRange = (fromCurrent / range) * 100;
			const maxRange = (toCurrent / range) * 100;

			inputWrapper.setAttribute(
				"style",
				`--range-min: ${minRange}%; --range-max: ${maxRange}%`
			);

			if (
				document.getElementById("min_range") !== null &&
				document.getElementById("max_range") !== null
			) {
				document.getElementById("min_range").innerHTML = fromCurrent;
				document.getElementById("max_range").innerHTML = toCurrent;
			}

			if (
				document.getElementById("min_range1") !== null &&
				document.getElementById("max_range1") !== null
			) {
				document.getElementById("min_range1").innerHTML = fromCurrent;
				document.getElementById("max_range1").innerHTML = toCurrent;
			}

			if (
				document.getElementById("min_range2") !== null &&
				document.getElementById("max_range2") !== null
			) {
				document.getElementById("min_range2").innerHTML = fromCurrent;
				document.getElementById("max_range2").innerHTML = toCurrent;
			}
		});
	}

	controlSlider() {
		const inputRangeWrappers = document.querySelectorAll(
			".facets__price .facets__range"
		);
		const inputNumberWrappers = document.querySelectorAll(
			".facets__price .facets__price-wrapper"
		);

		inputRangeWrappers.forEach((inputWrapper, index) => {
			const inputsRange = inputWrapper.querySelectorAll(".field__range");
			const inputRangeFrom = inputsRange[0];
			const inputRangeTo = inputsRange[1];
			const inputNumberFrom =
				inputNumberWrappers[index].querySelectorAll(".field__input")[0];
			const inputNumberTo =
				inputNumberWrappers[index].querySelectorAll(".field__input")[1];

			inputRangeFrom.oninput = () => {
				const from = parseInt(inputRangeFrom.value, 10);
				const to = parseInt(inputRangeTo.value, 10);

				if (from > to) {
					inputRangeFrom.value = to;
					inputNumberFrom.value = to;
				} else {
					inputNumberFrom.value = from;
				}

				this.fillSlider();
			};

			if (Number(inputRangeTo.value) <= 0) {
				inputRangeTo.style.zIndex = 2;
			} else {
				inputRangeTo.style.zIndex = 0;
			}

			inputRangeTo.oninput = () => {
				const from = parseInt(inputRangeFrom.value, 10);
				const to = parseInt(inputRangeTo.value, 10);
				if (from <= to) {
					inputRangeTo.value = to;
					inputNumberTo.value = to;
				} else {
					inputNumberTo.value = from;
					inputRangeTo.value = from;
				}

				if (Number(inputRangeTo.value) <= 0) {
					inputRangeTo.style.zIndex = 2;
				} else {
					inputRangeTo.style.zIndex = 0;
				}

				this.fillSlider();
			};
		});
	}

	controlInput() {
		const inputRangeWrappers = document.querySelectorAll(
			".facets__price .facets__range"
		);
		const inputNumberWrappers = document.querySelectorAll(
			".facets__price .facets__price-wrapper"
		);

		inputNumberWrappers.forEach((inputWrapper, index) => {
			const inputsNumber = inputWrapper.querySelectorAll(".field__input");
			const inputNumberFrom = inputsNumber[0];
			const inputNumberTo = inputsNumber[1];
			const inputRangeFrom =
				inputRangeWrappers[index].querySelectorAll(".field__range")[0];
			const inputRangeTo =
				inputRangeWrappers[index].querySelectorAll(".field__range")[1];

			inputNumberFrom.onchange = () => {
				const from = parseInt(inputNumberFrom.value, 10);
				const to = parseInt(inputNumberTo.value, 10);
				if (from > to) {
					inputRangeFrom.value = to;
					inputNumberFrom.value = to;
				} else {
					inputRangeFrom.value = from;
				}

				this.fillSlider();
			};

			inputNumberTo.onchange = () => {
				const from = parseInt(inputNumberFrom.value, 10);
				const to = parseInt(inputNumberTo.value, 10);

				if (from <= to) {
					inputRangeTo.value = to;
					inputNumberTo.value = to;
				} else {
					inputNumberTo.value = from;
				}

				this.fillSlider();
			};
		});
	}
}

customElements.define("price-range", PriceRange);

class FacetRemove extends HTMLElement {
	constructor() {
		super();
		const facetLink = this.querySelector("a");
		facetLink.setAttribute("role", "button");
		facetLink.addEventListener("click", this.closeFilter.bind(this));
		facetLink.addEventListener("keyup", (event) => {
			event.preventDefault();
			if (event.code.toUpperCase() === "SPACE") this.closeFilter(event);
		});
	}

	closeFilter(event) {
		event.preventDefault();
		const form =
			this.closest("facet-filters-form") ||
			document.querySelector("facet-filters-form");
		form.onActiveFilterClick(event);
	}
}

customElements.define("facet-remove", FacetRemove);

if (Shopify.designMode) {
	document.addEventListener("shopify:section:load", () => {
		FacetFiltersForm.updateImageFilterColumns();
	});

	document.addEventListener("shopify:section:select", () => {
		FacetFiltersForm.updateImageFilterColumns();
	});

	document.addEventListener("shopify:block:select", () => {
		FacetFiltersForm.updateImageFilterColumns();
	});
}

document.addEventListener("DOMContentLoaded", function () {
	const form = document.querySelector("form#FacetFiltersForm");
	const outside_tags = document.querySelector(".facets_tags");

	if (!form || !outside_tags) return;

	form.addEventListener("input", () => {
		const checked = form.querySelectorAll(
			'input[type="checkbox"]:checked, input[type="radio"]:checked'
		);
		outside_tags.style.display = checked.length > 0 ? "inline-flex" : "none";
	});

	const badge1 = document.getElementById("FacetFilterCount");

	function cleanProductCount() {
		const el = document.querySelector("#ProductCountDesktop");
		if (!el) return;

		const raw = el.dataset.rawCount || el.innerText;
		const digits = raw.match(/\d+/);
		if (digits) {
			el.textContent = digits[0];

			updateFacetsWrapper();
		}
	}

	window.addEventListener("scroll", () => {
		const popup = document?.querySelector(".product-popup.filters-popup");
		if (popup.getBoundingClientRect().top == 0) {
			popup?.classList?.add("scrolled");
		} else {
			popup?.classList?.remove("scrolled");
		}
	});

	if (badge1) {
		const form1 = document.querySelector("#FacetFiltersPillsForm");

		if (!form1) return;

		const updateFacetRemoveCount = () => {
			const removeItems = form1.querySelectorAll("facet-remove");

			const badge1 = document.getElementById("FacetFilterCount");
			if (badge1) {
				badge1.textContent =
					removeItems.length > 0 ? `(${removeItems.length})` : "";
			}

			pillsSpace();
		};

		const observer = new MutationObserver((mutationsList, observer) => {
			updateFacetRemoveCount();
			cleanProductCount();
			updateFacetsWrapper();
			pillsSpace();
		});

		observer.observe(form1, {
			childList: true,
			subtree: true,
		});

		updateFacetRemoveCount();
		cleanProductCount();
		updateFacetsWrapper();
	}
});
