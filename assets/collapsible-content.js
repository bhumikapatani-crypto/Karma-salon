(function () {
	const initCollapsibleContent = (section) => {};

	document.addEventListener("DOMContentLoaded", function () {
		initCollapsibleContent(document?.currentScript?.parentElement);
		document.addEventListener("shopify:section:load", function (section) {
			initCollapsibleContent(section?.target);
		});
	});
})();
