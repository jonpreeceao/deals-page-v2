import axios from 'axios';
import { AoProduct } from '../../js/utils/ao-product';
import { debounce } from '../../js/utils/general-utils';
import Breakpoint from '../../js/utils/breakpoint';
import translator, { namespacedTranslator } from '../../js/utils/translator';
import translations from './translations';
import { getLanguageCode, isInStock } from './utils';

let lang = document.head.getAttribute('lang');
const langCode = getLanguageCode(lang);
const getTranslation = namespacedTranslator('translations');

lang = lang === 'en' ? 'en-GB' : lang;
translator.set('translations', translations);
translator.setLang(lang);

const aoProduct = new AoProduct(langCode);

function setTitle(productEl, productData) {
  const titleEl = productEl.querySelector('[data-product-title]');
  if (titleEl && !titleEl.innerText) {
    titleEl.innerHTML = productData.Title;
  }
}

function setImage(productEl, productData) {
  const imageEl = productEl.querySelector('[data-product-image]');
  if (imageEl) {
    imageEl.src = productData.Image;
    if (!imageEl.getAttribute('alt')) {
      imageEl.setAttribute('alt', productData.Title);
    }
  }
}

function setPrice(productEl, productData) {
  const priceEl = productEl.querySelector('[data-product-price]');
  let pricePod = aoProduct.createPricePod(productData, true);
  if (priceEl) {
    priceEl.appendChild(pricePod);
  }
}

function setButton(productEl, productData) {
  const btnEl = productEl.querySelector('[data-product-cta]');
  if (btnEl) {
    if (!btnEl.href) {
      btnEl.href = productData.ProductUrl;
    }
    if (isInStock(productData) && !btnEl.innerText) {
      btnEl.innerText = getTranslation('shopNow'); // Override any existing button text
    } else {
      productEl.classList.add('is-out-of-stock'); // Styling hook in case
      btnEl.addEventListener('click', function(evt) {
        evt.preventDefault();
      });
      btnEl.innerText = getTranslation('outOfStock');
      btnEl.classList.add('disabled');
    }
  }
}

function setReview(productEl, productData) {
  if (productData.RatingValue > 0) {
    const reviewEl = productEl.querySelector('[data-product-review]');
    const reviewScore = reviewEl.querySelector('[data-product-review-score]');
    const reviewStars = reviewEl.querySelector('[data-product-review-stars]');

    // \xa0 == &nbsp;
    reviewScore.innerText = `${getTranslation('customerReview')} ${
      productData.RatingValue
    }\xa0/\xa05`;
    reviewStars.classList.add(`rating-sprite-${productData.Rating}`);
  }
}

/**
 * Remove any "unfound" products from the DOM
 *
 * @param {object} skuMap - object of product skus and their corresponding DOM element
 * @returns {integer} - number of found products
 */
function removeUnfoundProducts(skuMap) {
  let foundProductCount = 0;
  for (const key in skuMap) {
    if (!skuMap.hasOwnProperty(key)) {
      continue;
    }

    if (!skuMap[key].found) {
      const unfoundProduct = skuMap[key].element;
      unfoundProduct.parentNode.removeChild(unfoundProduct);
    } else {
      foundProductCount++;
    }
  }

  return foundProductCount;
}

/**
 * Calcualte how many products should be shown per slide
 *
 * @param {string} breakpoint - String key of the current breakpoint, e.g. "mobile", "tablet", "desktop", "uber"
 * @return {integer} - Number of products which should be shown per slide
 */
function calculateProductsPerSlide(breakpoint) {
  switch (breakpoint) {
    case 'mobile':
      return 1;
      break;
    case 'landscape':
    case 'tablet':
      return 2;
      break;
    case 'desktop':
      return 3;
      break;
    case 'uber':
      return 4;
      break;
    default:
      return 3;
      break;
  }
}

function updateStage(evt) {
  const productsPerSlide = calculateProductsPerSlide(
    this.breakpointEvent.value
  );
  const isOverflowing =
    productsPerSlide < this.productEls.length ? true : false;

  if (isOverflowing) {
    this.container.classList.add('is-overflowing');
  } else {
    this.container.classList.remove('is-overflowing');
  }
}

function setStatusLoading(container, loadingEl) {
  loadingEl.querySelector('.loading-content').innerHTML = getTranslation(
    'loading'
  );
  container.classList.add('is-loading');
}

function setStatusComplete(container, loadingEl) {
  container.classList.add('is-loaded');
  container.classList.remove('is-loading');

  setTimeout(() => {
    loadingEl.parentNode.removeChild(loadingEl);
  }, 300);
}

export default class AOXScroll {
  constructor(element) {
    this.setParams(element);
    if (this.productEls) {
      this.setupScroll();
    }
  }

  setParams(element) {
    if (element instanceof HTMLElement) {
      this.container = element;
    } else {
      throw new Error('AOXScroll expects a HTMLElement');
    }
    this.instanceId = AOXScroll.counter; // So we can reference individual instances by a unique ID. See https://stackoverflow.com/questions/36855063/how-to-implement-instance-counter-in-es6
    this.productsContainer = this.container.querySelector(
      '.products-container'
    );
    this.productEls = Array.from(
      this.container.querySelectorAll('[data-product-sku]')
    );
    this.loadingEl = this.container.querySelector('.loading-container');
    this.skus = [];
    this.skuToProductElMap = {};
    this.breakpointEvent = null;
  }

  setupScroll() {
    this.skus = this.productEls.map(el => {
      const sku = el.getAttribute('data-product-sku');
      this.skuToProductElMap[sku] = {
        element: el,
        found: false
      };
      return sku;
    });

    // Show loading spinner
    setStatusLoading(this.container, this.loadingEl);

    aoProduct
      .getProducts(this.skus)
      .then(products => {
        products.forEach(productData => {
          this.skuToProductElMap[productData.Code].found = true; // The ajax request returned the product, so mark it as such
          const productEl = this.skuToProductElMap[productData.Code].element;
          setTitle(productEl, productData);
          setImage(productEl, productData);
          setPrice(productEl, productData);
          setReview(productEl, productData);
          // setButton(productEl, productData);
        });

        const numOfFoundProducts = removeUnfoundProducts(
          this.skuToProductElMap
        );

        if (numOfFoundProducts > 0) {
          // Configure slideshow
          const onResized = debounce(updateStage.bind(this));
          const breakpointEventString = `xscrollBreakpointChanged${
            this.instanceId
          }`;

          window.addEventListener(breakpointEventString, onResized);

          this.breakpointEvent = new Breakpoint({
            container: this.container,
            eventName: breakpointEventString
          });
          this.breakpointEvent.init();
        }

        // Hide loading spinner
        setStatusComplete(this.container, this.loadingEl);
      })
      .catch(function(err) {
        console.warn('Error', err);
      });
  }

  get id() {
    return this.instanceId;
  }

  static get counter() {
    AOXScroll._counter = (AOXScroll._counter || 0) + 1;
    return AOXScroll._counter;
  }
}
