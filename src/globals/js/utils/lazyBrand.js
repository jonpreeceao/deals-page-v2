import { createElement } from './dom-utils';

function backgroundImagesOnly(image) {
	const imageEl = image.image;
	if (imageEl.hasAttribute('data-lazy-src') && imageEl.getAttribute('data-lazy-src').indexOf('url(')) {
		// We assume this is a lazy background image, until we have a nicer API!
		return true;
	}
	return false;
}

function unresolvedImages(image) {
	return !image.resolved;
}

// Regularly rescan viewport until all images have loaded.
// Should force images to load a bit faster
function rescanImages(lazyInstance) {
	if (lazyInstance.images.filter(unresolvedImages).length) {
		lazyInstance.rescanViewport();
		setTimeout(() => {
			rescanImages(lazyInstance);
		}, 500);
	}
}

export default function lazyBrandInit() {

	if (typeof window.LazyScroll !== 'undefined') {
		const lazyImagesInstance = new LazyScroll('.lazy-brand-image');
		const lazyBgImagesInstance = new LazyScroll('.lazy-brand-image-bg');

		// Add a placeholder child element to all lazy background image elements
		// so it can be used as a colour overlay to fade and reveal the image beneath
		if (lazyImagesInstance.images || lazyBgImagesInstance.images) {

			if (lazyBgImagesInstance.images) {
				lazyBgImagesInstance.images.filter(backgroundImagesOnly).forEach(image => {
					const imageEl = image.image;
					const bgPlaceholder = createElement({ element: 'div', class: 'lazy-brand-image-bg-placeholder', content: false });
					imageEl.insertBefore(bgPlaceholder, imageEl.firstChild);
				});
			}

			if (lazyImagesInstance.images) {
				window.addEventListener('lazyload', function() {
					lazyImagesInstance.images.forEach(image => {
						picturefill({
							reevaluate: true,
							elements: [image.image]
						});
					});
				});
			}

			window.addEventListener('lazyloadcomplete', function(evt) {
				const image = evt.target;

				if (image.parentNode.classList.contains('lazy-brand-image-container')) {
					image.parentNode.classList.add('lazy-brand-image-loaded');
				}
				image.classList.add('lazy-brand-image-loaded');
			});
		}

		// rescanImages(lazyImagesInstance);
		// rescanImages(lazyBgImagesInstance);
	}
}