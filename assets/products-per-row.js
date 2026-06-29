(function () {
	const LOCAL_KEY = "shopify-grid-layout";

	const setGridColumns = () => {
		const container = document.getElementById("ProductGridContainer");
		if (!container) return;

		const dataInRow = container.dataset.productsInRow;
		const columns = dataInRow === "small" ? 6 : dataInRow === "large" ? 2 : 4;
		const ul = container.querySelector("ul");

		if (!ul) return;

		const specials = [
			...ul.querySelectorAll("li.collection-product-card--special"),
		];

		const setSpecialHeight = () => {
			specials.forEach((special) => {
				special.style.height = "auto";
				special.style.height =
					special.previousElementSibling !== null
						? `${special.previousElementSibling?.scrollHeight}px`
						: `${special.nextsElementSibling?.scrollHeight}px`;
			});
		};

		setSpecialHeight();
		window.addEventListener("resize", () =>
			setTimeout(() => setSpecialHeight(), 500)
		);
	};

	const applySavedLayout = () => {
		const savedLayout = localStorage.getItem(LOCAL_KEY);
		if (savedLayout) {
			$("[data-products-in-row]").attr("data-products-in-row", savedLayout);
			$(".per-row__button").removeClass("active");
			$(`.per-row__button[data-per-row="${savedLayout}"]`).addClass("active");
		}
	};

	const handleButtons = () => {
		$(".per-row__button").on("click", function () {
			const layout = $(this).data("per-row");
			localStorage.setItem(LOCAL_KEY, layout);
			$("[data-products-in-row]").attr("data-products-in-row", layout);
			$(".per-row__button").removeClass("active");
			$(this).addClass("active");
			setGridColumns();
		});
	};

	const checkScreen = () => {
		if ($(window).width() < 1360) {
			if ($(".per-row__button_1").hasClass("active")) {
				$(".per-row__button_1").removeClass("active");
				$(".per-row__button_2").addClass("active");

				const layout = $(".per-row__button_2").data("per-row");
				localStorage.setItem(LOCAL_KEY, layout);
				$("[data-products-in-row]").attr("data-products-in-row", layout);
				setGridColumns();
			}
		}
	};

	document.addEventListener("shopify:section:load", function () {
		applySavedLayout();
		handleButtons();
		setGridColumns();
	});

	applySavedLayout();
	handleButtons();
	setGridColumns();
	checkScreen();

	$(window).on("resize", checkScreen);
})();
