(function () {
	const calcButtonDistance = (section) => {
		section
			.querySelectorAll(
				".media-banner__container:not(.media-banner__container--bottom)"
			)
			.forEach((imageBannerContainer) => {
				let button = imageBannerContainer?.querySelector(
					".media-banner__button"
				);

				if (button !== null) {
					let buttonHeight = button?.offsetHeight;

					imageBannerContainer.setAttribute(
						"style",
						`--button-height: ${buttonHeight}px`
					);
				}
			});
	};
	const initSection = (section) => {
		let imageBanner = section?.querySelector(".media-banner");
		animateHeading(imageBanner);
		calcButtonDistance(section);

		window.addEventListener("resize", () => calcButtonDistance(section));
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	});
})();
