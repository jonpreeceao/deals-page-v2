import { createGrid } from './dom';
import { debounce, getHandlerData } from './utils';
import { ModalHandler } from './modal-handler';
import Breakpoint  from '../../js/utils/breakpoint';

const masonryContainer = document.querySelector('.masonry-container');
// Export so we can import and use in the other files to check
// what the current breakpoint is (e.g. mobile:landscape, tablet, desktop, desktop:uber)
export const breakpoint = new Breakpoint({
	container: masonryContainer,
	eventName: 'masonryBreakpointChanged',
});
breakpoint.init();

export function AOMasonry(options = {}) {
	if(!(this instanceof AOMasonry)) {
		return new AOMasonry(options);
	}

	this.grid = options.grid || document.querySelector('.grid');
	this.maxColumnCount = options.maxColumnCount || 4;
	this.contentBlockSelector = options.contentBlockSelector = '.block';
	this.columnSelector = options.columnSelector || '.masonry-column';
	this.imageHolderSelector = options.imageHolderSelector || '.image-holder';
	this.contentHolderSelector = options.contentHolderSelector || '.content-holder';
	this.loadingScreen = options.loadingScreen || document.querySelector('.grid-loading-screen');

	this.createAoMasonryGrid = createGrid.call(this);
	this.addResizeListener = false;
	const asyncDataElements = document.querySelectorAll('[data-async-source]');

	Array.prototype.forEach.call(asyncDataElements, (element) => {
		let asyncSource = element.getAttribute('data-async-source');
		let templateName = element.getAttribute('data-template');
		let templateData = templates[templateName];
		let breakpoint = window.breakpoint == null ? "desktop" : window.breakpoint.value;

		let productHandler = new ProductHandler(element, templateName, templateData, breakpoint);
		productHandler.render(asyncSource, null);
	});

}

AOMasonry.prototype.init = function(config) {

	this.createAoMasonryGrid.call(this, config);

	if(!this.addResizeListener) {
		this.addResizeListener = true;
		let onResizeEnd = debounce(this.init, 100);
		window.addEventListener('resize', onResizeEnd.bind(this, config));
	}

	const modalHandler = new ModalHandler();

};

var aom = AOMasonry();
// this was causing the page to use default config until resize
// however, now it's commented out - the static block is smaller until resize
// aom.init(masonryConfig.gridData, masonryConfig.trackingLabel);
// console.log(masonryConfig.trackingLabel);
getHandlerData(masonryConfig.gridData).then(function(richConfig){
	aom.init(richConfig);
}).catch(function(){
	aom.init(masonryConfig.gridData);
});
