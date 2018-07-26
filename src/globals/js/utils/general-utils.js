import {
	hasClass,
	addClass,
	removeClass,
	preventEventDefault
} from './dom-utils';

export var scrollLock = {
	locked: false,
	enabledElementClass: '',
	eventListener: {},

	/**
	 * Prevents background scroll on mobile.
	 * @param {string} enabledElementClass - Selector of the element you wish to leave scrolling enabled.
	 * @param {Array.<string>} [disabledElements=['body']] - Selectors of the elements you wish to disable scroll.
	 */
	lock(enabledElementClass, disabledElements) {
		this.locked = true;
		this.enabledElementClass = enabledElementClass;
		disabledElements = Array.isArray(disabledElements)
			? disabledElements
			: ['body'];
		disabledElements.forEach(function(selector) {
			var el = document.querySelector(selector);
			addClass(el, 'disable-scrolling');
		});
		this.eventListener = this.preventDefault.bind(this);
		document.body.addEventListener('touchmove', this.eventListener);
	},
	unlock() {
		var els = document.querySelectorAll('.disable-scrolling');
		Array.prototype.forEach.call(els, function(element) {
			removeClass(element, 'disable-scrolling');
		});
		document.body.removeEventListener('touchmove', this.eventListener);
		this.locked = false;
	},
	preventDefault(evt) {
		var target = evt.target;
		var hasVerticalScrollbar = target.scrollHeight > target.clientHeight;
		if (hasClass(target, 'disable-scrolling')) {
			preventEventDefault(evt);
		} else {
			while (!hasClass(target, this.enabledElementClass)) {
				target = target.parentNode;
				if (target === document.body) {
					break;
				}
			}
			hasVerticalScrollbar = target.scrollHeight > target.clientHeight;
			if (!hasVerticalScrollbar) {
				preventEventDefault(evt);
			}
		}
	}
};

export const formatString = function(format, args) {
	var matches = format.match(/{.*?}/gmi);
	if (matches) {
		matches.forEach(m => {
			let k = m.substr(1, m.length - 2);
			format = format.replace(m, args[k] || '');
		});
	}

	return format;
};

export const fireOnce = function(fn) {
	let hasFired = false;
	return e => {
		if (!hasFired) {
			fn();
			hasFired = true;
		}
	};
};

export function ready(fn) {
	if (document.readyState === 'complete') {
		fn();
	} else {
		let fireFnOnce = fireOnce(fn);
		document.addEventListener('DOMContentLoaded', fireOnce);
		document.addEventListener('readystatechange', () => {
			if (document.readyState === 'complete') {
				fireFnOnce();
			}
		});
	}
}

export function getUrlParameters() {
	/*
	const search = window.location.search.substring(1);

	if (!search) {
		return {};
	}

	const params = search.split('&');
	const paramSplit = params.map(function(param){
		const match = param.match(/^[^=\s]+=[^=\s]+$/gmi);
		console.log('match', match);
		return match ? match[0];
	});
	*/
	const search = window.location.search.substring(1);
	var obj = {};
	search.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
		obj[decodeURIComponent(key)] = decodeURIComponent(value);
	});

	return obj;
}

export function debounce(fn) {
	let animationFrameRequested = false;
	return function() {
		if (!animationFrameRequested) {
			animationFrameRequested = true;
			requestAnimationFrame(function(){
				fn();
				animationFrameRequested = false;
			});
		}
	};
}

export function supportsTransitions() {
	var b = document.body || document.documentElement,
		s = b.style,
		p = 'transition';

	if (typeof s[p] == 'string') {
		return true;
	}

	// Tests for vendor specific prop
	var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
	p = p.charAt(0).toUpperCase() + p.substr(1);

	for (var i = 0; i < v.length; i++) {
		if (typeof s[v[i] + p] == 'string') {
			return true;
		}
	}

	return false;
}

/**
 * Check the product is in stock
 * Accepts the product object returned by the product handler
 *
 * @param {object} product
 */
export function isInStock(product) {
	return product.State.toString().toLowerCase().indexOf('discontinued') === -1;
}
