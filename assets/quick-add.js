if (!customElements.get("quick-add-modal")) {
	customElements.define(
		"quick-add-modal",
		class QuickAddModal extends ModalDialog {
			constructor() {
				super();
				this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');

				this.addEventListener("keyup", (event) => {
					if (event.code.toUpperCase() === "ESCAPE") this.hide();
				});

				this.querySelector(".quick-add-modal__overlay")?.addEventListener(
					"click",
					this.hide.bind(this, false)
				);
			}

			hide(preventFocus = false) {
				const cartDrawer = document.querySelector("cart-drawer");
				if (cartDrawer) cartDrawer.setActiveElement(this.openedBy);
				this.modalContent.innerHTML = "";

				$(".js-media-list").each(function () {
					this.swiper?.destroy();
				});
				$(".js-media-sublist").each(function () {
					this.swiper?.destroy();
				});

				if (preventFocus) this.openedBy = null;

				this.classList.remove("active");
				super.hide();

				document.body.classList.remove("overflow-hidden-modal");
			}

			show(opener) {
				opener.setAttribute("aria-disabled", true);
				opener.classList.add("loading");

				if (opener.querySelector(".loading-overlay__spinner")) {
					opener
						.querySelector(".loading-overlay__spinner")
						.classList.remove("hidden");
				}

				fetch(opener.getAttribute("data-product-url"))
					.then((response) => response.text())
					.then((responseText) => {
						const responseHTML = new DOMParser().parseFromString(
							responseText,
							"text/html"
						);
						this.productElement = responseHTML.querySelector(
							'section[id^="MainProduct-"]'
						);
						this.preventDuplicatedIDs();
						this.removeDOMElements();
						this.setInnerHTML(
							this.modalContent,
							this.productElement.innerHTML,
							opener
						);

						if (window.Shopify && Shopify.PaymentButton) {
							Shopify.PaymentButton.init();
						}

						if (window.ProductModel) window.ProductModel.loadShopifyXR();

						this.removeGalleryListSemantic();
						this.updateImageSizes();
						this.preventVariantURLSwitching();

						setTimeout(() => {
							this.classList.add("active");
						});
						super.show(opener);

						document.body.classList.add("overflow-hidden-modal");

						this.querySelector(".read-more-btn")?.addEventListener(
							"click",
							() => {
								this.querySelector(".product__description").classList.toggle(
									"collapsed"
								);
							}
						);

						const dec = this.querySelector(".product__description");
						if (dec) {
							if (dec.scrollHeight > 250) {
								this.querySelector(".read-more-btn").style.display = "block";
							} else {
								dec.classList.remove("collapsed");
							}
						}

						this.setFocusElement(opener);
					})
					.finally(() => {
						opener.removeAttribute("aria-disabled");
						opener.classList.remove("loading");

						if (opener.querySelector(".loading-overlay__spinner")) {
							opener
								.querySelector(".loading-overlay__spinner")
								.classList.add("hidden");
						}

						selectDropDown();
					});
			}

			setInnerHTML(element, html, opener) {
				element.innerHTML = html;

				element.querySelectorAll("script").forEach((oldScriptTag) => {
					const newScriptTag = document.createElement("script");
					Array.from(oldScriptTag.attributes).forEach((attribute) => {
						newScriptTag.setAttribute(attribute.name, attribute.value);
					});
					newScriptTag.appendChild(
						document.createTextNode(oldScriptTag.innerHTML)
					);
					oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
				});

				const moreBtn = document.createElement("a");
				moreBtn.innerHTML = `<span>${theme.quickviewMore}</span>`;
				moreBtn.setAttribute("href", opener.getAttribute("data-product-url"));
				moreBtn.setAttribute(
					"class",
					"product__full-details button button--simple"
				);
				if (
					element.querySelectorAll(".product__info-column") &&
					element.querySelectorAll(".product__info-column").length > 0
				) {
					element.querySelectorAll(".product__info-column").forEach((el, i) => {
						if (i === 1) {
							el.appendChild(moreBtn);
						}
					});
				} else {
					element
						.querySelector(".product__info-container")
						.appendChild(moreBtn);
				}
			}

			removeDOMElements() {
				const modal = this.productElement.querySelector("product-modal");
				if (modal) modal.remove();

				const breadcrumb = this.productElement.querySelector(".breadcrumb");
				if (breadcrumb) breadcrumb.remove();

				const popup = this.productElement.querySelectorAll(".product-popup");
				popup.forEach((el) => {
					el.remove();
				});

				const sku = this.productElement.querySelector(".product__sku");
				if (sku) sku.remove();

				const about = this.productElement.querySelectorAll(".about");
				about.forEach((el) => {
					el.remove();
				});

				const customLiquid =
					this.productElement.querySelectorAll(".custom-liquid");
				customLiquid.forEach((el) => {
					el.remove();
				});

				const shareButtons =
					this.productElement.querySelector(".share-buttons");
				if (shareButtons) shareButtons.remove();

				const tags = this.productElement.querySelector(".product-tags");
				if (tags) tags.remove();

				const pickupAvailability = this.productElement.querySelector(
					".pickup-availability"
				);
				if (pickupAvailability) pickupAvailability.remove();

				const notify = this.productElement.querySelector(".notify-button");
				if (notify) notify.remove();

				const floatedForm = this.productElement.querySelector(".floated_form");
				if (floatedForm) floatedForm.remove();

				const complementaryProducts = this.productElement.querySelector(
					".complementary-products"
				);
				if (complementaryProducts) complementaryProducts.remove();

				const modalVariants =
					this.productElement.querySelector(".modal-opener-main");
				if (modalVariants) modalVariants.remove();

				const popupVariantFieldset = this.productElement.querySelectorAll(
					".popup_variant_fieldset"
				);
				popupVariantFieldset.forEach((el) => {
					el.classList.remove("popup_variant_fieldset");
				});

				const parent = this.productElement.querySelector(
					".product-variant-popup-modal"
				);
				if (parent && parent.parentNode) {
					while (parent.firstChild) {
						parent.parentNode.insertBefore(parent.firstChild, parent);
					}
					parent.remove();
				}

				const productMain = this.productElement.querySelector(".product__main");
				const description = this.productElement.querySelector(
					".product__description"
				);

				if (description) {
					productMain.appendChild(description);
					const btn = this.productElement.querySelector(".read-more-btn");
					productMain.appendChild(btn);
				}

				const productMedia =
					this.productElement.querySelector(".quick-add-info");
				const productText = this.productElement.querySelector(".product__text");
				const productTitle =
					this.productElement.querySelector(".product__title");
				const price = this.productElement.querySelector(".price-wrapper");
				const tax = this.productElement.querySelector(".product__tax");

				if (productText) productMedia.appendChild(productText);
				if (productTitle) productMedia.appendChild(productTitle);
				if (price) productMedia.appendChild(price);
				if (tax) productMedia.appendChild(tax);

				const productMediaList = this.productElement.querySelector(
					".product__media-list"
				);
				if (productMediaList)
					productMediaList.classList.remove("swiper", "js-media-list");

				const productMediaItems = this.productElement.querySelector(
					".product__media-items-wrapper"
				);
				if (productMediaItems)
					productMediaItems.classList.remove("swiper-wrapper");

				const productMediaItem = this.productElement.querySelector(
					".product__media-item"
				);
				if (productMediaItem) productMediaItem.classList.remove("swiper-slide");
			}

			preventDuplicatedIDs() {
				const sectionId = this.productElement.dataset.section;
				this.productElement.innerHTML =
					this.productElement.innerHTML.replaceAll(
						sectionId,
						`quickadd-${sectionId}`
					);
				this.productElement
					.querySelectorAll("variant-selects, variant-radios")
					.forEach((variantSelect) => {
						variantSelect.dataset.originalSection = sectionId;
					});
			}

			preventVariantURLSwitching() {
				if (this.modalContent.querySelector("variant-radios,variant-selects")) {
					this.modalContent
						.querySelector("variant-radios,variant-selects")
						.setAttribute("data-update-url", "false");
				}
			}

			removeGalleryListSemantic() {
				const galleryList = this.modalContent.querySelector(
					'[id^="Slider-Gallery"]'
				);
				if (!galleryList) return;

				galleryList.setAttribute("role", "presentation");
				galleryList
					.querySelectorAll('[id^="Slide-"]')
					.forEach((li) => li.setAttribute("role", "presentation"));
			}

			updateImageSizes() {
				const product = this.modalContent.querySelector(".product");
				const desktopColumns = product.classList.contains("product--columns");
				if (!desktopColumns) return;

				const mediaImages = product.querySelectorAll(".product__media img");
				if (!mediaImages.length) return;

				let mediaImageSizes =
					"(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";

				if (product.classList.contains("product--medium")) {
					mediaImageSizes = mediaImageSizes.replace("715px", "605px");
				} else if (product.classList.contains("product--small")) {
					mediaImageSizes = mediaImageSizes.replace("715px", "495px");
				}

				mediaImages.forEach((img) =>
					img.setAttribute("sizes", mediaImageSizes)
				);
			}

			setFocusElement(opener) {
				const productCard = opener.closest(".card-wrapper");
				const productCardLink = productCard?.querySelector(
					".card-wrapper__link--overlay"
				);
				if (productCardLink) this.openedBy = productCardLink;
			}
		}
	);
}
