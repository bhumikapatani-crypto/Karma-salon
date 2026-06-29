class ProductCardVariantSwatches {
  constructor() {
    this.init();
  }

  init() {
    this.setupSwatchListeners();
  }

  setupSwatchListeners() {
    document.addEventListener('click', (e) => {
      const swatchButton = e.target.closest('.product-card-swatch');
      if (swatchButton) {
        e.preventDefault();
        e.stopPropagation();
        this.handleSwatchClick(swatchButton);
        return;
      }

      const showMoreButton = e.target.closest('.swatch-show-more');
      if (showMoreButton) {
        e.preventDefault();
        e.stopPropagation();
        this.handleShowMore(showMoreButton);
        return;
      }
    });
  }

  handleShowMore(button) {
    const swatchContainer = button.closest('.product-card-swatches');
    if (!swatchContainer) return;

    // Show all hidden swatches
    const hiddenSwatches = swatchContainer.querySelectorAll('.swatch-hidden');
    hiddenSwatches.forEach(swatch => {
      swatch.classList.remove('swatch-hidden');
    });

    // Hide the show more button
    button.style.display = 'none';
  }

  handleSwatchClick(button) {
    const variantImage = button.getAttribute('data-variant-image');
    const variantId = button.getAttribute('data-variant-id');
    const variantUrl = button.getAttribute('data-variant-url');
    const variantTitle = button.getAttribute('data-variant-title');
    
    const cardWrapper = button.closest('.card-wrapper');
    if (!cardWrapper) {
      return;
    }

    // Update Image
    if (variantImage && variantImage !== "") {
      this.updateCardImage(cardWrapper, variantImage);
    }

    // Update Variant ID in Quick Add Form
    if (variantId) {
      const variantInput = cardWrapper.querySelector('input[name="id"]');
      if (variantInput) {
        variantInput.value = variantId;
        variantInput.removeAttribute('disabled');
      }
    }

    // Update Product Title and Link
    const titleLink = cardWrapper.querySelector('.card__title a');
    if (titleLink) {
      if (variantTitle) titleLink.textContent = variantTitle;
      if (variantUrl) titleLink.href = variantUrl;
    }

    // Update Overlay Links
    const overlayLinks = cardWrapper.querySelectorAll('.js-color-swatches-link');
    overlayLinks.forEach(link => {
      if (variantUrl) link.href = variantUrl;
    });

    this.setActiveState(button);
  }

  updateCardImage(cardWrapper, imageUrl) {
    // Fix URL if it's missing protocol
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    }
    
    // Decode HTML entities in URL
    const textarea = document.createElement('textarea');
    textarea.innerHTML = imageUrl;
    imageUrl = textarea.value;
    
    // Find all images in the media container
    const mediaContainer = cardWrapper.querySelector('.media');
    if (!mediaContainer) {
      return;
    }

    const allImages = mediaContainer.querySelectorAll('img');
    const mainImage = allImages[0]; // First image
    const secondaryImage = allImages[1]; // Second image (hover)
    
    if (!mainImage) {
      return;
    }

    // Store original image if not already stored
    if (!cardWrapper.dataset.originalImage) {
      cardWrapper.dataset.originalImage = mainImage.src;
    }

    // Update main image immediately
    mainImage.src = imageUrl;
    mainImage.srcset = '';
    
    // Force image reload animation/effect
    mainImage.style.opacity = '0';
    setTimeout(() => {
      mainImage.style.opacity = '1';
    }, 50);
    
    // Hide secondary image permanently when variant is selected
    if (secondaryImage) {
      secondaryImage.style.display = 'none';
    }

    // Mark that variant has been selected
    cardWrapper.dataset.variantSelected = 'true';
  }

  setActiveState(button) {
    const cardWrapper = button.closest('.card-wrapper');
    if (!cardWrapper) return;

    // Remove active class from all swatches in this card
    const swatches = cardWrapper.querySelectorAll('.product-card-swatch');
    swatches.forEach(swatch => swatch.classList.remove('active'));

    // Add active class to clicked swatch
    button.classList.add('active');
  }
}

// Initialize once
if (!window.productCardVariantSwatchesInitiated) {
  window.productCardVariantSwatchesInitiated = true;
  new ProductCardVariantSwatches();
}
