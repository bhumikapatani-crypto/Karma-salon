(function () {
	const productMarkers = (section) => {
		const parent = document.currentScript
			? document.currentScript.parentElement
			: section;

		let container = parent.querySelector(".product-markers");
		animateHeading(container, true);

		function getHiddenElementHeight(el) {
			const style = el.style.cssText;

			el.style.cssText += `
				position: absolute;
				visibility: hidden;
				display: block;
			`;

			const height = el.offsetHeight;
			el.style.cssText = style;

			return height;
		}

		let setMaxCardHeight = () => {
			setTimeout(() => {
				let cards = parent.querySelectorAll(
					`.product-markers__content > .product-markers__item-inner[data-index]`
				);
				let maxHeight = 0;
				cards.forEach((card) => {
					card.classList.add("measurable");
					let cardHeight = card.clientHeight;
					if (cardHeight > maxHeight) {
						maxHeight = cardHeight;
					}

					card.classList.remove("measurable");
				});

				cards.forEach((card) => {
					card.style.height =
						window.innerWidth < 990 ? `${maxHeight}px` : "auto";
				});
			}, 500);
		};

		if (parent) {
			const events = ["focusin"];
			parent.querySelectorAll(".js-product-markers__item").forEach((item) => {
				events.forEach((event) => {
					let clicked = false;
					item.addEventListener("mousedown", () => (clicked = true));
					item.addEventListener(event, () => {
						if (clicked) item.blur();
						item.classList.toggle("active");
						let index = item?.dataset?.index;
						parent
							.querySelectorAll(
								`.product-markers__item-inner__upper:not([data-index="${index}"])`
							)
							.forEach((item) => {
								item.classList.remove("active");
							});
						parent
							.querySelector(
								`.product-markers__item-inner__upper[data-index="${index}"]`
							)
							.classList.add("active");

						setMaxCardHeight();
					});
				});
			});

			const markers = parent.querySelectorAll(".js-product-markers__item");
			const activateFirstMarker = (markers) => {
				if (
					(Array.from(markers).filter((marker) =>
						marker.classList.contains("active")
					).length == 0 &&
						window.innerWidth < 990) ||
					(window.innerWidth >= 990 &&
						Array.from(markers).filter((marker) =>
							marker.classList.contains("active")
						).length > 1)
				) {
					markers.forEach((marker) => marker.classList.remove("active"));
					markers[0].click();
				}
			};
			events.forEach((event) => {
				document.addEventListener(event, (e) => {
					const parentClicked = e.target.closest(".js-product-markers__item");
					markers.forEach((marker) => {
						if (parentClicked != marker) {
							if (window.innerWidth < 990) return;
							marker.classList.remove("active");
							parent
								.querySelector(
									`.product-markers__item-inner__upper[data-index="${marker?.dataset?.index}"]`
								)
								.classList.remove("active");
						}
					});
					activateFirstMarker(markers);
				});
			});

			if (parent && parent.querySelector(".product-markers__video")) {
				const videoObserver = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							entry.target.play();
						} else {
							entry.target.pause();
						}
					});
				});

				videoObserver.observe(parent.querySelector(".product-markers__video"));
			}

			setMaxCardHeight();
			let resizeTimeout;
			window.addEventListener("resize", () => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(setMaxCardHeight, 1000);
				activateFirstMarker(markers);
			});
		}
	};

	productMarkers();

	document.addEventListener("shopify:section:load", function (section) {
		productMarkers(section.target);
	});
})();
