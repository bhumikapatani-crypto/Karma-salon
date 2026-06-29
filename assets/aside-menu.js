(function () {
	const initAsideMenu = () => {
		const header = document.querySelector(".header-wrapper");
		const asideMenu = document.querySelector(".aside-menu");
		const openAsideMenuBtn = document.querySelector(
			".aside-menu__toggle--open-btn"
		);

		const closeMenuBtn = document.querySelector(
			".aside-menu__toggle--full-close-btn"
		);

		const closeAsideMenuBtn = document.querySelector(
			".aside-menu__toggle--close-btn"
		);
		const asideMenuOverlay = document.querySelector(".aside-menu__overlay");

		const firstLevelItems = document.querySelectorAll(".first_level_details");
		const secondLevelItems = document.querySelectorAll(".second_level_details");
		const firstLevelToggles = document.querySelectorAll(
			".aside-menu__toggle--close-btn"
		);

		if (header) header.preventHide = false;

		const openAsideMenu = (e) => {
			e.preventDefault();
			if (header) header.preventHide = true;
			asideMenu.classList.add("aside-menu--open");
			asideMenuOverlay.classList.add("aside-menu__overlay--active");
			document.body.classList.add("overflow-hidden-aside");
		};

		const closeAsideMenu = (e) => {
			e.preventDefault();
			asideMenu.classList.remove("aside-menu--open");
			asideMenuOverlay.classList.remove("aside-menu__overlay--active");
			document.body.classList.remove("overflow-hidden-aside");

			firstLevelItems.forEach((item) => {
				if (item.classList.contains("active")) {
					item.classList.remove("active");
					item.classList.add("hiding");
					setTimeout(() => item.classList.remove("hiding"), 800);
				}
			});

			secondLevelItems.forEach((item) => {
				if (item.classList.contains("active")) {
					item.classList.remove("active");
					item.classList.add("hiding");
					setTimeout(() => item.classList.remove("hiding"), 800);
				}
			});

			if (header) header.preventHide = false;
		};

		firstLevelItems.forEach((item) => {
			const trigger = item.querySelector(".menu-trigger");
			const submenu = item.querySelector(".submenu");

			trigger.addEventListener("click", () => {
				const isActive = item.classList.contains("active");

				firstLevelItems.forEach((other) => {
					if (other !== item && other.classList.contains("active")) {
						other.classList.remove("active");
						other.classList.add("hiding");
						setTimeout(() => other.classList.remove("hiding"), 800);
					}
				});

				secondLevelItems.forEach((sub) => {
					if (sub.classList.contains("active")) {
						sub.classList.remove("active");
						sub.classList.add("hiding");
						setTimeout(() => sub.classList.remove("hiding"), 800);
					}
				});

				if (!isActive) {
					item.classList.add("active");
				} else {
					item.classList.remove("active");
					item.classList.add("hiding");
					setTimeout(() => item.classList.remove("hiding"), 800);
				}
			});

			trigger.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					trigger.click();
				}
			});

			const subItems = item.querySelectorAll(".second_level_details");
			subItems.forEach((subItem) => {
				const subTrigger = subItem.querySelector(".menu-trigger");

				subTrigger.addEventListener("click", (e) => {
					e.stopPropagation();

					const isSubActive = subItem.classList.contains("active");

					subItems.forEach((otherSub) => {
						if (otherSub !== subItem && otherSub.classList.contains("active")) {
							otherSub.classList.remove("active");
							otherSub.classList.add("hiding");
							setTimeout(() => otherSub.classList.remove("hiding"), 800);
						}
					});

					if (!isSubActive) {
						subItem.classList.add("active");
						item.classList.add("active");
					} else {
						subItem.classList.remove("active");
						subItem.classList.add("hiding");
						setTimeout(() => subItem.classList.remove("hiding"), 800);
					}
				});

				subTrigger.addEventListener("keydown", (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						subTrigger.click();
					}
				});
			});
		});

		firstLevelToggles.forEach((toggleButton) => {
			toggleButton.addEventListener("click", (event) => {
				event.stopPropagation();
				const parentItem = toggleButton.closest(
					".first_level_details, .second_level_details"
				);

				if (parentItem && parentItem.classList.contains("active")) {
					parentItem.classList.remove("active");
					parentItem.classList.add("hiding");
					setTimeout(() => parentItem.classList.remove("hiding"), 800);
				}

				secondLevelItems.forEach((sub) => {
					if (sub.classList.contains("active")) {
						sub.classList.remove("active");
						sub.classList.add("hiding");
						setTimeout(() => sub.classList.remove("hiding"), 800);
					}
				});
			});
		});

		openAsideMenuBtn.addEventListener("click", openAsideMenu);
		closeAsideMenuBtn.addEventListener("click", closeAsideMenu);
		asideMenuOverlay.addEventListener("click", closeAsideMenu);
		closeMenuBtn.addEventListener("click", closeAsideMenu);

		asideMenu.addEventListener("keydown", (e) => {
			if (e.code === "Escape") {
				closeAsideMenu(e);
			}
		});
	};

	document.addEventListener("shopify:section:load", initAsideMenu);
	document.addEventListener("shopify:section:unload", initAsideMenu);
	document.addEventListener("shopify:section:reorder", initAsideMenu);

	initAsideMenu();
})();
