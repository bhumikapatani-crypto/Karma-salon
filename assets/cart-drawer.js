class CartDrawer extends HTMLElement {
	constructor() {
		super();

		this.sectionHeader = document.querySelector(".shopify-section-header");
		this.header = document.querySelector(".header-wrapper");
		this.headerOverlay = document.querySelector(".header--has-overlay");

		if (this.header) this.header.preventHide = false;

		this.addEventListener(
			"keyup",
			(evt) => evt.code === "Escape" && this.close()
		);
		this.querySelector("#CartDrawer-Overlay").addEventListener(
			"click",
			this.close.bind(this)
		);
		this.setHeaderCartIconAccessibility();

		const headerAccount = document.querySelector(".header__account");
		if (headerAccount) {
			headerAccount.addEventListener("click", () => {
				if (this.classList.contains("active")) {
					this.close();
				}
			});
		}

		const localization = document.querySelectorAll(".header__localization");
		localization.forEach((localization) => {
			localization.addEventListener("click", () => {
				if (
					localization.querySelector("button[aria-expanded=true]") &&
					this.classList.contains("active")
				) {
					this.close();
				}
			});
		});
	}

	setHeaderCartIconAccessibility() {
		const cartLink = document.querySelector("#cart-icon-bubble");
		cartLink.setAttribute("role", "button");
		cartLink.setAttribute("aria-haspopup", "dialog");
		cartLink.addEventListener("click", (event) => {
			event.preventDefault();
			if (!this.classList.contains("active")) this.open(cartLink);
			else this.close();
		});
		cartLink.addEventListener("keydown", (event) => {
			if (event.code.toUpperCase() === "SPACE") {
				event.preventDefault();
				if (!this.classList.contains("active")) this.open(cartLink);
				else this.close();
			}
		});
	}

	open(triggeredBy) {
		if (this.header) this.header.preventHide = true;
		if (triggeredBy) this.setActiveElement(triggeredBy);
		const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
		const cartDrawerNoteText = document.getElementById("CartDrawer-Note");
		const CartDrawerNoteEdit = document.getElementById("CartDrawer-Note-Edit");

		if (cartDrawerNote && !cartDrawerNote.hasAttribute("role"))
			this.setSummaryAccessibility(cartDrawerNote);
		setTimeout(() => {
			this.classList.add("animate", "active");

			const closeButton = document.querySelector(".cart__note-close-button");
			if (closeButton) {
				closeButton.addEventListener("click", function () {
					if (CartDrawerNoteEdit) {
						if (cartDrawerNoteText.value.trim() !== "") {
							CartDrawerNoteEdit.classList.add("show");
						} else {
							CartDrawerNoteEdit.classList.remove("show");
						}
					}
					document.getElementById("Details-CartDrawer").removeAttribute("open");
				});
			}
		});

		this.addEventListener(
			"transitionend",
			() => {
				const containerToTrapFocusOn = this.classList.contains("is-empty")
					? this.querySelector(".drawer__inner-empty")
					: document.getElementById("CartDrawer");
				const focusElement =
					this.querySelector(".drawer__inner") ||
					this.querySelector(".drawer__close");
				trapFocus(containerToTrapFocusOn, focusElement);
			},
			{ once: true }
		);

		document.body.classList.add("overflow-hidden-drawer");
		this.headerOverlay?.classList.remove("color-background-overlay");
		this.headerOverlay?.classList.add("color-background-overlay-hidden");
		this.sectionHeader.classList.remove("shopify-section-header-hidden");
	}

	close() {
		this.classList.remove("active");
		removeTrapFocus(this.activeElement);
		document.body.classList.remove("overflow-hidden-drawer");
		if (this.header) this.header.preventHide = false;

		this.headerOverlay?.classList.add("color-background-overlay");
		this.headerOverlay?.classList.remove("color-background-overlay-hidden");
	}

	setSummaryAccessibility(cartDrawerNote) {
		cartDrawerNote.setAttribute("role", "button");
		cartDrawerNote.setAttribute("aria-expanded", "false");

		if (cartDrawerNote.nextElementSibling.getAttribute("id")) {
			cartDrawerNote.setAttribute(
				"aria-controls",
				cartDrawerNote.nextElementSibling.id
			);
		}

		cartDrawerNote.addEventListener("click", (event) => {
			event.currentTarget.setAttribute(
				"aria-expanded",
				!event.currentTarget.closest("details").hasAttribute("open")
			);
		});

		cartDrawerNote.parentElement.addEventListener("keyup", onKeyUpEscape);
	}

	renderContents(parsedState) {
		this.querySelector(".drawer__inner").classList.contains("is-empty") &&
			this.querySelector(".drawer__inner").classList.remove("is-empty");
		this.productId = parsedState.id;
		this.getSectionsToRender().forEach((section) => {
			const sectionElement = section.selector
				? document.querySelector(section.selector)
				: document.getElementById(section.id);
			sectionElement.innerHTML = this.getSectionInnerHTML(
				parsedState.sections[section.id],
				section.selector
			);
		});

		setTimeout(() => {
			this.querySelector("#CartDrawer-Overlay").addEventListener(
				"click",
				this.close.bind(this)
			);
			this.open();
		});
	}

	getSectionInnerHTML(html, selector = ".shopify-section") {
		return new DOMParser()
			.parseFromString(html, "text/html")
			.querySelector(selector).innerHTML;
	}

	getSectionsToRender() {
		return [
			{
				id: "cart-drawer",
				selector: "#CartDrawer",
			},
			{
				id: "cart-icon-bubble",
			},
		];
	}

	getSectionDOM(html, selector = ".shopify-section") {
		return new DOMParser()
			.parseFromString(html, "text/html")
			.querySelector(selector);
	}

	setActiveElement(element) {
		this.activeElement = element;
	}
}

customElements.define("cart-drawer", CartDrawer);

class CartDrawerItems extends CartItems {
	getSectionsToRender() {
		return [
			{
				id: "CartDrawer",
				section: "cart-drawer",
				selector: ".drawer__inner",
			},
			{
				id: "cart-icon-bubble",
				section: "cart-icon-bubble",
				selector: ".shopify-section",
			},
		];
	}
}

customElements.define("cart-drawer-items", CartDrawerItems);
