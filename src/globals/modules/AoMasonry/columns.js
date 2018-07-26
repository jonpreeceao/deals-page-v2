import { rearrangeBlocks } from './re-align';
import { getWindowWidth } from './utils';
import { createColumn, createContentBlock } from './dom';

/*
	getColumnState - assists finding column count with getColumnCount function

	@param { Number } width - current window width
	@returns { Object } with true or false values against each key
	e.g. { 1 : false, 2 : false, 3 : true }

*/

export function getColumnState(width) {

	return {
		'1' : width < 544,
		'2' : width >= 544 && width <= 989,
		'3' : width >= 990 && width <= 1199
	};

}

/*
	createContentBlockColumns - returns a function to call to create columns and caches previous requests

	@param { Number } maxColumnCount - max number of columns
	@returns { Function }

*/

export function createContentBlockColumns() {

	let cache = {};

	return function(blockConfig, staticBlock) {

		let numOfColumns = getColumnCount.call(this);	

		if(cache[numOfColumns]) {
			return cache[numOfColumns];
		}

		let columns = {};

		if(staticBlock) {
			let numInRows = Math.ceil(blockConfig.length / numOfColumns);
			let bottomLeftIndex = numInRows * numOfColumns - numOfColumns;
			let staticIndex = blockConfig.indexOf(staticBlock);
			blockConfig = rearrangeBlocks(staticIndex, bottomLeftIndex, blockConfig);
		}		

		for(let i = 0; i < numOfColumns; i++) {	
			let j = i;
			columns[i] = [];
			for(; j < blockConfig.length; j += numOfColumns) {		
				columns[i].push(blockConfig[j]);																	
			}
		}

		cache[numOfColumns] = columns;
		return columns;

	}	

}	

/*
	getColumnCount - gets number of columns based on current window width

	@param { Number } maxColumnCount - max number of columns
	@returns { Number } column amount

*/

export function getColumnCount() {

	let width = getWindowWidth();
	let columnState = getColumnState(width);
	
	let colCount = Object.keys(columnState).reduce((columnAmount, columnNum) => {
		if(columnState[columnNum]) {
			columnAmount = Number(columnNum);
		}
		return columnAmount;
	}, this.maxColumnCount);

	return colCount;

}

export function createColumns() {
	
	let columns = [];
	let numOfColumns = getColumnCount.call(this);
	
	for(let i = 0; i < numOfColumns; i++) {
		columns.push(createColumn(i));
	}

	return columns;

}

export function populateColumns(columns, blocks) {

	columns = columns.map((column, i) => {
		let content = blocks[i];
		content.forEach(block => column.firstElementChild.appendChild(createContentBlock(block)));
		return column;
	});			

	return columns;

}

export function getLargestColumn() {

	let largestColumn = { offsetHeight : 0 };
	let columns = getColumns.call(this);

	return columns.reduce((largest, column) => {
		if(column.offsetHeight > largest.offsetHeight) {
			largest = column;
		}
		return largest;
	}, largestColumn);

}

export function getColumns() {
	return Array.from(document.querySelectorAll(this.columnSelector));
}

export function getContentBlocksFromColumn(column) {
	return Array.from(column.querySelectorAll(this.contentBlockSelector));
}