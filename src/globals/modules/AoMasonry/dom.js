import { addClass } from '../../js/utils/dom-utils';
import { getColumnCount, createColumns, createContentBlockColumns, populateColumns } from './columns';
import { getStaticBlock, emptyGrid, hideLoadingScreen, createBrandSpriteClass, decodeHtmlEntity, encodeHtmlEntity } from './utils';
import { loadBackgroundImages } from './images';
import { realignHeights } from './re-align';

/**
 * createContentBlock
 *
 * Creates the markup for each content block
 *
 * @param block - properties to build HTML from
 * @returns {Element} - the block
 */
export function createContentBlock(block) {

    let { sku, title, text, isStatic, rating, brand, price, link, isHero, isBigger, isBrandTall, isNoImage, isBrandShort, modal, staticLink, webTrends, customClassesArray } = block;

    let formattedBrand = createBrandSpriteClass(brand);
    let trimmedLink = typeof link == 'string' ? link.trim() : '';

    let item = trimmedLink || modal ? document.createElement('a') : document.createElement('div');
    let inner = document.createElement('div');
    let imageHolder = document.createElement('div');
    let contentHolder = document.createElement('div');
    let titleHolder = document.createElement('div');
    let desc = document.createElement('div');
    let heading = document.createElement('h3');
    let ratingElm = document.createElement('div');
    let brandElm = document.createElement('div');
    let priceElm = document.createElement('p');
    let modalContent = document.createElement('div');
    let modalChildText = document.createElement('div');
    let modalChildImg = document.createElement('div');
    let modalChildHref = document.createElement('div');
    let modalChildHref2 = document.createElement('div');
    let modalChildHref3 = document.createElement('div');
    let modalChildHref4 = document.createElement('div');
    let modalChildHref5 = document.createElement('div');
    let modalCloseContainer = document.createElement('div');

	let existingChild = document.querySelector(`[data-sku="${sku}"]`);
    let modalParent = document.getElementById('modal-tech');

    if (webTrends) {
        // Attribute used for Web Trends tracking
        item.setAttribute('data-tags', webTrends);
    }

    if (customClassesArray) {
		item.classList.add(...customClassesArray);
    }

    if (trimmedLink) {
        addClass(item, 'item-link-external');
        item.setAttribute('href', trimmedLink);
    } else if (modal) {
		if (sku) {
			item.setAttribute('data-sku-parent', sku);
		}
        addClass(item, 'item-link');

        if (!existingChild) {

            modalContent.appendChild(modalChildText);
            modalContent.appendChild(modalChildImg);
            modalParent.appendChild(modalContent);
            modalContent.appendChild(modalCloseContainer);
            addClass(modalChildText, 'modal-child-text');
            addClass(modalChildImg, 'modal-child-img');
            addClass(modalContent, 'modal-content');
			addClass(modalCloseContainer, 'close-modal-tech');
			if (sku) {
				modalContent.setAttribute('data-sku', sku);
			}
			if (customClassesArray) {
				modalContent.classList.add(...customClassesArray);
			}
            modalChildImg.setAttribute('style', `background-image: url(${process.env.SERVER_PATH}${modal.image})`);
            modalChildText.innerHTML = modal.text ? `${modal.text}` : '';
            modalChildHref.innerHTML = modal.href ? modal.href : '';
            modalChildHref2.innerHTML = modal.href2 ? modal.href2 : '';
            modalChildHref3.innerHTML = modal.href3 ? modal.href3 : '';
            modalChildHref4.innerHTML = modal.href4 ? modal.href4 : '';
            modalChildHref5.innerHTML = modal.href5 ? modal.href5 : '';

            if (modal.styling) {
                addClass(modalContent, modal.styling);
            }
            if (modal.href) {
                modalChildText.appendChild(modalChildHref);
                modalChildText.appendChild(modalChildHref2);
                modalChildText.appendChild(modalChildHref3);
                modalChildText.appendChild(modalChildHref4);
                modalChildText.appendChild(modalChildHref5);
            }
        }

    }

    heading.innerHTML = title || '';
    priceElm.innerHTML = price ? `<span>from</span>${price}` : '';

    inner.appendChild(imageHolder);
    inner.appendChild(contentHolder);
    contentHolder.appendChild(titleHolder);
    titleHolder.appendChild(heading);

    if (text) {
        contentHolder.appendChild(desc);
        desc.innerHTML = text;
    }

    if (!isStatic) {
        contentHolder.appendChild(ratingElm);
        contentHolder.appendChild(brandElm);
        contentHolder.appendChild(priceElm);
    }

    if (isStatic && staticLink) {

    }
    if (isHero) {
        addClass(imageHolder, 'hero');
    }
    if (isBigger) {
        addClass(imageHolder, 'bigger');
    }
    if (isBrandTall) {
        addClass(imageHolder, 'brandTall');
    }
    if (isBrandShort) {
        addClass(imageHolder, 'brandShort');
    }
    if (isNoImage) {
        addClass(imageHolder, 'noImage');
    }


    item.appendChild(inner);

    ratingElm.innerHTML = rating ? `<p class="customer-rating">Customer rating:</p><span class="ratingSpriteHolder" id="ratingSpriteHolder"><span class="ratingSprite"></span> <span id="h3ProductRating" class="ratingSpriteUnder ratingSprite_${rating}"></span></span>` : '';

    addClass(imageHolder, 'image-holder');
    addClass(contentHolder, 'content-holder');
    addClass(titleHolder, 'title-holder');
    addClass(desc, 'desc');
    addClass(heading, 'title');
    addClass(inner, 'block');
    addClass(item, 'item');
    addClass(ratingElm, rating || 'no-rating');
    addClass(brandElm, formattedBrand ? `brandSprite_${formattedBrand}` : 'no-brand');
    addClass(priceElm, price ? 'price' : 'no-price');

    if (isStatic) {
        addClass(item, 'static');
    }

    return item;

}

export function createColumn(gridNumber) {

    let gridItem = document.createElement('div');
    let gridItemContent = document.createElement('div');

    addClass(gridItem, 'grid-item');
    addClass(gridItemContent, 'masonry-column');

    gridItem.appendChild(gridItemContent);

    return gridItem;

}

/**
 * createGrid
 *
 * Main workhorse function that gets called on load and on window resize
 *
 * @returns {Function} - takes a config and creates the columns
 */
export function createGrid() {

    let numOfColumns = getColumnCount.call(this);
    let createColumnsFromCache = createContentBlockColumns();
    let isGridCreated = false;

    return function(config) {

        let currentNumOfColumns = getColumnCount.call(this);

        if (numOfColumns !== currentNumOfColumns || !isGridCreated) {

            let holder = document.createDocumentFragment();
            let staticBlock = getStaticBlock(config);
            let blocks = createColumnsFromCache.call(this, config, staticBlock);

            let columns = createColumns.call(this);
            columns = populateColumns(columns, blocks);
            columns.forEach(column => holder.appendChild(column));

            emptyGrid.call(this);
            this.grid.appendChild(holder);

            isGridCreated = true;
            numOfColumns = getColumnCount.call(this);

            let onBackgroundImageLoad = loadBackgroundImages.call(this, blocks);
            onBackgroundImageLoad.then(() => {
                realignHeights.call(this);
                hideLoadingScreen.call(this);
            });

        } else {
            realignHeights.call(this);
        }

    };

}
