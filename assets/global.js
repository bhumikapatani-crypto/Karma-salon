const synchronizeWithTabs = (slider) => {
  slider.slides.forEach((slide, index) => {
    slide.addEventListener("focusin", () => {
      if (!slide.classList.contains("swiper-slide-visible")) {
        slider.slideTo(index);
      }
    });
  });
};

const sliderInit = (isUpdate) => {
  if (
    document.querySelectorAll(".js-media-list") &&
    document.querySelectorAll(".js-media-list").length > 0
  ) {
    document.querySelectorAll(".js-media-list").forEach((elem) => {
      const mediaListId = elem.dataset?.jsMediaListId;
      const mediaSublist = Array.from(
        document.querySelectorAll(".js-media-sublist"),
      ).find(
        (subElem) =>
          subElem.dataset?.jsMediaListId === mediaListId && subElem.swiper,
      );
      let slider = new Swiper(elem, {
        slidesPerView: 1,
        spaceBetween: 1,
        autoHeight: true,
        navigation: {
          nextEl: ".product .product__slider-nav .swiper-button-next",
          prevEl: ".product .product__slider-nav .swiper-button-prev",
        },
        pagination: {
          el: ".product .product__pagination",
          type: "bullets",
          clickable: true,
        },
        thumbs: {
          swiper: mediaListId && mediaSublist ? mediaSublist.swiper : "",
        },
        on: {
          slideChangeTransitionStart: function () {
            if (mediaListId && mediaSublist) {
              mediaSublist.swiper.slideTo(this.activeIndex);
            }
          },
          slideChange: function () {
            window.pauseAllMedia();
            this.params.noSwiping = false;

            if (
              document.querySelector(".js-popup-slider") &&
              document.querySelector(".js-popup-slider").swiper
            ) {
              document
                .querySelector(".js-popup-slider")
                .swiper.slideTo(this.activeIndex);
            }
          },
          slideChangeTransitionEnd: function () {
            if (this.slides[this.activeIndex].querySelector("model-viewer")) {
              this.slides[this.activeIndex]
                .querySelector(".shopify-model-viewer-ui__button--poster")
                .removeAttribute("hidden");
            }
          },
          touchStart: function () {
            if (this.slides[this.activeIndex].querySelector("model-viewer")) {
              if (
                !this.slides[this.activeIndex]
                  .querySelector("model-viewer")
                  .classList.contains("shopify-model-viewer-ui__disabled")
              ) {
                this.params.noSwiping = true;
                this.params.noSwipingClass = "swiper-slide";
              } else {
                this.params.noSwiping = false;
              }
            }
          },
        },
      });

      const mainSliderElem = document.querySelector(
        `.js-media-list[data-js-media-list-id="${mediaListId}"]`,
      );
      const mainSlider = mainSliderElem?.swiper;

      const nextBtn = elem
        .closest(".product")
        ?.querySelector(
          ".product__media-sublist__slider-nav .swiper-button-next",
        );
      const prevBtn = elem
        .closest(".product")
        ?.querySelector(
          ".product__media-sublist__slider-nav .swiper-button-prev",
        );

      if (mainSlider) {
        nextBtn?.addEventListener("click", (e) => {
          e.preventDefault();
          mainSlider.slideNext();
        });
        prevBtn?.addEventListener("click", (e) => {
          e.preventDefault();
          mainSlider.slidePrev();
        });
      }

      if (isUpdate) {
        setTimeout(function () {
          slider.update();
        }, 800);
      }
    });
  }
};

const subSliderInit = (isUpdate) => {
  if (
    document.querySelectorAll(".js-media-sublist") &&
    document.querySelectorAll(".js-media-sublist").length > 0
  ) {
    document.querySelectorAll(".js-media-sublist").forEach((elem, index) => {
      let subSlider = new Swiper(elem, {
        slidesPerView: "auto",
        direction: "horizontal",
        freeMode: false,
        navigation: {
          nextEl:
            ".product .product__media-sublist__slider-nav .swiper-button-next",
          prevEl:
            ".product .product__media-sublist__slider-nav .swiper-button-prev",
        },
        centeredSlides: true,
        centeredSlidesBounds: true,
        slideToClickedSlide: true,
        watchSlidesProgress: true,
        updateOnWindowResize: true,
        on: {
          touchEnd: function (s, e) {
            let range = 5;
            let diff = (s.touches.diff = s.isHorizontal()
              ? s.touches.currentX - s.touches.startX
              : s.touches.currentY - s.touches.startY);
            if (diff < range || diff > -range) s.allowClick = true;
          },
        },
        breakpoints: {
          990: {
            direction: "vertical",
          },
        },
      });

      const sliderResizeObserve = new ResizeObserver((entries) => {
        const [entry] = entries;

        if (entry.contentRect.width >= 990) {
          setTimeout(() => {
            const sliders = document.querySelectorAll(
              ".js-media-list .swiper-wrapper",
            );
            const thumbs = document.querySelectorAll(".product__media-sublist");
            if (sliders.length && thumbs.length) {
              const sliderHeight = sliders[index]?.getBoundingClientRect()?.height || 0;
              thumbs[index].style.height = `${sliderHeight - 1}px`;
            }
          }, 400);
        }
      });

      if (document.querySelector(".product-section"))
        sliderResizeObserve.observe(document.querySelector(".product-section"));

      if (isUpdate) {
        setTimeout(function () {
          subSlider.update();
        }, 800);
      }
    });
  }
};

const popupSliderInit = (isUpdate) => {
  if (document.querySelector(".js-popup-slider")) {
    let popupSlider = new Swiper(document.querySelector(".js-popup-slider"), {
      zoom: true,
      slidesPerView: 1,
      navigation: {
        nextEl: ".product-media-modal .product__slider-nav .swiper-button-next",
        prevEl: ".product-media-modal .product__slider-nav .swiper-button-prev",
      },
      pagination: {
        el: ".product-media-modal .product__pagination",
        type: "bullets",
        clickable: true,
      },
      on: {
        click: function (e) {
          if (this.zoom.scale === 1) {
            this.zoom.in();
          } else {
            this.zoom.out();
          }
        },
        afterInit: function () {
          if (document.querySelector(".product__outer--static-column-aside")) {
            document
              .querySelectorAll(".product__media-list .product__media-toggle")
              .forEach((elem, index) => {
                elem.addEventListener("click", (e) => {
                  if (
                    document.querySelector(".js-popup-slider") &&
                    document.querySelector(".js-popup-slider").swiper
                  ) {
                    document
                      .querySelector(".js-popup-slider")
                      .swiper.slideTo(index);
                  }
                });
              });
          }
        },
        slideChange: function () {
          window.pauseAllMedia();
          this.params.noSwiping = false;
          document
            .querySelector(".product-media-modal__content")
            .classList.remove("zoom");
        },
        touchMove: function () {
          document
            .querySelector(".product-media-modal__content")
            .classList.remove("zoom");
        },
        slideChangeTransitionEnd: function () {
          if (this.slides[this.activeIndex].querySelector("model-viewer")) {
            this.slides[this.activeIndex]
              .querySelector(".shopify-model-viewer-ui__button--poster")
              .removeAttribute("hidden");
          }
        },
        touchStart: function () {
          if (this.slides[this.activeIndex].querySelector("model-viewer")) {
            if (
              !this.slides[this.activeIndex]
                .querySelector("model-viewer")
                .classList.contains("shopify-model-viewer-ui__disabled")
            ) {
              this.params.noSwiping = true;
              this.params.noSwipingClass = "swiper-slide";
            } else {
              this.params.noSwiping = false;
            }
          }
        },
      },
    });

    if (isUpdate) {
      setTimeout(function () {
        popupSlider.update();
      }, 800);
    }
  }
};

if (navigator.userAgent.indexOf("iPhone") > -1) {
  document
    .querySelector("[name=viewport]")
    .setAttribute(
      "content",
      "width=device-width, initial-scale=1, maximum-scale=1",
    );
}

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe",
    ),
  ).filter((el) => el.offsetParent !== null);
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button");
  summary.setAttribute("aria-expanded", "false");

  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id);
  }

  summary.addEventListener("click", (event) => {
    event.currentTarget.setAttribute(
      "aria-expanded",
      !event.currentTarget.closest("details").hasAttribute("open"),
    );
  });

  if (summary.closest("header-drawer")) return;
  summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return;
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();

  if (
    elementToFocus.tagName === "INPUT" &&
    ["search", "text", "email", "url"].includes(elementToFocus.type) &&
    elementToFocus.value
  ) {
    elementToFocus.setSelectionRange(0, elementToFocus.value.length);
  }
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*",
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => video.pause());
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus && !elementToFocus.classList.contains("card-focused"))
    elementToFocus.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) => {
      this.setMinimumDisable();

      button.addEventListener("click", this.onButtonClick.bind(this));
    });

    var eventList = ["paste", "input"];

    for (event of eventList) {
      this.input.addEventListener(event, function (e) {
        const numberRegex = /^0*?[1-9]\d*$/;

        if (
          numberRegex.test(e.currentTarget.value) ||
          e.currentTarget.value === ""
        ) {
          e.currentTarget.value;
        } else {
          e.currentTarget.value = 1;
        }

        if (e.currentTarget.value === 1 || e.currentTarget.value === "") {
          this.previousElementSibling.classList.add("disabled");
        } else {
          this.previousElementSibling.classList.remove("disabled");
        }
      });
    }

    this.input.addEventListener("focusout", function (e) {
      if (e.currentTarget.value === "") {
        e.currentTarget.value = 1;
      }
    });
  }

  setMinimumDisable() {
    if (this.input.value == 1) {
      if (this.classList.contains("quantity_cart")) return;

      this.querySelector('button[name="minus"]').classList.add("disabled");
    } else {
      this.querySelector('button[name="minus"]').classList.remove("disabled");
    }
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);

    this.setMinimumDisable();
  }
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options,
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid,
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this),
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);
    let provinceContainer = this?.provinceContainer;
    let countryInfoBlocks = [
      provinceContainer.nextElementSibling,
      provinceContainer,
      provinceContainer.previousElementSibling,
    ];

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      provinceContainer.style.display = "none";
      countryInfoBlocks.forEach((block) =>
        block.classList.remove("field--desktop-third"),
      );
    } else {
      for (let i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      provinceContainer.style.display = "";
      countryInfoBlocks.forEach((block) =>
        block.classList.add("field--desktop-third"),
      );
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector("details");
    const summaryElements = this.querySelectorAll("summary");
    this.addAccessibilityAttributes(summaryElements);

    this.headerWrapper = document.querySelector(".header-wrapper");
    if (this.headerWrapper) this.headerWrapper.preventHide = false;

    if (navigator.platform === "iPhone")
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${window.innerHeight}px`,
      );

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this)),
    );
    this.querySelectorAll("button").forEach((button) => {
      if (this.querySelector(".toggle-scheme-button") === button) return;
      if (this.querySelector(".header__localization-button") === button) return;
      if (this.querySelector(".header__localization-lang-button") === button)
        return;
      button.addEventListener("click", this.onCloseButtonClick.bind(this));
    });
  }

  addAccessibilityAttributes(summaryElements) {
    summaryElements.forEach((element) => {
      element.setAttribute("role", "button");
      element.setAttribute("aria-expanded", false);
      element.setAttribute("aria-controls", element.nextElementSibling.id);
    });
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute("open");

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen
        ? this.closeMenuDrawer(summaryElement)
        : this.openMenuDrawer(summaryElement);
    } else {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button"),
      );

      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
      });
    }
  }

  openMenuDrawer(summaryElement) {
    if (this.headerWrapper) this.headerWrapper.preventHide = true;
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove("menu-opening");
      this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open");
        details.classList.remove("menu-opening");
      });
      this.mainDetailsToggle
        .querySelector("summary")
        .setAttribute("aria-expanded", false);
      document.body.classList.remove(
        `overflow-hidden-${this.dataset.breakpoint}`,
      );
      removeTrapFocus(elementToFocus);
      this.closeAnimation(this.mainDetailsToggle);
      this.header =
        this.header || document.querySelector(".shopify-section-header");
      const main = document.querySelector("main");
      if (
        main
          ?.querySelectorAll(".shopify-section")[0]
          ?.classList.contains("section--has-overlay") &&
        !this.header.classList.contains("animate")
      ) {
        this.header.classList.remove("color-background-overlay-hidden");
        this.header.classList.add("color-background-overlay");
      }

      if (this.headerWrapper) this.headerWrapper.preventHide = false;
    }
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest("details");
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove("menu-opening");
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary"),
          );
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
    this.headerWrapper = document.querySelector(".header-wrapper");
    if (this.headerWrapper) this.headerWrapper.preventHide = false;
  }

  openMenuDrawer(summaryElement) {
    if (this.headerWrapper) this.headerWrapper.preventHide = true;
    this.header =
      this.header || document.querySelector(".shopify-section-header");
    this.borderOffset =
      this.borderOffset ||
      this.closest(".header-wrapper").classList.contains(
        "header-wrapper--border-bottom",
      )
        ? 1
        : 0;

    const main = document.querySelector("main");
    if (
      main
        ?.querySelectorAll(".shopify-section")[0]
        ?.classList.contains("section--has-overlay")
    ) {
      this.header.classList.remove("color-background-overlay");
      this.header.classList.add("color-background-overlay-hidden");
    }

    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });

    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
}

customElements.define("header-drawer", HeaderDrawer);

class SearchModalMobile extends HTMLElement {
  constructor() {
    super();

    this.addEventListener(
      "keyup",
      (evt) => evt.code === "Escape" && this.close(),
    );
    this.querySelector("#SearchModal-Overlay").addEventListener(
      "click",
      this.close.bind(this),
    );

    this.querySelector("#search-modal-close").addEventListener(
      "click",
      this.close.bind(this),
    );
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    if (document.querySelector("#search-icon-open") != null) {
      const cartLink = document.querySelector("#search-icon-open");
      cartLink.setAttribute("role", "button");
      cartLink.setAttribute("aria-haspopup", "dialog");
      cartLink.addEventListener("click", (event) => {
        event.preventDefault();
        this.open(cartLink);
      });
      cartLink.addEventListener("keydown", (event) => {
        if (event.code.toUpperCase() === "SPACE") {
          event.preventDefault();
          this.open(cartLink);
        }
      });
    }
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    setTimeout(() => {
      this.classList.add("animate", "active");
    });

    this.addEventListener(
      "transitionend",
      () => {
        const containerToTrapFocusOn = document.getElementById("search-modal");
        const focusElement =
          this.querySelector('.header__search input:not([type="hidden"])') ||
          this.querySelector(".search__main") ||
          this.querySelector(".search__close");
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true },
    );

    document.body.classList.add("overflow-hidden");
  }

  close() {
    this.classList.remove("active");
    removeTrapFocus(this.activeElement);
    document.body.classList.remove("overflow-hidden");
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define("search-modal-mobile", SearchModalMobile);

class ModalDialog extends HTMLElement {
  constructor() {
    super();

    this.initCloseButtons();

    this.addEventListener("keyup", (event) => {
      if (event.code && event.code.toUpperCase() === "ESCAPE") this.hide();
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide();
      });
    } else {
      this.addEventListener("click", (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  initCloseButtons() {
    const closeBtn = this.querySelector('[id^="ModalClose-"]');
    const backBtn = this.querySelector('[id^="ModalBackTo-"]');

    if (closeBtn) {
      closeBtn.removeEventListener("click", this._handleHide);
    }

    if (backBtn) {
      backBtn.removeEventListener("click", this._handleHide);
    }

    this._handleHide = this.hide.bind(this);

    if (closeBtn) {
      closeBtn.addEventListener("click", this._handleHide);
    }

    if (backBtn) {
      backBtn.addEventListener("click", this._handleHide);
    }
  }

  reinit() {
    this.initCloseButtons();
    popupSliderInit(true);
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    if (this.classList.contains("hiding")) {
      return;
    }
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (opener.dataset.id) {
      this.classList.add(opener.dataset.id);
    }
    if (popup) popup.loadContent();

    this.initCloseButtons();

    this.addEventListener(
      "transitionend",
      () => {
        trapFocus(this, this.querySelector('[role="dialog"]'));
      },
      { once: true },
    );
    if (opener.dataset.type == "notify") {
      this.setCorrectValues(opener.dataset.id);
    }
  }

  setCorrectValues(id) {
    const hiddenInput = document.querySelector(`#${id}-ContactForm-options`);
    const form = document.querySelector(
      `#${id}-notify_popup .notify_subscription`,
    );

    function getSelectedOptions() {
      const options = [];
      const radios = document.querySelectorAll(
        `#${id}-product-form input[type="radio"]:checked`,
      );

      radios.forEach((radio) => {
        const nameParts = radio.name.split("-");
        const optionName = nameParts[0];
        const optionValue = radio.value;
        options.push(`${optionName}: ${optionValue}`);
      });

      return options.join(", ");
    }

    if (form) {
      form.addEventListener("submit", function () {
        hiddenInput.value = getSelectedOptions();
      });
    }
  }

  hide() {
    let isOpen = false;

    this.removeAttribute("open");
    this.classList.add("hiding");
    removeTrapFocus(this.openedBy);

    document.querySelectorAll("body > quick-add-modal").forEach((el) => {
      if (el.hasAttribute("open")) {
        isOpen = true;
      }
    });

    let CartDrawerNote = document.getElementById("CartDrawer-Note");
    let CartDrawerNoteAppla = document.getElementById("CartDrawer-Note-Applay");

    if (!isOpen) {
      document.body.classList.remove("overflow-hidden");
      document.body.dispatchEvent(new CustomEvent("modalClosed"));
      if (CartDrawerNote) {
        if (CartDrawerNoteAppla)
          if (CartDrawerNote.value.trim() !== "") {
            CartDrawerNoteAppla.classList.add("show");
          } else {
            CartDrawerNoteAppla.classList.remove("show");
          }
      }
    }

    const images = document.querySelector(".product-media-modal__content");

    if (images) {
      images.classList.remove("zoom");
    }
    setTimeout(() => {
      if (this) {
        this.classList.remove("hiding");
        for (const className of Array.from(this.classList)) {
          if (className.startsWith("variant-")) {
            this.classList.remove(className);
          }
        }
      }
    }, 700);
  }
}

customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button) return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal) modal.show(button);
    });
  }
}

customElements.define("modal-opener", ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
      "click",
      this.loadContent.bind(this),
    );
  }

  loadContent() {
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(
          true,
        ),
      );

      this.setAttribute("loaded", true);
      window.pauseAllMedia();
      this.appendChild(
        content.querySelector("video, model-viewer, iframe"),
      ).focus();

      if (
        this.closest(".swiper")?.swiper.slides[
          this.closest(".swiper").swiper.activeIndex
        ].querySelector("model-viewer")
      ) {
        if (
          !this.closest(".swiper")
            .swiper.slides[
              this.closest(".swiper").swiper.activeIndex
            ].querySelector("model-viewer")
            .classList.contains("shopify-model-viewer-ui__disabled")
        ) {
          this.closest(".swiper").swiper.params.noSwiping = true;
          this.closest(".swiper").swiper.params.noSwipingClass = "swiper-slide";
        }
      }
    }
  }
}

customElements.define("deferred-media", DeferredMedia);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);

    this.isHighVariantNeedUpdate = false;
    this.isCombinedListingsNeedUpdate = false;
    this.combinedProductURL = "";
    this.infoBlocksList = ['ProductModal', 'Desc'];
  }

  onVariantChange(event) {
    if (!this.contains(event.target)) return;

    const selectedValuesIds = this.getSelectedValuesIds();

    this.updateOptions();
    this.updateSelectedOptions();
    // updateMasterId method updates currentVariant from liquid <script data-all-variations-no-high>
    this.updateMasterId();
    this.toggleAddButton(true, "");

    this.isHighVariantNeedUpdate = false;
    // -----
    // checking for high-variant and combined products
    // if variant not found in liquid <script data-all-variants-no-high> and product is high-variant
    if (
      (!this.currentVariant && this.dataset.isHighVariantProduct === "true") ||
      (!this.currentVariant && this.combinedProductURL)
    ) {
      this.highVariantRequestUrl = this.createRequestUrl({
        selectedValuesIds: selectedValuesIds,
        combinedProductURL: this.combinedProductURL,
      });
      if (this.highVariantRequestUrl) {
        this.isHighVariantNeedUpdate = true;
        if (this.combinedProductURL) {
          this.isCombinedListingsNeedUpdate = true;
        }
      }
    }
    // -----

    if (this.isHighVariantNeedUpdate === false) {
      this.updatePickupAvailability();
      this.updateVariantStatuses();
    }
    this.resetErrorMessage();

    if (!this.currentVariant) {
      // -----
      // for high-variant products
      if (this.isHighVariantNeedUpdate) {
        this.classList.add("high-variant-loading");
        this.renderProductInfo(this.highVariantRequestUrl);
        return;
      }
      // -----

      this.toggleAddButton(true, "");
      this.setUnavailable();
    } else {
      if (this.currentVariant?.featured_media) {
        // If variant display != "show_all", the media gallery element is fully replaced inside updateElementsAfterFetch
        const mediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
        this.updateMedia(mediaId);
      }
      this.updateURL();
      this.updateVariantInput();
      const requestUrl = this.createRequestUrl({
        currentVariantId: this.currentVariant.id,
        combinedProductURL: this.combinedProductURL,
      });
      this.renderProductInfo(requestUrl);
    }
  }

  updateOptions() {
    const fieldsets = Array.from(
      this.querySelectorAll(".product-form__controls--dropdown"),
    );

    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value,
    ).concat(
      fieldsets.map((fieldset) => {
        return Array.from(fieldset.querySelectorAll("input")).find(
          (radio) => radio.checked,
        ).value;
      }),
    );
  }

  updateSelectedOptions() {
    if (this.querySelector(".popup_variant_fieldset")) {
      const fieldsetName = document.querySelector(`.${this.id}`);
      const fieldsets = Array.from(this.querySelectorAll(".fieldset"));

      fieldsets.forEach((fieldset) => {
        const selectedOptionElement = fieldset.querySelector(
          "input[type='radio']:checked",
        );
        const selectedOption = selectedOptionElement?.value ?? null;

        const selectedOptionText = fieldsetName.querySelector(
          `.${fieldset.id} .selected_option_name`,
        );

        if (selectedOptionText) {
          selectedOptionText.textContent = selectedOption;
        }
      });
    }
  }

  updateMasterId() {
    if (this.variantData || this.querySelector("[data-all-variants-no-high]")) {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options
          .map((option, index) => {
            return this.options[index] === option;
          })
          .includes(false);
      });
    }
  }

  isHidden(elem) {
    const styles = window.getComputedStyle(elem);
    return styles.display === "none" || styles.visibility === "hidden";
  }

  updateMedia(mediaId = null) {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;

    const targetMediaId =
      mediaId ||
      `${this.dataset.section}-${this.currentVariant.featured_media.id}`;

    const newMediaGlobal = document.querySelector(
      `[data-media-id="${targetMediaId}"]`,
    );

    if (!newMediaGlobal) return;

    const parent = newMediaGlobal.parentElement;

    /**
     * ------------------------------------------------
     * Main sliders
     * ------------------------------------------------
     */
    const swiperWrappers = document.querySelectorAll(
      ".product__media-wrapper, .global-variant-slider",
    );

    swiperWrappers.forEach((elem) => {
      // skip quickview here
      if (
        elem.firstElementChild &&
        elem.firstElementChild.classList.contains("quick-product__media-list")
      ) {
        return;
      }

      if (this.isHidden(elem)) return;

      const newMedia = elem.querySelector(`[data-media-id="${targetMediaId}"]`);

      if (!newMedia) return;

      const mediaList = elem.querySelector(
        ".js-media-list, .global-variant-js-media-list",
      );

      /**
       * Swiper layouts
       */
      if (mediaList && mediaList.swiper) {
        let slideIndex = mediaList.swiper.slides.findIndex((slideEl) => {
          return slideEl.dataset?.mediaId === targetMediaId;
        });

        // fallback
        if (slideIndex === -1) {
          slideIndex = Number(newMedia.dataset?.swiperSlideIndex || 0);
        }

        mediaList.swiper.slideTo(slideIndex, 800);
      } else {
        /**
         * Non-swiper layouts
         */
        newMedia && parent.prepend(newMedia);

        window.setTimeout(() => {
          parent.scroll(0, 0);
        });
      }

      /**
       * stacked / stacked_previews support
       */
      const stackedList =
        elem.querySelector(
          ".product__media-list[data-desktop-type='stacked_previews']",
        ) ||
        elem.querySelector(".product__media-list[data-desktop-type='stacked']");

      if (stackedList && window.innerWidth >= 990) {
        const targetItem = stackedList.querySelector(
          `[data-media-id="${targetMediaId}"]`,
        );

        if (targetItem) {
          const offset =
            targetItem.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: offset - 100,
            behavior: "smooth",
          });
        }
      }
    });

    /**
     * ------------------------------------------------
     * Quick view
     * ------------------------------------------------
     */
    const swiperWrappersQuickView = document.querySelectorAll(
      ".quick-product__media-list",
    );

    swiperWrappersQuickView.forEach((elem) => {
      if (this.isHidden(elem)) return;

      const newMedia = elem.querySelector(`[data-media-id="${targetMediaId}"]`);

      if (!newMedia) return;

      const mediaList = elem.querySelector(".quick-js-media-list");

      if (mediaList && mediaList.swiper) {
        let slideIndex = mediaList.swiper.slides.findIndex((slideEl) => {
          return slideEl.dataset?.mediaId === targetMediaId;
        });

        if (slideIndex === -1) {
          slideIndex = Number(newMedia.dataset?.swiperSlideIndex || 0);
        }

        mediaList.swiper.slideTo(slideIndex, 800);
      } else {
        newMedia && parent.prepend(newMedia);

        window.setTimeout(() => {
          parent.scroll(0, 0);
        });
      }
    });
  }

  updateURL() {
    if (this.dataset.updateUrl === "false") return;
    const newUrl = this.currentVariant
      ? `${this.dataset.url}?variant=${this.currentVariant.id}`
      : this.dataset.url;

    window.history.replaceState({}, "", newUrl);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    publish(PUB_SUB_EVENTS.variantChange, {
      data: {
        sectionId: this.dataset.section,
        variant: this.currentVariant,
      },
    });
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(":checked").value === variant.option1,
    );
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [
        ...option.querySelectorAll('input[type="radio"], option'),
      ];
      const previousOptionSelected =
        inputWrappers[index - 1].querySelector(":checked").value;
      const availableOptionInputsValue = selectedOptionOneVariants
        .filter(
          (variant) =>
            variant.available &&
            variant.options[index - 1] === previousOptionSelected,
        )
        .map((variantOption) => variantOption.options[index]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue);
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        if (input.tagName === "OPTION") {
          input.innerText = input.getAttribute("value");
        } else if (input.tagName === "INPUT") {
          input.classList.remove("disabled");
        }
      } else {
        if (input.tagName === "OPTION") {
          input.innerText =
            window.variantStrings.unavailable_with_option.replace(
              "[value]",
              input.getAttribute("value"),
            );
        } else if (input.tagName === "INPUT") {
          input.classList.add("disabled");
        }
      }
    });
  }

  setCheckedInputsBySelectedValues(selectedValues) {
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];

    inputWrappers.forEach((groupEl, index) => {
      const selectedValue = selectedValues[index];
      if (!selectedValue) return;

      const inputs = [...groupEl.querySelectorAll('input[type="radio"]')];

      inputs.forEach((input) => {
        const shouldBeChecked = input.value === selectedValue;
        input.checked = shouldBeChecked;
        if (shouldBeChecked) {
          input.setAttribute("checked", "");
        } else {
          input.removeAttribute("checked");
        }
      });
    });
  }

  getSelectedValues() {
    const controls = [...this.querySelectorAll(".product-form__controls")];

    controls.sort((a, b) => {
      return (
        Number(a.dataset.optionPosition) - Number(b.dataset.optionPosition)
      );
    });

    const selectedValues = controls.map((control) => {
      const checkedInput = control.querySelector('input[type="radio"]:checked');
      return checkedInput ? checkedInput.value : null;
    });

    return selectedValues;
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  renderProductInfo(requestUrl) {
    this.abortController?.abort();
    this.abortController = new AbortController();

    fetch(requestUrl, { signal: this.abortController.signal })
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");

        try {
          this.setCurrentVariantAfterFetch(html);
        } catch (err) {
          console.log(err);
        }

        // -----
        // for high-variant products
        // and if variant not found in liquid <script data-all-variants-no-high>
        // but it was found after a request with the option_values parameter
        if (this.isHighVariantNeedUpdate) {
          try {
            this.updateURL();
            this.updatePickupAvailability();
            this.updatePickerInnerHtml(html);
            if (this.currentVariant) {
              this.updateVariantInput();
              if (this.currentVariant.featured_media) {
                // If variant display != "show_all", the media gallery element is fully replaced inside updateElementsAfterFetch
                const mediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
                this.updateMedia(mediaId);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
        // -----

        this.updateElementsAfterFetch(html);

        if (!this.currentVariant) {
          this.toggleAddButton(true, "");
          this.setUnavailable();
        } else {
          this.toggleAddButton(
            !this.currentVariant.available,
            window.variantStrings.soldOut,
          );
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.info("Fetch aborted by user");
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        this.classList.remove("high-variant-loading");
      });
  }

  toggleAddButton(disable = true, text) {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
    );
    productForms.forEach((productForm) => {
      const addButton = productForm.querySelector('[name="add"]');
      if (!addButton) return;

      const addButtonText =
        addButton.querySelector(".button__label") ||
        addButton.querySelector("span");

      if (disable) {
        addButton.setAttribute("disabled", true);
        addButton.setAttribute("aria-disabled", true);
        if (text) {
          addButtonText.textContent = text;

          if (text === window.variantStrings.unavailable) {
            addButton.dataset.status = "unavailable";
          } else {
            addButton.dataset.status = "sold-out";
          }
        }
      } else {
        addButton.removeAttribute("disabled");
        addButton.removeAttribute("aria-disabled");
        addButtonText.textContent = window.variantStrings.addToCart;
        addButton.dataset.status = "available";
      }
    });
  }

  resetErrorMessage() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
    );
    productForms.forEach((productForm) => {
      const parentEl = productForm.closest("product-form");
      if (parentEl) {
        const errorWrapperEl = parentEl.querySelector(
          ".product-form__error-message-wrapper",
        );
        const errorTextEl = errorWrapperEl?.querySelector(
          ".product-form__error-message",
        );
        if (!errorWrapperEl || !errorTextEl) return;
        errorWrapperEl.setAttribute("hidden", true);
        errorTextEl.textContent = "";
      }
    });
  }

  setUnavailable() {
    const price = document.getElementById(`price-${this.dataset.section}`);
    const priceSticky = document.getElementById(
      `price-sticky-${this.dataset.section}`,
    );
    const inventory = document.getElementById(
      `Inventory-${this.dataset.section}`,
    );
    const pickerInventory = document.getElementById(
      `PickerInventory-${this.dataset.section}`,
    );
    const sku = document.getElementById(`Sku-${this.dataset.section}`);
    const colorNameDestinations = document.querySelectorAll(
      `[id^="ColorName-${this.dataset.section}"]`,
    );

    this.toggleAddButton(true, window.variantStrings.unavailable);
    if (price) price.classList.add("visibility-hidden");
    if (priceSticky) priceSticky.classList.add("visibility-hidden");
    if (inventory) inventory.classList.add("visibility-hidden");
    if (pickerInventory) pickerInventory.classList.add("visibility-hidden");
    if (sku) sku.classList.add("visibility-hidden");
    colorNameDestinations.forEach((colorNameDestination) => {
      //colorNameDestination.classList.add("visibility-hidden");
    });
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector("[data-all-variants-no-high]").textContent);
    return this.variantData;
  }

  updateElementsAfterFetch(html) {
    // attr data-original-section use for Quick view modal
    const currentSectionId = this.dataset.section;

    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    // Detect current scope
    const parentProductInfo = this.closest(".main-product");
    const parentQuickView = this.closest("quick-add-modal");
    const parentFeaturedProduct = this.closest(".featured-product-section");

    // Scoped container
    const scope =
      parentQuickView ||
      parentFeaturedProduct ||
      parentProductInfo ||
      document;

    // Scoped helpers
    const find = (selector) => scope.querySelector(selector);
    const findAll = (selector) => scope.querySelectorAll(selector);

    // PRICE
    const priceDestination = find(
      `#price-${currentSectionId}`
    );

    const priceStickyDestination = find(
      `#price-sticky-${currentSectionId}`
    );

    const priceSource = html.getElementById(
      `price-${sourceSectionId}`
    );

    if (priceSource && priceDestination) {
      priceDestination.innerHTML = priceSource.innerHTML;
      priceDestination.classList.remove("visibility-hidden");
    }
    if (priceSource && priceStickyDestination) {
      priceStickyDestination.innerHTML = priceSource.innerHTML;

      const priceText =
        priceStickyDestination.querySelector(".price-text");

      if (priceText) {
        priceText.className = "price-text";
      }
    }

    // INVENTORY
    const inventorySource = html.getElementById(
      `Inventory-${sourceSectionId}`
    );

    const inventoryDestination = find(
      `#Inventory-${currentSectionId}`
    );

    if (inventorySource && inventoryDestination) {
      inventoryDestination.innerHTML =
        inventorySource.innerHTML;

      inventoryDestination.classList.toggle(
        "visibility-hidden",
        inventorySource.innerText === ""
      );
    }

    // Picker inventory
    const pickerInventorySource = html.getElementById(
      `PickerInventory-${sourceSectionId}`
    );

    const pickerInventoryDestination = find(
      `#PickerInventory-${currentSectionId}`
    );

    if (
      pickerInventorySource &&
      pickerInventoryDestination
    ) {
      pickerInventoryDestination.innerHTML =
        pickerInventorySource.innerHTML;

      pickerInventoryDestination.classList.toggle(
        "visibility-hidden",
        pickerInventorySource.innerText === ""
      );
    }

    // SKU
    const skuSource = html.getElementById(
      `Sku-${sourceSectionId}`
    );

    const skuDestination = find(
      `#Sku-${currentSectionId}`
    );
    if (skuSource && skuDestination) {
      skuDestination.innerHTML = skuSource.innerHTML;

      skuDestination.classList.toggle(
        "visibility-hidden",
        skuSource.classList.contains("visibility-hidden")
      );
    }

    // COLOR SWATCH LABELS
    const colorNameSources = html.querySelectorAll(
      `[id^="ColorName-${sourceSectionId}"]`
    );

    const colorNameDestinations = findAll(
      `[id^="ColorName-${currentSectionId}"]`
    );
    if (
      colorNameSources?.length ===
      colorNameDestinations?.length
    ) {
      colorNameDestinations.forEach(
        (colorNameDestination, index) => {
          colorNameDestination.classList.remove(
            "visibility-hidden"
          );

          colorNameDestination.innerHTML =
            colorNameSources[index].innerHTML;
        }
      );
    }

    // PRODUCT INFO BLOCKS
    this.updateProductInfoBlocks(html, scope);

    // VARIANT IMAGE SWATCHES
    if (this.isHighVariantNeedUpdate !== true) {
      const variantSwatchesSource = html.querySelector(
        `#variant-picker-${sourceSectionId} [data-is-variant-image-swatch="true"]`
      );

      const variantSwatchesDestination = find(
        `#variant-picker-${currentSectionId} [data-is-variant-image-swatch="true"]`
      );

      if (
        variantSwatchesSource &&
        variantSwatchesDestination
      ) {
        if (parentQuickView) {
          variantSwatchesDestination.innerHTML =
            variantSwatchesSource.innerHTML.replaceAll(
              sourceSectionId,
              `quickview-${sourceSectionId}`
            );
        } else {
          variantSwatchesDestination.innerHTML =
            variantSwatchesSource.innerHTML;
        }
      }
    }

    // PRODUCT MEDIA
    if (
      this.dataset?.variantMediaDisplay !== "show_all" ||
      this.isCombinedListingsNeedUpdate
    ) {
      const mediaSource = html.querySelector(
        `[data-section="product-media-${sourceSectionId}"]`
      );

      const mediaDestination = find(
        `[data-section="product-media-${currentSectionId}"]`
      );

      if (mediaSource && mediaDestination) {
        mediaDestination.innerHTML = mediaSource.innerHTML;

        if (parentQuickView) {
          if (
            typeof parentQuickView.removeDOMElements ===
            "function"
          ) {
            parentQuickView.removeDOMElements(
              mediaDestination
            );
          }

          if (
            typeof parentQuickView.initSlider ===
            "function"
          ) {
            parentQuickView.initSlider();
          }
        } else if (parentFeaturedProduct) {
          const section = find(
            `#shopify-section-${currentSectionId}`
          );

          if (
            section &&
            typeof window.initFeaturedProduct ===
              "function"
          ) {
            window.initFeaturedProduct(section);
          }
        } else {
          const section = find(
            `#shopify-section-${currentSectionId}`
          );

          if (
            section &&
            typeof initProductPage === "function"
          ) {
            initProductPage(section);
          }
        }

        if (find(".js-media-list")) {
          subSliderInit(true);
          sliderInit(true);
        }
      }
    }

    // COMBINED LISTINGS
    if (this.isCombinedListingsNeedUpdate) {
      const newVariantData = html.querySelector(
        "[data-selected-variant]"
      ).innerHTML;

      const selectedVariant = !!newVariantData
        ? JSON.parse(newVariantData)
        : null;

      let productTitle = selectedVariant?.name?.replace(
        `- ${selectedVariant?.title}`,
        ""
      );

      if (!productTitle) {
        productTitle = html.querySelector(".product__title")
          ?.innerHTML
          ? html
              .querySelector(".product__title")
              ?.innerHTML.trim()
          : "";
      }

      // Product title
      const titleDestination = findAll(".product__title");

      if (titleDestination) {
        titleDestination.forEach((titleElem) => {
          titleElem.innerHTML = productTitle || "";
        });
      }

      // Breadcrumb
      const breadcrumbDestination = find(
        ".breadcrumb span"
      );

      if (breadcrumbDestination) {
        breadcrumbDestination.innerHTML =
          productTitle || "";
      }

      // Text
      const textDestination = find(
        ".product .product__info-container .product__text"
      );

      const textSource = html.querySelector(
        ".product .product__info-container .product__text"
      )?.innerHTML;

      if (textDestination) {
        textDestination.innerHTML = textSource || "";
      }

      // About
      const aboutDestination = find(
        ".product .product__outer .about"
      );

      if (aboutDestination) {
        aboutDestination.innerHTML =
          html.querySelector(
            ".product .product__outer .about"
          )?.innerHTML || "";
      }

      // Buttons
      const buttonsDestination = findAll(
        ".product .product__outer .product-form .form"
      );

      if (buttonsDestination) {
        buttonsDestination.forEach((titleElem) => {
          titleElem.innerHTML =
            html?.querySelector(
              ".product .product__outer .product-form .form"
            )?.innerHTML || "";
        });
      }
    }

    // QUICK VIEW CONTENT MOVE
    if (parentQuickView) {
      // Use scoped element instead of global productElement
      const productMedia = scope.querySelector(".quick-add-info");

      const productText = html.querySelector(".product__text");
      const productTitle = html.querySelector(".product__title");
      const price = html.querySelector(".price-wrapper");
      const tax = html.querySelector(".product__tax");

      if (productMedia) {
        if (productText) productMedia.appendChild(productText);
        if (productTitle) productMedia.appendChild(productTitle);
        if (price) productMedia.appendChild(price);
        if (tax) productMedia.appendChild(tax);
      }
    }
  }

  updateProductInfoBlocks(html, scope) {
    const sourceId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    const destId = this.dataset.section;

    this.infoBlocksList.forEach((block) => {
      const blockSource = html.getElementById(
        `${block}-${sourceId}`
      );

      const blockDestination = scope.querySelector(
        `#${block}-${destId}`
      );

      if (blockDestination) {
        blockDestination.innerHTML =
          blockSource?.innerHTML || "";

        // Check if modal exists and reinitialize
        const isDialog =
          blockDestination.querySelector('[role="dialog"]');

        if (
          isDialog &&
          typeof blockDestination?.reinit === "function"
        ) {
          blockDestination.reinit();
        }
      }
    });
  }

  // methods for high variant products
  getSelectedValuesIds() {
    const controls = [...this.querySelectorAll(".product-form__controls")];

    controls.sort((a, b) => {
      return (
        Number(a.dataset.optionPosition) - Number(b.dataset.optionPosition)
      );
    });

    return controls.map((control) => {
      const checkedInput = control.querySelector('input[type="radio"]:checked');

      if (checkedInput?.dataset?.productUrl) {
        this.combinedProductURL = checkedInput.dataset.productUrl;
      }

      return checkedInput?.dataset?.optionValueId
        ? checkedInput.dataset.optionValueId
        : null;
    });
  }

  createRequestUrl({
    currentVariantId = "",
    selectedValuesIds = [],
    combinedProductURL = "",
  }) {
    const productUrl = combinedProductURL || `${this.dataset.url}`;
    const sectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    if (currentVariantId) {
      return `${productUrl}?variant=${currentVariantId}&section_id=${sectionId}`;
    }

    // -----
    // for high-variant products
    // and if variant not found in liquid <script data-all-variants-no-high>
    if (selectedValuesIds.length) {
      const params = [];
      params.push(`section_id=${sectionId}`);
      params.push(`option_values=${selectedValuesIds.join(",")}`);
      return `${productUrl}?${params.join("&")}`;
    }
    // -----
  }

  setCurrentVariantAfterFetch(html) {
    // attr data-original-section use for Quick view modal
    const currentSectionId = this.dataset.section;
    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    const variantPickerSource = html.getElementById(
      `variant-picker-${sourceSectionId}`,
    );
    const variantPickerDestination = document.getElementById(
      `variant-picker-${this.dataset.section}`,
    );
    if (!variantPickerSource) return;

    if (variantPickerSource.dataset.url != variantPickerDestination.dataset.url) {
      this.dataset.url = variantPickerSource.dataset.url
    }

    const newVariantDataEl = variantPickerSource.querySelector(
      "[data-selected-variant]",
    );
    if (!newVariantDataEl) return;

    const newVariantData = variantPickerSource.querySelector(
      "[data-selected-variant]",
    ).innerHTML;

    const selectedVariant = !!newVariantData
      ? JSON.parse(newVariantData)
      : null;

    this.currentVariant = selectedVariant;

    const oldEl = variantPickerDestination.querySelector(
      "[data-selected-variant]",
    );
    if (oldEl) {
      oldEl.innerHTML = newVariantData;
    }
  }

  updatePickerInnerHtml(html) {
    // attr data-original-section use for Quick view modal
    const currentSectionId = this.dataset.section;
    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    const variantPickerSource = html.getElementById(
      `variant-picker-${sourceSectionId}`,
    );
    const variantPickerDestination = document.getElementById(
      `variant-picker-${currentSectionId}`,
    );

    if (variantPickerSource && variantPickerDestination) {
      const quickAddModal = this.closest("quick-add-modal");
      if (quickAddModal) {
        variantPickerDestination.innerHTML =
          variantPickerSource.innerHTML.replaceAll(
            sourceSectionId,
            `quickadd-${sourceSectionId}`,
          );
      } else {
        variantPickerDestination.innerHTML = variantPickerSource.innerHTML;
      }
    }
  }
}

if (!customElements.get("variant-selects")) {
  customElements.define("variant-selects", VariantSelects);
}

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        input.classList.remove("disabled");
      } else {
        input.classList.add("disabled");
      }
    });
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll(".fieldset"));
    this.options = fieldsets.map((fieldset) => {
      const checkedRadio = Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked,
      );
      if (checkedRadio) {
        return checkedRadio.value;
      }
      // If no radio is checked, try to find the default selected one
      const defaultRadio = Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.hasAttribute("checked") || radio.defaultChecked,
      );
      return defaultRadio ? defaultRadio.value : null;
    });
  }
}

customElements.define("variant-radios", VariantRadios);

class PasswordViewer {
  constructor() {
    const passwordField = document.querySelectorAll(".field--pass");

    passwordField.forEach((el) => {
      const input = el.querySelector("input");
      const btnWrapper = el.querySelector(".button-pass-visibility");
      const btnOpen = el.querySelector(".icon-eye-close");
      const btnClose = el.querySelector(".icon-eye");

      input.addEventListener("input", () => {
        input.value !== ""
          ? (btnWrapper.style.display = "block")
          : (btnWrapper.style.display = "none");
      });

      btnOpen.addEventListener("click", () => {
        input.type = "text";
        btnOpen.style.display = "none";
        btnClose.style.display = "block";
      });

      btnClose.addEventListener("click", () => {
        input.type = "password";
        btnOpen.style.display = "block";
        btnClose.style.display = "none";
      });
    });
  }
}

class ProductRecommendations extends HTMLElement {
  constructor() {
    super();

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      if (this.querySelector(".product-recommendations__loading")) {
        this.querySelector(".product-recommendations__loading").classList.add(
          "loading",
        );
        this.querySelector(".product-recommendations__loading").style.display =
          "flex";
      }

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector("product-recommendations");
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
          }

          if (this.querySelector(".product-recommendations__empty")) {
            this.querySelector(
              ".product-recommendations__empty",
            ).style.display = "flex";
          }

          const generateSrcset = (image, widths = []) => {
            const imageUrl = new URL(image["src"]);
            return widths
              .filter((width) => width <= image["width"])
              .map((width) => {
                imageUrl.searchParams.set("width", width.toString());
                return `${imageUrl.href} ${width}w`;
              })
              .join(", ");
          };

          const createImageElement = (image, classes, sizes, productTitle) => {
            const previewImage = image["preview_image"];
            const newImage = new Image(
              previewImage["width"],
              previewImage["height"],
            );
            newImage.className = classes;
            newImage.alt = image["alt"] || productTitle;
            newImage.sizes = sizes;
            newImage.src = previewImage["src"];
            newImage.srcset = generateSrcset(
              previewImage,
              [165, 360, 533, 720, 940, 1066],
            );
            newImage.loading = "lazy";
            return newImage;
          };

          const checkSwatches = () => {
            document
              .querySelectorAll(".js-color-swatches-wrapper")
              .forEach((wrapper) => {
                wrapper
                  .querySelectorAll(".js-color-swatches input")
                  .forEach((input) => {
                    input.addEventListener("click", (event) => {
                      const primaryImage =
                        wrapper.querySelector(".media--first");
                      const secondaryImage =
                        wrapper.querySelector(".media--second");
                      const handleProduct = wrapper.dataset.product;

                      if (event.currentTarget.checked && primaryImage) {
                        wrapper
                          .querySelector(".js-color-swatches-link")
                          .setAttribute(
                            "href",
                            event.currentTarget.dataset.variantLink,
                          );
                        if (
                          wrapper.querySelector(
                            '.card__add-to-cart button[name="add"]',
                          )
                        ) {
                          wrapper
                            .querySelector(
                              '.card__add-to-cart button[name="add"]',
                            )
                            .setAttribute("aria-disabled", false);
                          if (
                            wrapper.querySelector(
                              '.card__add-to-cart button[name="add"] > span',
                            )
                          ) {
                            wrapper
                              .querySelector(
                                '.card__add-to-cart button[name="add"] > span',
                              )
                              .classList.remove("hidden");
                            wrapper
                              .querySelector(
                                '.card__add-to-cart button[name="add"] .sold-out-message',
                              )
                              .classList.add("hidden");
                          }
                          wrapper.querySelector(
                            '.card__add-to-cart input[name="id"]',
                          ).value = event.currentTarget.dataset.variantId;
                        }
                        const currentColor = event.currentTarget.value;

                        jQuery.getJSON(
                          window.Shopify.routes.root +
                            `products/${handleProduct}.js`,
                          function (product) {
                            const variant = product.variants.filter(
                              (item) =>
                                item.featured_media != null &&
                                item.options.includes(currentColor),
                            )[0];

                            if (variant) {
                              const newPrimaryImage = createImageElement(
                                variant["featured_media"],
                                primaryImage.className,
                                primaryImage.sizes,
                                product.title,
                              );

                              if (newPrimaryImage.src !== primaryImage.src) {
                                let flag = false;
                                if (secondaryImage) {
                                  const secondaryImagePathname = new URL(
                                    secondaryImage.src,
                                  ).pathname;
                                  const newPrimaryImagePathname = new URL(
                                    newPrimaryImage.src,
                                  ).pathname;

                                  if (
                                    secondaryImagePathname ==
                                    newPrimaryImagePathname
                                  ) {
                                    primaryImage.remove();
                                    secondaryImage.classList.remove(
                                      "media--second",
                                    );
                                    secondaryImage.classList.add(
                                      "media--first",
                                    );
                                    flag = true;
                                  }
                                }
                                if (flag == false) {
                                  primaryImage.animate(
                                    { opacity: [1, 0] },
                                    {
                                      duration: 200,
                                      easing: "ease-in",
                                      fill: "forwards",
                                    },
                                  ).finished;
                                  setTimeout(function () {
                                    primaryImage.replaceWith(newPrimaryImage);
                                    newPrimaryImage.animate(
                                      { opacity: [0, 1] },
                                      { duration: 200, easing: "ease-in" },
                                    );
                                    if (secondaryImage) {
                                      secondaryImage.remove();
                                    }
                                  }, 200);
                                }
                              }
                            }
                          },
                        );
                      }
                    });
                  });
              });
          };

          checkSwatches();

          const addClasses = (slider) => {
            const sliderWrapper = slider.querySelector(
              ".product-recommendations__wrapper",
            );
            const slides = slider.querySelectorAll(
              ".product-recommendations__item",
            );

            slider.classList.add("swiper");
            if (sliderWrapper) sliderWrapper.classList.add("swiper-wrapper");

            if (slides.length > 1) {
              slides.forEach((slide) => {
                slide.classList.add("swiper-slide");
              });
            }
          };

          const removeClasses = (slider) => {
            const sliderWrapper = slider.querySelector(
              ".product-recommendations__wrapper",
            );
            const slides = slider.querySelectorAll(
              ".product-recommendations__item",
            );

            slider.classList.remove("swiper");
            if (sliderWrapper) sliderWrapper.classList.remove("swiper-wrapper");

            if (slides.length > 0) {
              slides.forEach((slide) => {
                slide.removeAttribute("style");
                slide.classList.remove("swiper-slide");
              });
            }
          };

          const initSlider = () => {
            const section = this?.closest("section");
            const slider = section?.querySelector(".swiper--recomend-products");
            if (!slider) return;

            if (slider.classList.contains("swiper-initialized")) return;

            addClasses(slider);
            const numberColumns = slider.dataset.columnsMobile || 1;

            const paginationEl = slider.nextElementSibling?.querySelector(
              ".product-recommendations__pagination .swiper-pagination",
            );

            const inst = new Swiper(slider, {
              loop: false,
              breakpoints: {
                320: { slidesPerView: Number(numberColumns), spaceBetween: 24 },
                576: { slidesPerView: 2, spaceBetween: 24 },
                990: { slidesPerView: 3, spaceBetween: 24 },
                1100: { slidesPerView: 4, spaceBetween: 24 },
              },
              navigation: {
                nextEl: slider.querySelector(`.swiper-button-next`),
                prevEl: slider.querySelector(`.swiper-button-prev`),
              },
              pagination: {
                el: paginationEl,
                type: "bullets",
                clickable: true,
              },
              on: {
                slideChange() {
                  this.pagination?.update();
                },
              },
            });

            slider._swiperInstance = inst;
          };

          const initComplementarySlider = () => {
            const section = this?.closest("section");
            const slider = section?.querySelector(
              ".swiper--complementary-products",
            );
            if (!slider) return;

            const id = section.id;

            if (slider) {
              addClasses(slider);
              const numberColumns = slider.dataset.columnsMobile || 1;

              new Swiper(slider, {
                loop: false,
                slidesPerView: Number(numberColumns),
                spaceBetween: 16,
                breakpoints: {
                  576: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  990: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                  },
                  1100: {
                    slidesPerView: 4,
                    spaceBetween: 16,
                  },
                },
                navigation: {
                  nextEl: document.querySelector(
                    `#${id} .swiper--complementary-products ~ .swiper-button-next`,
                  ),
                  prevEl: document.querySelector(
                    `#${id} .swiper--complementary-products ~ .swiper-button-prev`,
                  ),
                },
                pagination: {
                  el: slider.querySelector(`.swiper-pagination`),
                  clickable: true,
                },
              });

              function adjustButtonPosition(height) {
                document
                  .querySelectorAll(".complementary-products .swiper-button")
                  .forEach((button) => {
                    button.style.top = height / 2 + "px";
                  });
              }

              function changePosition() {
                if (window.innerWidth < 1100) return;

                const image = document.querySelector(
                  ".complementary-products .img_tag",
                );

                if (image && slider.swiper) {
                  if (image.tagName === "IMG") {
                    if (image.complete) {
                      adjustButtonPosition(image.offsetHeight);
                    } else {
                      image.addEventListener("load", function () {
                        adjustButtonPosition(this.offsetHeight);
                      });
                    }
                  } else if (image.tagName === "svg") {
                    const height = image.getBoundingClientRect().height;
                    adjustButtonPosition(height);
                  }
                }
              }

              changePosition();

              document.addEventListener("shopify:section:load", changePosition);

              let resizeTimeout;
              window.addEventListener("resize", function () {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(changePosition, 100);
              });
            }
          };

          const destroySlider = () => {
            const slider = this.querySelector(".swiper--recomend-products");

            if (slider) {
              removeClasses(slider);
            }
          };

          const initSection = () => {
            const resizeObserver = new ResizeObserver((entries) => {
              const [entry] = entries;

              if (entry.contentRect.width < 990) {
                initSlider();
              } else {
                destroySlider();
              }
            });

            resizeObserver.observe(this);
          };

          initSection();
          initComplementarySlider();
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          if (this.querySelector(".product-recommendations__loading")) {
            this.querySelector(
              ".product-recommendations__loading",
            ).classList.remove("loading");
            this.querySelector(".product-recommendations__loading").remove();
          }
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: "0px 0px 200px 0px",
    }).observe(this);
  }
}

customElements.define("product-recommendations", ProductRecommendations);

class LocalizationForm extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      input: this.querySelector(
        'input[name="locale_code"], input[name="country_code"]',
      ),
      button: this.querySelector("button"),
      panel: this.querySelector("ul"),
    };
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.elements.button.addEventListener("click", this.togglePanel.bind(this));
    this.addEventListener("keydown", this.onEscapePress.bind(this));

    this.querySelectorAll("a").forEach((item) =>
      item.addEventListener("click", this.onItemClick.bind(this)),
    );
  }

  connectedCallback() {
    document.addEventListener("click", this.handleDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleDocumentClick);
  }

  handleDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.hidePanel();
    }
  }

  hidePanel() {
    this.elements.button.setAttribute("aria-expanded", "false");
    this.elements.panel.setAttribute("hidden", true);
  }

  showPanel() {
    this.elements.button.setAttribute("aria-expanded", "true");
    this.elements.panel.removeAttribute("hidden");
  }

  togglePanel() {
    if (this.elements.button.getAttribute("aria-expanded") === "true") {
      this.hidePanel();
    } else {
      this.showPanel();
    }
  }

  onEscapePress(event) {
    if (event.key === "Escape") {
      this.hidePanel();
    }
  }

  onItemClick(event) {
    event.preventDefault();
    this.elements.input.value = event.currentTarget.dataset.value;
    this.querySelector("form")?.submit();
    this.hidePanel();
  }
}

customElements.define("localization-form", LocalizationForm);

(function () {
  const initHeaderOverlay = () => {
    const main = document.getElementById("MainContent");
    const sections = main.querySelectorAll(".shopify-section");

    if (sections.length > 0) {
      const sectionFirstChild = sections[0].querySelector(
        "[data-header-overlay]",
      );
      const headerGroupSections = document.querySelectorAll(
        ".shopify-section-group-header-group",
      );
      const header = document.querySelector(".shopify-section-header");
      const breadcrumbs = document.querySelector("body > .breadcrumbs-wrapper");

      if (sectionFirstChild) {
        if (headerGroupSections[headerGroupSections.length - 1] === header) {
          sections[0].classList.add("section--has-overlay");
          header.classList.add("color-background-overlay");
          header.classList.add("header--has-overlay");
          if (breadcrumbs) breadcrumbs.classList.add("color-background-2");
        } else {
          sections[0].classList.remove("section--has-overlay");
          header.classList.remove("color-background-overlay");
          header.classList.remove("header--has-overlay");
          if (breadcrumbs) breadcrumbs.classList.remove("color-background-2");
        }
      } else {
        sections[0].classList.remove("section--has-overlay");
        header.classList.remove("color-background-overlay");
        header.classList.remove("header--has-overlay");
        if (breadcrumbs) breadcrumbs.classList.remove("color-background-2");
      }
    }
  };

  initHeaderOverlay();

  document.addEventListener("shopify:section:load", initHeaderOverlay);
  document.addEventListener("shopify:section:unload", initHeaderOverlay);
  document.addEventListener("shopify:section:reorder", initHeaderOverlay);
})();

function wrapLettersInSpans(rootNode) {
  if (!rootNode || rootNode.nodeType !== Node.ELEMENT_NODE) return;
  if (rootNode.querySelector(".anim-char") !== null) return;

  let globalIndex = 1;

  const wrapText = (text) => {
    const fragment = document.createDocumentFragment();
    const parts = text.split(/(\s+)/);

    parts.forEach((part, idx) => {
      if (/^\s+$/.test(part)) {
        const emptySpan = document.createElement("span");
        emptySpan.className = "empty-char";
        emptySpan.textContent = part;
        fragment.appendChild(emptySpan);
      } else {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";

        [...part].forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.className = "anim-char";
          charSpan.textContent = char;
          charSpan.dataset.index = globalIndex++;
          charSpan.style.opacity = "0";
          wordSpan.appendChild(charSpan);
        });

        fragment.appendChild(wordSpan);
      }
    });

    return fragment;
  };

  const processNode = (node) => {
    const fragment = document.createDocumentFragment();

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        fragment.appendChild(wrapText(child.textContent));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName.toLowerCase() === "svg") {
          fragment.appendChild(child.cloneNode(true));
        } else {
          const newEl = child.cloneNode(false);
          const inner = processNode(child);
          newEl.appendChild(inner);
          fragment.appendChild(newEl);
        }
      }
    });

    return fragment;
  };

  const newContent = processNode(rootNode);
  rootNode.innerHTML = "";
  rootNode.appendChild(newContent);
}

const animateHeading = (container, trimWords = false) => {
  if (document.querySelector(".shopify-design-mode") !== null) return;
  if (!container || container.dataset.animation !== "true") return;
  const heading = container.querySelector(".animated-heading");
  const inner = container.querySelector(".animated-heading--inner");
  if (!heading || !inner) return;
  const originalText = inner.innerHTML;
  const animationSpeed = parseInt(heading.dataset.speed) || 30;
  if (trimWords) {
    const words = originalText.split(/\s+/);
    if (words.length > 10) {
      inner.textContent = words.slice(0, 10).join(" ");
    }
  }
  heading.style.opacity = "0";
  if (heading.querySelector(".anim-char") == null) {
    heading.childNodes.forEach((node) => {
      if (
        !(
          node.nodeType === 1 &&
          node.classList.contains("heading-animation--inner")
        )
      ) {
        node.remove();
      }
    });
  }
  heading.style.opacity = "1";
  inner.style.opacity = "0";
  const startAnimation = () => {
    if (container._animationTimers)
      container._animationTimers.forEach(clearTimeout);
    container._animationTimers = [];
    inner.innerHTML = originalText;
    wrapLettersInSpans(inner);
    inner.style.opacity = "1";
    inner.querySelectorAll("strong").forEach((markedBlock) => {
      markedBlock.classList.add("anim-svg");
      const markedBlockChars = markedBlock.querySelectorAll(".anim-char");
      if (!markedBlockChars.length) return;
      const innerChars = inner.querySelectorAll(".anim-char");
      const firstChar = markedBlockChars[0];
      const lastCharIndex = innerChars.length - 1;
      markedBlock.style = `--anim-start: ${
        lastCharIndex * animationSpeed
      }ms; --anim-end: ${lastCharIndex * animationSpeed + 2000}ms;`;
      if (markedBlock.querySelector(".icon-marked")) return;
      markedBlock.insertAdjacentHTML(
        "beforeend",
        `
					<svg class="icon-marked" width="210" height="33" viewBox="0 0 210 33" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
						<path d="M4 12.0784C29.7259 7.85492 106.065 0.674986 205.616 5.74318" stroke="currentColor" stroke-width="7.4" stroke-linecap="round"/>
						<path d="M59.7599 24.4521C78.0438 19.6732 132.76 9.29397 205.356 6.0078" stroke="currentColor" stroke-width="7.4" stroke-linecap="round"/>
						<path d="M60.3652 24.3647C78.5022 21.5942 114.31 16.7455 182.694 26.354" stroke="currentColor" stroke-width="7.4" stroke-linecap="round"/>
					</svg>
				`,
      );
    });

    const spans = inner.querySelectorAll(".anim-char");
    spans.forEach((span) => {
      span.style.opacity = "0";
      const delay = parseInt(span.dataset.index) * animationSpeed;
      const timer = setTimeout(() => {
        span.style.opacity = "1";
      }, delay);
      container._animationTimers.push(timer);
    });
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        startAnimation();
        obs.unobserve(container);
      }
    },
    { threshold: 0.01 },
  );
  observer.observe(container);
};

const centerBreadcrumbs = (selector) => {
  if (
    document.querySelector(selector) != null &&
    document.getElementById("breadcrumbs") != null
  ) {
    document.getElementById("breadcrumbs").classList.add("centered");
  }
};

(function () {
  const searchPromo = () => {
    $(".search__inner-page").each(function () {
      if ($(this).hasClass("slider_started")) {
        return "";
      }

      $(this).addClass("slider_started");
      let id = $(this).attr("id");

      let prodSwiperParams = {
        loop: false,
        allowTouchMove: true,
        slidesPerView: 1,
        lazy: true,
        preloadImages: false,
        spaceBetween: 14,
        navigation: {
          nextEl: `#${id} .swiper-button-next`,
          prevEl: `#${id} .swiper-button-prev`,
        },
        pagination: {
          el: `#${id} .swiper-pagination`,
          clickable: true,
        },
        breakpoints: {
          450: {
            slidesPerView: 2,
          },
          750: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
        },
      };

      let initProductCarouselSliders = new Swiper(
        `#${id} .product-carousel-swiper`,
        prodSwiperParams,
      );

      synchronizeWithTabs(initProductCarouselSliders);
    });
  };

  searchPromo();
  centerBreadcrumbs(".shopify-policy__container");

  document.addEventListener("shopify:section:load", searchPromo);
  document.addEventListener("shopify:section:unload", searchPromo);
  document.addEventListener("shopify:section:reorder", searchPromo);
})();

function formatMoney(cents, format = "") {
  if (typeof cents === "string") {
    cents = cents.replace(".", "");
  }
  let value = "";
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || theme.moneyFormat;

  function formatWithDelimiters(
    number,
    precision = 2,
    thousands = ",",
    decimal = ".",
  ) {
    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    const parts = number.split(".");
    const dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`,
    );
    const centsAmount = parts[1] ? decimal + parts[1] : "";

    return dollarsAmount + centsAmount;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

function selectDropDown() {
  const closeDropdowns = (exceptElement = null) => {
    document
      .querySelectorAll(".dropdown-select .select-wrapper.active")
      .forEach((el) => {
        if (el !== exceptElement) {
          el.classList.remove("active");
        }
      });
  };

  // Prevent duplicate init
  if (document.dropdownInitialized) return;
  document.dropdownInitialized = true;

  document.addEventListener("click", function (e) {
    const label = e.target.closest(".dropdown-select .select-label");
    const listItem = e.target.closest(".dropdown-select ul li");

    // Close all if clicked outside
    if (!label && !listItem) {
      closeDropdowns();
      return;
    }

    // Toggle dropdown
    if (label) {
      e.stopPropagation();

      const dropdown = label.closest(".dropdown-select");
      const wrapper = dropdown.querySelector(".select-wrapper");

      const isActive = wrapper.classList.contains("active");

      closeDropdowns(isActive ? null : wrapper);

      wrapper.classList.toggle("active", !isActive);
    }

    // Select option
    if (listItem) {
      e.stopPropagation();

      const dropdown = listItem.closest(".dropdown-select");
      const wrapper = dropdown.querySelector(".select-wrapper");
      const selectedText = dropdown.querySelector(".select-label span");

      if (selectedText) {
        selectedText.textContent = listItem.dataset.value;
      }

      wrapper.classList.remove("active");

      const radioInput = listItem.querySelector("input[type='radio']");

      if (radioInput) {
        radioInput.checked = true;
        radioInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  selectDropDown();
  document.addEventListener("shopify:section:load", function (e) {
    selectDropDown();
  });
});

(function () {
  let image = document.querySelectorAll(".data-alt img");
  image &&
    image.forEach((img, index) => {
      img.alt = "Video background";
    });
})();

document.documentElement.addEventListener("cart:refresh", () => {
  const sectionsToUpdate = [
    { id: "cart-count-bubble", selector: "#cart-icon-bubble" },
    { id: "cart-drawer", selector: "#CartDrawer" },
    { id: "main-cart-items", selector: ".cart-items-wrapper" },
    { id: "main-cart-footer", selector: ".cart__footer" },
    { id: "main-cart-shipping", selector: ".cart-shipping" },
  ];

  sectionsToUpdate.forEach((section) => {
    fetch(`${routes.cart_url}?section_id=${section.id}`)
      .then((response) => response.text())
      .then((html) => {
        const parsedHTML = new DOMParser().parseFromString(html, "text/html");
        const sourceSection = parsedHTML.querySelector(section.selector);
        const destinationSection = document.querySelector(section.selector);
        if (sourceSection && destinationSection) {
          destinationSection.innerHTML = sourceSection.innerHTML;
        }
      })
      .catch((e) => console.error(`Error updating ${section.id}:`, e));
  });
});

// CART REFRESH EVENT END
// -----------------------------------------------------------------------------
