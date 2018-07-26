export function hasClass(element, className) {
	if (element instanceof HTMLElement && typeof className === "string") {
		return element.classList.contains(className);
	}
	else {
		throw new Error("The element passed in to hasClass is not a valid HTML element");
	}
}

export function addClass(element, className) {
	if (element instanceof HTMLElement && typeof className === 'string') {
		element.classList.add(className);
		return true;
	} else {
		throw new Error("The element passed in to addClass is not a valid HTML element")
	}
}

export function removeClass(element, className) {
	if (element instanceof HTMLElement && typeof className === 'string') {
		element.classList.remove(className);
		return true;
	} else {
		throw new Error("The element passed in to removeClass is not a valid HTML element")
	}
}

export function toggleClass(element, className) {
	if (element instanceof HTMLElement && typeof className === 'string') {
		element.classList.toggle(className);
		return true;
	} else {
		throw new Error("The element passed in to removeClass is not a valid HTML element")
	}
}

export function getElement(context, target) {
	return (context || document).querySelector(target);
}

export function getElements(context, target) {
	return (context || document).querySelectorAll(target);
}

export function dispatchEvent(evt, data) {
	var event = document.createEvent('Event');
	event.initEvent(evt, true, true);

	if (typeof data !== 'undefined') {
		Object.keys(data).forEach(p => {
			event[p] = data[p];
		});
	}

	window.dispatchEvent(event);
}

export function preventEventDefault(evt) {
	if (evt.preventDefault) {
		evt.preventDefault();
	} else {
		evt.returnValue = false;
	}
}

export function doesElementExist(element) {
	return document.querySelector(element);
}

/*
 EXAMPLE:

 createElement({element: 'div', class: 'className', content: false});
 */

export function createElement(obj) {
	if (typeof obj !== 'object') {
		throw new Error("createElement expects a config object passed in to define the element's properties");
	}
	var newElem = document.createElement(obj.element);
	newElem.setAttribute('class', obj.class);
	if (obj.content !== false) {
		newElem.innerHTML = obj.content;
	}
	return newElem;
}

export function insertBefore(elem, parent, before) {
	var elemNode;
	var parentNode;
	var beforeNode;

	// Check element is a HTML element, if it is a string then query it. Otherwise set it as null.
	if (elem instanceof HTMLElement) {
		elemNode = elem;
	} else {
		elemNode = null;
	}

	// Check parent is a HTML element, if it is a string then query it. Otherwise set it as null.
	if (parent instanceof HTMLElement) {
		parentNode = parent;
	} else if (typeof parent === 'string') {
		parentNode = document.querySelector(parent);
	} else {
		parentNode = null;
	}

	// Null will append it to the end of parents childnodes.
	if (before instanceof HTMLElement) {
		beforeNode = before;
	} else {
		beforeNode = null;
	}

	// Only insert element if parentNode and elementNode are HTML nodes.
	if (parentNode !== null && elemNode !== null) {
		parentNode.insertBefore(elem, before);
		return true;
	} else {
		throw new Error("insertBefore expects a valid element, parent and before target");
	}

}

export function appendTo(elem, parent) {
	var parentNode;

	// Check parent is a HTML element, if it is a string then query it. Otherwise set it as null.
	if (parent instanceof HTMLElement) {
		parentNode = parent;

	} else if (typeof parent === 'string') {
		parentNode = document.querySelector(parent);

	} else {
		parentNode = null;

	}

	if (parentNode !== null && elem instanceof HTMLElement) {
		document.querySelector(parentNode).appendTo(elem);
		return true;

	} else {
		throw new Error("appendTo expects a valid element and parent");
	}
}


export function insertPlaceholder(el) {
	var placeHolder = document.createElement('div');
	placeHolder.classList.add('placeholder');
	placeHolder.setAttribute('data-elreplaced', el.id);

	el.parentNode.insertBefore(placeHolder, el);
	el.parentNode.removeChild(el);
}

export function moveElement(el, to) {
	var placeHolder = document.querySelector('.placeholder[data-elreplaced=' + el.id + ']');
	if (placeHolder) {
		placeHolder.parentNode.insertBefore(el, placeHolder);
		placeHolder.parentNode.removeChild(placeHolder);
	} else if (to) {
		insertPlaceholder(el);
		to.appendChild(el);
	}
}


/**
 * getClosest
 * @author Robin O'Neill
 *
 * Find the closest element to the target element
 *
 * @param target - dom element which is the current element
 * @param selector - the element you are looking for
 * @param scope - limit the search to a containing element
 * @returns {*}
 */
export function getClosest(target, selector, scope){
	var matches = (scope || document).querySelectorAll(selector);
	var i;
	var el = target;

	do {
		i = matches.length;
		while (--i >= 0 && matches.item(i) !== el) {};
	} while ((i < 0) && (el = el.parentElement));
	return el;
}


/**
 * Get all DOM element up the tree that contain a class, ID, or data attribute
 *
 * Credit: https://github.com/happyBanshee/JS-helpers/wiki/.closest(),-.parents(),-.parentsUntil(),-.find()-in-JS
 *
 * @param  {Node} elem The base element
 * @param  {String} selector The class, id, data attribute, or tag to look for
 * @return {Array} Null if no match
 */
export function getParents(elem, selector) {

	var parents = [];
	var firstChar;
	if (selector) {
		firstChar = selector.charAt(0);
	}

	// Get matches
	for (; elem && elem !== document; elem = elem.parentNode) {
		if (selector) {

			// If selector is a class
			if (firstChar === '.') {
				if (elem.classList.contains(selector.substr(1))) {
					parents.push(elem);
				}
			}

			// If selector is an ID
			if (firstChar === '#') {
				if (elem.id === selector.substr(1)) {
					parents.push(elem);
				}
			}

			// If selector is a data attribute
			if (firstChar === '[') {
				if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
					parents.push(elem);
				}
			}

			// If selector is a tag
			if (elem.tagName.toLowerCase() === selector) {
				parents.push(elem);
			}

		} else {
			parents.push(elem);
		}
	}

	// Return parents if any exist
	if (parents.length === 0) {
		return null;
	}
	return parents;
}
