(function () {
	const initSection = (section) => {
		let bannerGrid = section?.querySelector(".banner-grid");
		animateHeading(bannerGrid);
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	});
})();
