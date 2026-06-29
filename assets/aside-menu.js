(function () {
  const initAsideMenu = () => {
    const header = document.querySelector(".header-wrapper");
    const asideMenu = document.querySelector(".aside-menu");
    const openAsideMenuBtn = document.querySelector(".aside-menu__toggle--open-btn");
    const closeMenuBtn = document.querySelector(".aside-menu__toggle--full-close-btn");
    const asideMenuOverlay = document.querySelector(".aside-menu__overlay");

    if (!asideMenu || !openAsideMenuBtn) return;

    let globalLeaveTimeout;
    let isTransitioning = false;

    const closeAllLevels = () => {
      const activeItems = asideMenu.querySelectorAll(".first_level_details.active, .second_level_details.active");
      activeItems.forEach((item) => {
        item.classList.remove("active");
        item.classList.add("hiding");
        setTimeout(() => item.classList.remove("hiding"), 800);
      });
    };

    const openAsideMenu = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (asideMenu.classList.contains("aside-menu--open")) return;
      clearTimeout(globalLeaveTimeout);
      isTransitioning = true;
      if (header) header.preventHide = true;
      asideMenu.classList.add("aside-menu--open");
      asideMenuOverlay.classList.add("aside-menu__overlay--active");
      document.body.classList.add("overflow-hidden-aside");
      setTimeout(() => { isTransitioning = false; }, 400);
    };

    const closeAsideMenu = (e) => {
      if (isTransitioning) return;
      if (e && e.preventDefault) e.preventDefault();
      asideMenu.classList.remove("aside-menu--open");
      asideMenuOverlay.classList.remove("aside-menu__overlay--active");
      document.body.classList.remove("overflow-hidden-aside");
      closeAllLevels();
      if (header) header.preventHide = false;
    };

    const menuTriggerSetting = asideMenu.dataset.menuTrigger || "click";
    const useHover = menuTriggerSetting === "hover";

    if (useHover) {
      openAsideMenuBtn.addEventListener("mouseenter", openAsideMenu);
      openAsideMenuBtn.addEventListener("mouseleave", () => {
        globalLeaveTimeout = setTimeout(closeAsideMenu, 300);
      });
    } else {
      openAsideMenuBtn.addEventListener("click", openAsideMenu);
    }

    asideMenu.addEventListener("click", (e) => {
      const target = e.target;

      if (target.closest(".aside-menu__toggle--close-btn") || target.closest(".aside-menu__toggle--full-close-btn") || target === asideMenuOverlay) {
        if (target === asideMenuOverlay && isTransitioning) return;
        
        const parentActive = target.closest(".active");
        if (parentActive && !target.closest(".aside-menu__top_main")) {
          e.stopPropagation();
          parentActive.classList.remove("active");
          parentActive.classList.add("hiding");
          parentActive.querySelectorAll(".active").forEach(child => {
             child.classList.remove("active");
             child.classList.add("hiding");
          });
          setTimeout(() => parentActive.classList.remove("hiding"), 800);
        } else {
          closeAsideMenu(e);
        }
        return;
      }

      const trigger = target.closest(".menu-trigger");
      if (trigger && !useHover) {
        e.preventDefault();
        e.stopPropagation();

        const currentItem = trigger.closest(".first_level_details, .second_level_details");
        if (!currentItem) return;

        const isActive = currentItem.classList.contains("active");
        const isFirstLevel = currentItem.classList.contains("first_level_details");

        if (isFirstLevel) {
          document.querySelectorAll(".first_level_details.active").forEach((other) => {
            if (other !== currentItem) {
              other.classList.remove("active");
              other.classList.add("hiding");
              other.querySelectorAll(".active").forEach(sub => sub.classList.remove("active"));
              setTimeout(() => other.classList.remove("hiding"), 800);
            }
          });
        } else {
          const parentSubmenu = currentItem.closest(".aside-menu__inner-submenu");
          if (parentSubmenu) {
             parentSubmenu.querySelectorAll(".second_level_details.active").forEach((other) => {
                if (other !== currentItem) {
                  other.classList.remove("active");
                  other.classList.add("hiding");
                  setTimeout(() => other.classList.remove("hiding"), 800);
                }
             });
          }
        }

        if (!isActive) {
          currentItem.classList.add("active");
        } else {
          currentItem.classList.remove("active");
          currentItem.classList.add("hiding");
          setTimeout(() => currentItem.classList.remove("hiding"), 800);
        }
      }
    });

    if (useHover) {
      asideMenu.addEventListener("mouseenter", (e) => {
        const item = e.target.closest(".first_level_details, .second_level_details");
        if (item) {
          clearTimeout(globalLeaveTimeout);
          item.classList.add("active");
        }
        if (e.target === asideMenu) clearTimeout(globalLeaveTimeout);
      }, true);

      asideMenu.addEventListener("mouseleave", (e) => {
        const item = e.target.closest(".first_level_details, .second_level_details");
        if (item) {
          setTimeout(() => {
            if (!item.matches(':hover')) {
              item.classList.remove("active");
              item.classList.add("hiding");
              setTimeout(() => item.classList.remove("hiding"), 800);
            }
          }, 150);
        }
        if (e.target === asideMenu) {
          globalLeaveTimeout = setTimeout(closeAsideMenu, 300);
        }
      }, true);

      if (asideMenuOverlay) {
        asideMenuOverlay.addEventListener("mouseenter", () => {
          if (!isTransitioning) closeAsideMenu();
        });
      }
    }

    asideMenuOverlay.addEventListener("click", closeAsideMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeAsideMenu);

    asideMenu.addEventListener("keydown", (e) => {
      if (e.code === "Escape") closeAsideMenu(e);
    });
  };

  document.addEventListener("shopify:section:load", initAsideMenu);
  initAsideMenu();
})();