class AnnouncementBar {
  constructor(section) {
    this.section = section;
    this.announcementBar = section.querySelector(".announcement-bar.swiper");
    
    this.currentScrollTop = 0;

    if (this.announcementBar) {
      this.initSwiper();
    }

    this.onScrollHandler = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScrollHandler, false);
  }

  initSwiper() {
    const speed = this.announcementBar.dataset.speed * 1000;
    const delay = this.announcementBar.dataset.delay * 1000;

    new Swiper(this.announcementBar, {
      direction: "vertical",
      loop: true,
      autoplay: {
        delay: delay,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 0,
      speed: speed,
    });
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const stickyType = this.announcementBar.dataset.stickyType;
    const headerWrapper = document.querySelector('.shopify-section-header');
    const stickyHeader = headerWrapper.querySelector('sticky-header');
    
    const headerStickyMode = stickyHeader ? stickyHeader.dataset.stickyType : null;
    
    if(stickyType ==='always') {
      this.section.classList.add('is-visible'); 
      if (scrollTop > this.currentScrollTop) {
        this.section.classList.remove('info-bar');
        if(headerStickyMode != null){
          this.section.classList.add('scroll-down');
          this.section.classList.remove('scroll-up');
        }else {
          this.section.classList.add('scroll-down-top');
          this.section.classList.remove('scroll-up-top');
        }
      }else {
         if (window.scrollY <= headerWrapper.offsetHeight){
           this.section.classList.add('info-bar');
         }else {
           this.section.classList.remove('info-bar');
         }
         if(headerStickyMode != null){
          if(headerWrapper ) {
            if (window.scrollY <= headerWrapper.offsetHeight){
              headerWrapper.classList.add('set-info-top');
            }else {
              headerWrapper.classList.remove('set-info-top');
            }
          }
          this.section.classList.add('scroll-up');
          this.section.classList.remove('scroll-down');
          if(headerStickyMode ==='always') {
            this.section.classList.add('show-header');
          }else {
            this.section.classList.remove('show-header');
          }
        }else {
          if(headerWrapper){
            if (window.scrollY <= headerWrapper.offsetHeight) {
              this.section.classList.add('top-zero');
              headerWrapper.classList.add('is-first');
            }else {
              this.section.classList.remove('top-zero');
              headerWrapper.classList.remove('is-first');
            }
          }
          this.section.classList.add('scroll-up-top');
          this.section.classList.remove('scroll-down-top');
        }
        
        this.reveal();
      }
    }

    if (stickyType === 'on-scroll-up') {
      if (scrollTop > this.currentScrollTop) {
          this.section.classList.remove('info-bar');
          if(headerStickyMode != null){
            this.section.classList.add('scroll-down');
            this.section.classList.remove('scroll-up');
          }else {
            this.section.classList.add('scroll-down-top');
            this.section.classList.remove('scroll-up-top');
          }
          this.hide();
        } else {
          if (window.scrollY <= headerWrapper.offsetHeight){
            this.section.classList.add('info-bar');
          }else {
            this.section.classList.remove('info-bar');
          }
          if(headerStickyMode != null){
            if(headerWrapper ) {
              if (window.scrollY <= headerWrapper.offsetHeight){
                headerWrapper.classList.add('set-info-top');
              }else {
                headerWrapper.classList.remove('set-info-top');
              }
            }
            this.section.classList.add('scroll-up');
            this.section.classList.remove('scroll-down');
          }else {
            if(headerWrapper){
              if (window.scrollY <= headerWrapper.offsetHeight) {
                this.section.classList.add('top-zero');
                headerWrapper.classList.add('is-first');
              }else {
                this.section.classList.remove('top-zero');
                headerWrapper.classList.remove('is-first');
              }
            }
            this.section.classList.add('scroll-up-top');
            this.section.classList.remove('scroll-down-top');
          }
          this.reveal();
        }
    }

    this.currentScrollTop = scrollTop;
  }

  updateHeight() {
    const height = this.section.offsetHeight;
    document.documentElement.style.setProperty('--announcement-height', `${height}px`);
  }

  reveal() {
    this.updateHeight();
    this.section.classList.add('is-visible');
    this.section.classList.remove('is-hidden');
  }

  hide() {
    this.section.classList.add('is-hidden');
    this.section.classList.remove('is-visible');
  }

  reset() {
    this.section.classList.remove('is-hidden', 'is-visible');
  }
}


// --- INITIALIZATION ---
const initAnnouncement = (container) => {
  
  const section = container.querySelector('.section-announcement');
  if (section && !section.dataset.initialized) {
    new AnnouncementBar(section);
    section.dataset.initialized = true; 
  }
};

initAnnouncement(document);

document.addEventListener("shopify:section:load", (event) => {
  initAnnouncement(event.target);
});

