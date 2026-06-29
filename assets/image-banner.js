(function () {
	const calcButtonDistance = (section) => {
		section
			.querySelectorAll(
				".image-banner__container:not(.image-banner__container--bottom)"
			)
			.forEach((imageBannerContainer) => {
				let button = imageBannerContainer?.querySelector(
					".image-banner__button"
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
		let imageBanner = section?.querySelector(".image-banner");
		animateHeading(imageBanner);
		calcButtonDistance(section);

		window.addEventListener("resize", () => calcButtonDistance(section));
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	});
})();
