export function orientationTag() {

	function isPortrait() {
		return window.innerHeight > window.innerWidth;
	}

	function getOrientation() {
		if (isPortrait()) {
			return 'portrait';
		}
		return 'landscape';
	}

	let orientation = getOrientation();
	if (window.breakpoint.value !== 'desktop') {
		DRLJs.tagging.trackingSystem.fireTagObject({ 'WT.z_orientation': orientation });
	}

	window.addEventListener('orientationchange', () => {
		orientation = getOrientation();
		DRLJs.tagging.trackingSystem.fireTagObject({ 'WT.z_orientation': orientation });
	});
}

export function scrollTag() {
	let timeoutId;
	let startPosition;
	let sections = document.body.querySelectorAll('main > section');

	function timeoutHandler() {
		timeoutId = null;
		let endPosition = window.scrollY;

		let contentHeight = document.body.offsetHeight;
		let viewportHeight = window.innerHeight;
		let scrollableHeight = contentHeight - viewportHeight;
		let scrolledPercentage = 100 * endPosition / scrollableHeight;
		let visibleSection = '';

		let position = endPosition + (viewportHeight * 0.5);

		if (sections) {
			let sectionArr = Array.from(sections).map((item) => {
				return {
					className: item.className,
					top: item.offsetTop,
					bottom: item.offsetTop + item.offsetHeight
				};
			});

			let visible = sectionArr.filter((item) => {
				return item.top <= position && item.bottom >= position;
			});

			if (visible.length > 0) {
				visibleSection = visible[0].className;
			}
		}

		let tag = {
			'WT.z_scroll': `${startPosition}|${endPosition}|${scrolledPercentage.toFixed(2)}%|${visibleSection}|${viewportHeight}`
		};

		try {
			DRLJs.tagging.trackingSystem.fireTagObject(tag);
		} catch(e) {}
	}

	window.addEventListener('scroll', (e) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		} else {
			startPosition = window.scrollY;
		}

		timeoutId = setTimeout(timeoutHandler, 500);
	});
}

function fireTagEvent(evt) {
	let additionalParameters;
	let target = evt instanceof HTMLElement ? evt : evt.target || evt.srcElement;
	let pagetype = (window.utag_data && window.utag_data.page_type) ? window.utag_data.page_type : window.location.href;

	if (target && !target.hasAttribute('data-tagged')) {
		while (!target.hasAttribute('data-tagged')) {
			target = target.parentNode;

			if (target.nodeName === 'SECTION' || target.nodeName === 'MAIN') {
				break;
			}
		}
	}

	let tag = target.getAttribute('data-tag');
	let tagValue = target.getAttribute('data-tag-value');
	let sku = window.currentProductCode;

	let additionalTag = target.getAttribute('data-additional-tag');
	let additionalTagValue = target.getAttribute('data-additional-tag-value');
	additionalParameters = !!(additionalTag && additionalTagValue);

	if (sku !== null && tagValue !== null && tag !== null && additionalParameters) {
		// if the element has additional tagging parameters.
		dcsMultiTrack('DCS.dcsuri', window.location.href, 'WT.dl', '99', 'WT.z_ptype', pagetype, 'WT.tx_e', 'i', 'WT.pn_sku', sku, tag, tagValue, additionalTag, additionalTagValue);
	} else if (tagValue !== null && tag !== null) {
		dcsMultiTrack('DCS.dcsuri', window.location.href, 'WT.dl', '99', 'WT.z_ptype', pagetype, 'WT.tx_e', 'i', 'WT.pn_sku', sku, tag, tagValue);
	} else {
		return false;
	}
}

function fireTagObject(obj) {
	if (typeof obj === 'object' && obj.tagValue !== null && obj.tag !== null) {
		let pagetype = (window.utag_data && window.utag_data.page_type) ? window.utag_data.page_type : window.location.href;
		let sku = window.currentProductCode || 'no-sku';
		let { tagValue, tag } = obj;
		dcsMultiTrack('DCS.dcsuri', window.location.href, 'WT.dl', '99', 'WT.z_ptype', pagetype, 'WT.tx_e', 'i', 'WT.pn_sku', sku, tag, tagValue);
	} else {
		return false;
	}
}

export function fireTag(tag) {
	if (typeof dcsMultiTrack === 'undefined'){
		return false;
	}

	if (tag instanceof Event || tag instanceof HTMLElement || tag.nativeEvent instanceof Event) {
		fireTagEvent(tag);
	} else {
		fireTagObject(tag);
	}
}

export function listenForTaggedElementsBeingClicked() {
	var taggedElements = document.querySelectorAll('[data-tagged="true"]');

	for (var i = 0; taggedElements.length > i; i++) {
		taggedElements[i].addEventListener('click', fireTag, false);
	}
}

export function addTaggingAttributes(elem, tag, value) {
	elem.setAttribute('data-tagged', 'true');
	elem.setAttribute('data-tag', tag);
	elem.setAttribute('data-tag-value', value);
}
