(function () {
	const getDistanceToNext = (element, nextElement) => {
		if (element && nextElement) {
			return (
				nextElement.getBoundingClientRect().left -
				element.getBoundingClientRect().right
			);
		}
	};

	const getDistanceToPrev = (element, prevElement) => {
		if (element && prevElement) {
			return (
				prevElement.getBoundingClientRect().right -
				element.getBoundingClientRect().left
			);
		}
	};

	const footer = () => {};

	document.addEventListener("shopify:section:load", footer);
	footer();
})();
