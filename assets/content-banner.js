(function () {
	function initAnimatedText(section) {
		if (!section || !section.querySelector(".text-pin-section")) return;

		section.querySelector(".content-banner").classList.add("scroll-container");

		const textEl = section?.querySelector(".animated-text");
		if (!textEl) return;

		const text = textEl.textContent;
		textEl.textContent = "";

		function charsToSpan() {
			text.split(" ").forEach((char) => {
				const span = document.createElement("span");
				span.classList.add("letter");
				if (char === " ") {
					span.classList.add("letter-space");
					span.innerHTML = "&nbsp;";
				} else {
					span.innerHTML = char + "&nbsp;";
				}
				textEl.appendChild(span);
			});
		}
		charsToSpan();

		const letters = section.querySelectorAll(".letter");
		const words = text.trim().split(/\s+/).length;
		const pixelsPerWord = 20;
		const scrollHeight = words * pixelsPerWord;

		section.querySelector(
			".content-banner"
		).style.height = `calc(100vh + ${scrollHeight}px)`;

		function handleScroll() {
			const containerTop = section.offsetTop;
			const scrollTop = window.scrollY;
			const scrollOffset = scrollTop - containerTop;

			const progress = Math.min(
				Math.max((scrollOffset / scrollHeight) * 2, 0),
				1
			);
			const visibleLetters = Math.floor(progress * letters.length);

			requestAnimationFrame(() => {
				letters.forEach((letter, i) => {
					letter.style.opacity = i < visibleLetters ? "1" : "0.2";
				});
			});
		}

		window.addEventListener("scroll", handleScroll);
	}

	initAnimatedText(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", (event) => {
		initAnimatedText(event.detail.section);
	});
})();
