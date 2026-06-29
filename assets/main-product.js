(function () {
	const initProductAccordion = () => {
		const aboutToggleItems = $(".about__accordion-toggle");

		aboutToggleItems.each(function () {
			const currentToggle = $(this);
			const siblingToggles = currentToggle.siblings(
				".about__accordion-description"
			);

			currentToggle.click(function () {
				if (!currentToggle.hasClass("active")) {
					aboutToggleItems.each(function () {
						const siblingToggle = $(this);
						siblingToggle.removeClass("active");
						siblingToggle
							.siblings(".about__accordion-description")
							.stop()
							.slideUp(300);
					});

					currentToggle.addClass("active");

					siblingToggles.stop().slideDown(300);
				} else {
					currentToggle.removeClass("active");
					siblingToggles.stop().slideUp(300);
				}
			});
		});
	};

	const initZoomImage = () => {
		const imagesWrapper = document.querySelector(
			".product-media-modal__content"
		);
		const images = imagesWrapper?.querySelectorAll(".js-image-zoom") || [];

		images.forEach((el) => {
			el.addEventListener("click", (e) => {
				imagesWrapper.classList.toggle("zoom");
			});
		});
	};

	const formatFreeShippingAmount = (value) => {
		const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
		const formatString = theme.moneyFormat;

		return formatString.replace(placeholderRegex, value);
	};

	const setTotalFreeShipping = () => {
		if (document.querySelector(".js-free-shipping")) {
			const freeShippingTotal = document.querySelector(".free-shipping-total");
			if (freeShippingTotal) {
				const minSpend = Number(freeShippingTotal.dataset.minSpend);
				if (minSpend && minSpend > 0) {
					freeShippingTotal.innerText = `${formatFreeShippingAmount(
						Math.round(minSpend * (Shopify.currency.rate || 1))
					)}`;
				}
			}
		}
	};

	const revealPopup = () => {
		const stickyBar = document.querySelector(".floated_form");
		const secondSection = document.querySelector(".product-section + section");
		const footer = document.querySelector("footer");

		const button = document.querySelector(".floated_form-button");
		if (button) {
			button.addEventListener("click", function () {
				window.scrollTo({ top: 0, behavior: "smooth" });
			});
		}

		if (!stickyBar || !secondSection || !footer) {
			return;
		}

		const getOffset = (element) => {
			const rect = element.getBoundingClientRect();
			return rect.top + window.scrollY;
		};

		const secondSectionMid = getOffset(secondSection);
		const footerTop = getOffset(footer);

		const handleScroll = () => {
			const scrollPosition = window.scrollY + window.innerHeight;
			const activeOffset =
				window.scrollY > secondSectionMid && scrollPosition < footerTop;

			stickyBar.classList[activeOffset ? "add" : "remove"]("active");
		};

		handleScroll();
	};

	document.addEventListener("scroll", () => revealPopup());

	document.addEventListener("shopify:section:load", function () {
		initProductAccordion();
		setTotalFreeShipping();
		revealPopup();
	});

	initProductAccordion();
	setTotalFreeShipping();
	revealPopup();
})();
