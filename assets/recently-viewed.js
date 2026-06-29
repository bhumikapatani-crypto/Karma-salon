(function () {
    // Helper function to safely check if localStorage is available and accessible
    const isLocalStorageAvailable = () => {
      try {
        if (typeof Storage === 'undefined' || typeof localStorage === 'undefined') {
          return false;
        }
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    };

    // Helper function to safely get from localStorage
    const safeGetItem = (key) => {
      try {
        if (!isLocalStorageAvailable()) {
          return null;
        }
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    };

    const initPopularProducts = (section) => {
          const $section = $(section);
  
          if ($section.hasClass("slider_started")) {
              return;
          }
  
          $section.addClass("slider_started");
  
          let id = $section.attr("id");
          let slideEl = $section.find(".swiper-wrapper");
          let productCount = parseInt(slideEl.data("count"));
          let productCountMobile = parseInt(slideEl.data("count-mobile"));
  
          let prodSwiperParams = {
              loop: false,
              autoHeight: false,
              allowTouchMove: true,
              slidesPerView: productCount,
              lazy: true,
              preloadImages: false,
              spaceBetween: 24,
              navigation: {
                  nextEl: `#${id} .swiper-button-next`,
                  prevEl: `#${id} .swiper-button-prev`,
              },
              watchSlidesProgress: true,
              preventInteractionOnTransition: true,
              mousewheel: {
                  forceToAxis: true,
              },
          };
  
          let swiper = new Swiper(
              `#${id} .product-carousel-swiper`,
              prodSwiperParams
          );
  
          swiper.on("resize", function () {
              const w = window.innerWidth;
  
              if (productCount === 6) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile :
                      w < 750 ? 2 :
                      w < 1100 ? 3 :
                      w < 1360 ? 4 :
                      w < 1600 ? 5 : 6;
  
              } else if (productCount === 5) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile :
                      w < 750 ? 2 :
                      w < 1100 ? 3 :
                      w < 1360 ? 4 : 5;
  
              } else if (productCount === 4) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile :
                      w < 750 ? 2 :
                      w < 1100 ? 3 : 4;
  
              } else if (productCount === 3) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile :
                      w < 750 ? 2 : 3;
  
              } else if (productCount === 2) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile : 2;
              }
          });
    };
  
    const initSection = async (section, retryCount = 0) => {
      if (!section || !section?.classList.contains("recently-viewed-section")) {
        return;
      }
  
      const box = section.querySelector(".recently-viewed");
      if (!box) return;

      // If products are already shown from server-side render, initialize Swiper and skip localStorage logic
      const hasProductsInDOM = box.querySelector('.swiper-slide .collection-product-card');
      if (box.classList.contains("recently-viewed--has-products") && hasProductsInDOM) {
        box.classList.remove("recently-viewed--loading");
        box.classList.remove("recently-viewed--empty");
        setTimeout(() => {
          initPopularProducts(section);
        }, 50);
        try {
          colorSwatches();
        } catch (err) {
          // Ignore color swatches error
        }
        return;
      }

      // In edit mode, still try to load products from localStorage (don't skip the logic)
      // The data-edit-mode attribute is just for reference, not to skip functionality
  
      const STORAGE_KEY = "__sf_theme_recently";
      const EXPIRATION_DAYS = box.dataset.expirationDays
        ? Number(box.dataset.expirationDays)
        : 30;
      const dateNow = Date.now();
  
      const baseUrl = box.dataset.baseUrl;
      const productsLimit = Number(box.dataset.productsLimit) || 6;
      const currentPageProductId = box.dataset.currentPageProductId;
  
      // get recent products from local storage
      let recentProducts = [];
      try {
        const stored = safeGetItem(STORAGE_KEY);
        if (stored) {
          recentProducts = JSON.parse(stored);
        }
      } catch (e) {
        // Handle JSON parse errors
        recentProducts = [];
      }
  
      if (currentPageProductId) {
        recentProducts = recentProducts.filter(
          (item) => item.productId !== currentPageProductId
        );
      }
  
      // If storage is empty and we're on a product page, wait a bit for main-product script to save
      if (recentProducts.length === 0 && currentPageProductId && retryCount < 2) {
        setTimeout(() => {
          initSection(section, retryCount + 1);
        }, 100);
        return;
      }
  
      if (recentProducts.length === 0) {
        box.classList.remove("recently-viewed--loading");
        box.classList.add("recently-viewed--empty");
        return;
      }
  
      // filter by expiration time
      const expirationTime = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
      const validProducts = recentProducts.filter(
        (item) => dateNow - item.timestamp < expirationTime
      );

      // limit by section setting
      const limitedProducts = validProducts.slice(0, productsLimit);

      // check if we have valid products after filtering
      if (limitedProducts.length === 0 || !limitedProducts.some((item) => item.productId)) {
        box.classList.remove("recently-viewed--loading");
        box.classList.add("recently-viewed--empty");
        return;
      }

      // get url with query
      const query = limitedProducts
        .filter((item) => item.productId)
        .map((item) => `id:${item.productId}`)
        .join("%20OR%20");
      
      // ensure query is not empty
      if (!query || query.trim() === "") {
        box.classList.remove("recently-viewed--loading");
        box.classList.add("recently-viewed--empty");
        return;
      }
      
      const url = `${baseUrl}&q=${query}`;
  
      try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const sourceBox = doc?.querySelector(".recently-viewed");
        if (!sourceBox?.classList.contains("recently-viewed--search-perfomed")) {
          box.classList.add("recently-viewed--empty");
          return;
        }
        box.innerHTML = sourceBox.innerHTML;
  
        initPopularProducts(section);
        try {
          colorSwatches();
        } catch (err) {
  
              }
      } catch (error) {
        box.classList.add("recently-viewed--empty");
      } finally {
        box.classList.remove("recently-viewed--loading");
      }
    };
  
    // Initialize function - find section by class (works in all modes)
    const initializeSection = () => {
      const section = document.querySelector(".recently-viewed-section");
      if (section) {
        initSection(section);
      }
    };

    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeSection);
    } else {
      // Use setTimeout to ensure DOM is fully ready
      setTimeout(initializeSection, 0);
    }

    // Listen for section load events (theme editor)
    document.addEventListener("shopify:section:load", function (event) {
      initSection(event.target);
    });

    // Also listen for section select events in theme editor
    document.addEventListener("shopify:section:select", function (event) {
      const section = event.target;
      if (section && section.classList.contains("recently-viewed-section")) {
        initSection(section);
      }
    });

    // Listen for storage changes to update the section when products are added
    // Only add listener if localStorage is available
    if (isLocalStorageAvailable()) {
      try {
        window.addEventListener("storage", function (event) {
          if (event.key === "__sf_theme_recently") {
            const section = document.querySelector(".recently-viewed-section");
            if (section) {
              initSection(section);
            }
          }
        });
      } catch (e) {
        // Storage listener not available
      }
    }

    // Also listen for custom event in case storage is updated in same window
    document.addEventListener("recentlyViewedUpdated", function () {
      const section = document.querySelector(".recently-viewed-section");
      if (section) {
        initSection(section);
      }
    });
  })();