const SCROLL_ANIMATION_TRIGGER_CLASSNAME = "scroll-trigger";
const SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = "scroll-trigger--offscreen";
const SCROLL_ANIMATION_CANCEL_CLASSNAME = "scroll-trigger--cancel";
const VISIBLE_CLASS = "scroll-trigger--visible";

let calculateOrders = () => {
	let sectionsWithAnimatedBlocks = Array.from(
		document.querySelectorAll("section")
	).filter(
		(section) =>
			section.querySelector(
				`.${SCROLL_ANIMATION_TRIGGER_CLASSNAME}[data-cascade]`
			) !== null
	);

	sectionsWithAnimatedBlocks.forEach((section) => {
		section
			.querySelectorAll(`.${SCROLL_ANIMATION_TRIGGER_CLASSNAME}[data-cascade]`)
			.forEach((element, index) => {
				if (element?.closest(".swiper") !== null) {
					let closestSwiper = element?.closest(".swiper");

					setTimeout(() => {
						let swiperInstance = closestSwiper?.swiper;
						swiperInstance?.on("slideChangeTransitionStart", () => {
							closestSwiper
								.querySelectorAll(`.${SCROLL_ANIMATION_TRIGGER_CLASSNAME}`)
								.forEach((item) =>
									item.classList.remove(SCROLL_ANIMATION_TRIGGER_CLASSNAME)
								);
							return;
						});
					}, 1000);
				}

				if (!element.classList.contains("collection-tab-product-card")) {
					setTimeout(
						() => element.setAttribute("style", `--animation-order: ${index};`),
						0
					);
				}
			});
	});
};

function onIntersection(elements, observer) {
	elements.forEach((element) => {
		const elementTarget = element.target;

		if (element.isIntersecting) {
			elementTarget.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
			elementTarget.classList.add(VISIBLE_CLASS);
			observer.unobserve(elementTarget);
		} else {
			elementTarget.classList.add(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
			elementTarget.classList.remove(VISIBLE_CLASS);
			elementTarget.classList.remove(SCROLL_ANIMATION_CANCEL_CLASSNAME);
		}
	});
}

function initializeScrollAnimationTrigger(
	rootEl = document,
	isDesignModeEvent = false
) {
	const animationTriggerElements = Array.from(
		rootEl.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME)
	);
	if (animationTriggerElements.length === 0) return;

	calculateOrders();

	if (isDesignModeEvent) {
		animationTriggerElements.forEach((element) => {
			element.classList.add("scroll-trigger--design-mode");
		});
		return;
	}

	const observer = new IntersectionObserver(onIntersection, {
		rootMargin: "0px 0px -20px 0px",
	});

	animationTriggerElements.forEach((element) => observer.observe(element));
}

window.addEventListener("DOMContentLoaded", () =>
	initializeScrollAnimationTrigger()
);

document.addEventListener("shopify:section:load", (event) =>
	initializeScrollAnimationTrigger(event.target, Shopify.designMode)
);

if (Shopify.designMode) {
	document.addEventListener("shopify:section:reorder", () =>
		initializeScrollAnimationTrigger(document, true)
	);
}
