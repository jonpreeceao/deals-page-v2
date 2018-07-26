import { hasClass } from '../../js/utils/dom-utils';
import { getLargestColumn, getColumns, getContentBlocksFromColumn } from './columns';
import { breakpoint } from './index.js';
import initSmoothScrolling from '../../js/utils/aoSmoothScroll';

export function realignHeights() {

	let largestColumn = getLargestColumn.call(this);
	let largestColumnHeight = largestColumn.offsetHeight;
	setContentBlockHeights.call(this, largestColumn, largestColumnHeight);
}

/**
 * setContentBlockHeights
 * Resizes the image holder or static block heights
 * so they all align vertically
 *
 * @param largestColumn - the largest column in height
 * @param largestColumnHeight - the height of the largest column
 */
export function setContentBlockHeights(largestColumn, largestColumnHeight) {

	const columns = getColumns.call(this);
	const otherColumns = columns.filter(column => column !== largestColumn);
	const numOfOtherColumns = otherColumns.length;
	otherColumns.forEach((column, index) => {

		let blocks = getContentBlocksFromColumn.call(this, column);

		let staticBlocks = getStaticBlocks.call(this, blocks);
		let numOfStaticBlocks = staticBlocks.length;

		let numOfNormalBlocks = blocks.length - numOfStaticBlocks;

		let currentColumnHeight = column.offsetHeight;
		let difference = largestColumnHeight - currentColumnHeight;
		let increaseBy = Number(Number(difference / numOfNormalBlocks).toFixed(1));

		if(breakpoint.value !== 'mobile') {
			blocks.forEach((block) => {

				const imageHolder = block.querySelector(this.imageHolderSelector);
				const contentHolder = block.querySelector(this.contentHolderSelector);

				if (blockHasImage.call(this, block)) {
					imageHolder.style.height = `${(imageHolder.offsetHeight + increaseBy)}px`;
				} else if (!blockIsStatic.call(this, block)) {
					contentHolder.style.height = `${(contentHolder.offsetHeight + increaseBy)}px`;
				}
			});
		}

		if (numOfOtherColumns === index + 1) {
			// Re-init smooth scrolling after we've rebuilt the grid
			// for any internal hash links which are in the grid
			initSmoothScrolling();
		}

	});

}

/**
 * blockHasImage
 *
 * Test whether a block has an image
 *
 * @param block
 * @returns {*|boolean}
 */
function blockHasImage(block) {
	const image = block.querySelector(this.imageHolderSelector);
	return image.style.backgroundImage && !hasClass(image, 'noImage');
}

/**
 * blockIsStatic
 *
 * Test whether a block is a "static"
 *
 * @param block
 * @returns {boolean}
 */
function blockIsStatic(block) {
	return hasClass(block.parentNode, 'static');
}

/**
 * getStaticBlocks
 *
 * @param blocks
 * @returns {*}
 */
function getStaticBlocks(blocks) {
	return blocks.filter(block => {
		return hasClass(block.parentNode, 'static');
	});
}

/*
	rearrangeBlocks - repositions static block at the bottom left of columns

	@param { Number } startIndex - index of static block
	@param { Number } endIndex - index of block in bottom left of columns
	@returns { Array } with repositioned static block

*/

export function rearrangeBlocks(startIndex, endIndex, blockConfig) {

	let tempConfig = blockConfig.slice(0);
	let staticBlock = tempConfig.splice(startIndex, 1)[0];
	tempConfig.splice(endIndex, 0, staticBlock);

	return tempConfig;

}
