import { breakpoint } from './index.js';

/*
	loadBackgroundImages - creates an array of promises that load background images
	@param { Object } blocks - columns of arrays of ordered config objects
	@resolves when all images have loaded

*/

export function loadBackgroundImages(blocks) {

	return new Promise( resolve => {

		const imageCdnPath = process.env.SERVER_PATH;

		let imageHolders = Array.from(document.querySelectorAll(this.imageHolderSelector));
		let contentBlockWidth = imageHolders[0].parentNode.offsetWidth;

		let imageLoaders = Object.keys(blocks).reduce((loaders, key) => {
			loaders = loaders.concat(blocks[key].map(block => loadBackgroundImage(block.image)));
			return loaders;
		}, []);

		let imageRegExp = /img(.*)/;

		// CDN location from WebPack define

		// local

		Promise.all(imageLoaders).then(function(results) {

			results.forEach((result, index) => {
				if(result.loaded) {
					// debugger;
					let ratio = Math.round(result.width / contentBlockWidth);
					let height = Math.round(result.height / ratio);
					let paddingTop = (result.height / result.width) * 100;
					let match = imageRegExp.exec(result.src);
					if (breakpoint.value !== 'mobile') {
						// imageHolders[index].style.height = `${height}px`;
						imageHolders[index].style.height = 0;
						imageHolders[index].style.paddingTop = `${paddingTop}%`;
					}
					imageHolders[index].style.backgroundImage = `url(${imageCdnPath}${match[0]})`;
				}
			});

			resolve();

		}).catch(function(error){
			console.warn('Error getting images:', error);
		});

	});

}

export function onImageLoad(resolve) {
	let { width, height, src } = this;
	this.parentNode.removeChild(this); // We no longer need the image, so remove it from the DOM
	resolve({ loaded : true, width, height, src });
}

export function onImageError(resolve) {
	resolve({ loaded : false });
}

export function loadBackgroundImage(src) {

	if(!src) {
		return Promise.resolve({ loaded : false });
	}

	// Create an image and add it to the DOM so it forces IE9 to load it.
	// If you don't add it to the DOM, it doesn't load and IE9 just remains blank!
	var image = new Image();
	image.style.display = 'none';
	document.body.appendChild(image);

	return new Promise(function(resolve) {
		image.addEventListener('load', function onLoad() {
			onImageLoad.call(image, resolve);
			image.removeEventListener('load', onLoad);
		});
		image.addEventListener('error', function onError() {
			onImageError.call(image, resolve);
			image.removeEventListener('error', onError);
		});
		image.src = process.env.SERVER_PATH + src;
	});

}
