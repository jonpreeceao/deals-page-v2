import { hasClass, getClosest } from './dom-utils';
import { requestAnimationFramePolyfill } from '../polyfills/request-animation-frame-polyfill';

var initialisedElements = [];
var pageUrl = location.hash ? stripHash(location.href) : location.href;

export function isSmartPhone() {
	return window.breakpoint.value === 'mobile' ? true : false;
}

export default function initSmoothScrolling(overrideOffset, allowPropagation = false) {
	var offset = window.breakpoint.value === 'desktop' ? 35 : 0;
	let offsetInt = !isNaN(overrideOffset) ? overrideOffset : offset;
	initLinkHijack(offsetInt, allowPropagation);
}

export function initLinkHijack(offsetInt, allowPropagation = false) {

	// Remove all the event listeners.
	deinitialiseElements();

	if (canUseRequestAnimationFrame()) {
		var links = document.querySelectorAll('a');
		links = [].slice.call(links);

		links.forEach(function(link) {
			link.addEventListener('click', function(e) {
				onClick(e, offsetInt, allowPropagation);
			});
			initialisedElements.push({ el: link, handler: onClick });
		});
	}
}

export function onClick(e, offsetInt, allowPropagation = false) {
	// if the target is not an anchor link, find the closest parent anchor.
	let target;
	if (e.target.nodeName === 'A') {
		target = e.target;
	} else {
		target = getClosest(e.target, 'a');
	}

	if (!isInPageLink(target) || isSmartPhone()) {
		return;
	}

	if (!allowPropagation) {
		e.stopPropagation();
	}
	e.preventDefault();

	jump(target.hash, {
		offset: offsetInt
	});
}

export function isInPageLink(target) {
	return target.tagName.toLowerCase() === 'a' && target.hash.length > 0 && stripHash(target.href) === pageUrl;
}

export function stripHash(url) {
	return url.slice(0, url.lastIndexOf('#'));
}

export function isCssSmoothSCrollSupported() {
	return 'scrollBehavior' in document.documentElement.style;
}

export function deinitialiseElements() {
	initialisedElements.forEach(function(item) {
		item.el.removeEventListener('click', item.handler);
	});

	initialisedElements = [];
}

export function canUseRequestAnimationFrame() {
	return !!window.requestAnimationFrame;
}

export function jump(target, options) {
	var start = window.pageYOffset;
	var opt = {
		duration: (options && options.duration) ? options.duration : 900,
		offset: (options && options.offset) ? options.offset : 0,
		easing: (options && options.easing) ? options.easing : easeInOutQuad
	};

	var distance =
		typeof target === 'string' ? document.querySelector(target).getBoundingClientRect().top - opt.offset : target;
	var duration = typeof opt.duration === 'function' ? opt.duration(distance) : opt.duration;
	var timeStart;
	var timeElapsed;

	requestAnimationFrame(function(time) {
		timeStart = time;
		loop(time);
	});

	function loop(time) {
		timeElapsed = time - timeStart;

		window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

		if (timeElapsed < duration) {
			requestAnimationFrame(loop);
		}
	}

	// Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
	function easeInOutQuad(t, b, c, d) {
		t /= d / 2;
		if (t < 1) {
			return c / 2 * t * t + b;
		}
		t--;
		return -c / 2 * (t * (t - 2) - 1) + b;
	}
}
