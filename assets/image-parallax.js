(function () {
	const parallaxImage = () => {
		jarallax(document.querySelectorAll(".jarallax"));
	};

	document.addEventListener("DOMContentLoaded", function () {
		parallaxImage();
		document.addEventListener("shopify:section:load", function () {
			parallaxImage();
		});
	});
})();
