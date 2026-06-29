(function () {
	const galleryTextSlide = () => {
		if (document.documentElement.clientWidth >= 990) {
			$(".gallery-with-text__card.animated")
				.off("mouseenter mouseleave")
				.on("mouseenter", function () {
					let $this = $(this);
					$this.addClass("active");
					$this.siblings(".gallery-with-text__card").removeClass("active");
					setTimeout(() => {
						$this
							.children(".gallery-with-text__info")
							.children(".link--overlay")
							.addClass("active");
						$this
							.siblings(".gallery-with-text__card")
							.children(".gallery-with-text__info")
							.children(".link--overlay")
							.removeClass("active");
					}, 100);
				});
		} else {
			$(".gallery-with-text__card.animated").off("mouseenter mouseleave");
		}
	};

	const initSection = () => {
		const sections = document.querySelectorAll(".gallery-with-text-section");

		const setWidthSlide = () => {
			let widthSlide = "100%";

			sections.forEach((section) => {
				section.querySelectorAll(".gallery-with-text__card").forEach((card) => {
					if (document.documentElement.clientWidth >= 990) {
						if (card.classList.contains("active")) {
							widthSlide = card.getBoundingClientRect().width + "px";
						}
					}
				});

				section.style.setProperty("--width-slide", widthSlide);
			});
		};

		setWidthSlide();
		galleryTextSlide();

		window.addEventListener("resize", () => {
			setWidthSlide();
			galleryTextSlide();
		});
	};

	document.addEventListener("shopify:section:load", function () {
		initSection();
	});

	initSection();
})();
