import axios from 'axios';

export function getWindowWidth() {
    return window.innerWidth;
}

export function getStaticBlock(blockConfig) {
    return blockConfig.filter(block => block.isStatic).pop();
}

export function emptyGrid() {

    // let elms = document.getElementsByClassName('item-link');
    // Array.from(elms).forEach(el => {
    //     el.removeEventListener("click", handlePopUp, false);
    // });
    this.grid.innerHTML = '';

}

export function hideLoadingScreen() {
    this.loadingScreen.style.display = 'none';
    this.grid.style.visibility = 'visible';
}

export function debounce(func, wait, immediate) {

    let timeout;
    return function() {

        let context = this; //eslint-disable-line consistent-this
        let args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }

    };

}

export function createBrandSpriteClass(brand = '') {
    let str = brand.toLowerCase().replace(/\s/g, '');
    return str.replace(/[^(a-z)(A-Z)(0-9)(-)]/g, '-');
}

export function isVisible(elm) {
    return elm.style.display !== 'none';
}

export function getHandlerData(items) {
    let skus = [];
    items.forEach((item, i) => {
        if (item.sku) {
            skus.push(encodeURIComponent(item.sku));
        }
    });
    skus = skus.toString();

    let handlerUrl = `/ProductsHandler.axd?products=${skus}&numberToReturn=60&itemsperpagesize=60`;

    return axios.get(handlerUrl)
        .then(response => {

            let { data } = response;

            if (!data) {
                return items;
            }
            let skuMap = {};
            data.forEach((item, i) => {
                skuMap[item.Code] = i;
            });

            let richData = items.map(item => {
                let richSku = item;
                let skuIndex = typeof skuMap[item.sku] !== 'undefined' ? skuMap[item.sku] : -1;
                if (skuIndex > -1) {
                    let sku = data[skuIndex];
                    richSku.price = sku.PricePodViewModel.FormattedNowPrice || '';
                    richSku.brand = sku.Brand;
                    richSku.rating = sku.RatingValue ? sku.Rating : '';
                }
                return richSku;
            });

            return richData;
        });
}

export function hasId(element, id) {
    if (!element || !id) {
        return;
    }
    return element.getAttribute('id') === id; //eslint-disable-line consistent-return
}

export function isModalOpen() {
    return document.querySelector('.modal-wrapper.show') !== null;
}

function isIPhone(){
    return hasClass(document.body, 'smartPhone') && (hasClass(document.body, 'safari9') || hasClass(document.body, 'safari10')); //eslint-disable-line max-len
}

export function stickyElement(stickyElm, stickyParent) {
    let startStickyElmPos = stickyParent.offsetTop;

    return function() {
        if (!isModalOpen()) {
            return;
        }

        if (pageYOffset > startStickyElmPos) {
            stickyElm.style.position = 'fixed';
        } else {
            stickyElm.style.position = 'absolute';
        }

        if (isIPhone()) {
            stickyElm.style.position = 'fixed';
        }
    };
}
