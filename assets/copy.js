document.addEventListener("DOMContentLoaded", function () {
	function copyURI(event) {
		event.preventDefault();
		navigator.clipboard.writeText(window.location.href);

		const shareButton = event.currentTarget;

		if (shareButton && !shareButton.classList.contains("success")) {
			shareButton.classList.add("success");

			setTimeout(() => {
				shareButton.classList.remove("success");
			}, 2000);
		}
	}

	document.querySelectorAll(".copy-btn").forEach((copyLink) => {
		copyLink.addEventListener("click", copyURI);
	});

	const customRte = () => {
		if (document.querySelector(".custom_rte img + img") !== null) {
			document.querySelectorAll(".custom_rte img + img").forEach((img) => {
				img.parentNode.classList.add("article-template__double-image");
			});

			if (
				document.querySelector(".custom_rte img:first-child:last-child") !==
				null
			) {
				document
					.querySelectorAll(".custom_rte img:first-child:last-child")
					.forEach((img) => {
						let parentWrapper = img.parentNode;
						parentWrapper.classList.add("article-template__single-image");

						if (
							parentWrapper?.nextElementSibling?.classList?.contains(
								"article-template__double-image"
							)
						) {
							parentWrapper.classList.add("smaller-margin");
						}
					});
			}
		}
	};

	const initDropdown = () => {
		const dropdowns = document.querySelectorAll(".dropdown-opener");
		if (!dropdowns) return;

		dropdowns.forEach((dropdown) => {
			dropdown.addEventListener("click", () => {
				dropdown.classList.toggle("active");
			});
		});

		document.addEventListener("click", (event) => {
			if (
				!event.target.closest(".dropdown-opener") &&
				!event.target.closest(".copy-btn")
			) {
				dropdowns.forEach((dropdown) => {
					dropdown.classList.remove("active");
				});
			}
		});
	};

	initDropdown();
	customRte();

	document.addEventListener("shopify:section:load", (e) => {
		initDropdown();
		customRte();
	});
});
