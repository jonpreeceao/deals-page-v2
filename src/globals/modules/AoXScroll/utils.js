export function createElement(node, className, content) {
	content = (typeof content !== 'undefined') ? content : false;

	const el = document.createElement(node);
	if (className && typeof className === 'string') {
		el.classList.add(className);
	}
	if (content) {
		el.textContent = content;
	}
	return el;
}

export function translateElement(element, text) {
	element.innerHTML = text;
}

export function getLanguageCode(lang = 'en-GB') {
	let langCode = 'aol';
	switch (lang) {
		case 'nl-NL':
			langCode = 'anl';
			break;
		case 'de-DE':
			langCode = 'ade';
			break;
		default:
			break;
	}
	return langCode;
}

export function isInStock(product) {
    const { State } = product;
    return State.toLowerCase().indexOf('discontinued') === -1;
}
