/**
 * Created by tutech on 07/07/2016.
 */

import { addClass, removeClass, moveElement } from '../../js/utils/dom-utils';
import { scrollLock } from '../../js/utils/general-utils';
import { jump } from '../../js/utils/aoSmoothScroll';
import translator, { namespacedTranslator } from '../../js/utils/translator';
import translations from './translations';

let element, stickyElement;
// let menus = [];
let maxDepth = 0;
let panelsOpen = 0;
let breakpointEventListeners = [];
let isTouch = false;
let touchListener = null;
let lastOpenedMenu;
let lang = document.head.getAttribute('lang');
lang = lang === 'en' ? 'en-GB' : lang;
translator.set('translations', translations);
translator.setLang(lang);
const getTranslation = namespacedTranslator('translations');
/**
 * Calculates the number of panels to create.
 */
function calcSubMenus(topUl, depth = 1) {
	let menus = [];

	maxDepth = Math.max(maxDepth, depth);

	Array.prototype.forEach.call(topUl.children, (child) => {
		if (child.hasAttribute('data-subMenu')) {
			let menuChild = child.querySelector('ul');
			menus.push({id: child.getAttribute('data-subMenu'), menus: calcSubMenus(menuChild, depth + 1)});
		}
	});

	return menus;
}

/**
 * Handles closing of menus on mobile.
 * @param {number} [panel] - ID Number of panel, if not supplied all panels are closed.
 */
function close(panel) {
	if (panel) {
		let panelElement = document.getElementById('aosnPanel' + panel);
		let movedElement = panelElement.querySelector('.navContainer').children[0];
		moveElement(movedElement);
		removeClass(panelElement, 'open');
		panelsOpen--;
	} else {
		let allOpenPanels = document.querySelectorAll('.aosnMobilePanel.open');
		Array.prototype.forEach.call(allOpenPanels, function(pnl) {
			let movedElement = pnl.querySelector('.navContainer').children[0];
			moveElement(movedElement);
			removeClass(pnl, 'open');
			panelsOpen--;
		});
	}

	if (!panelsOpen) {
		removeClass(document.body, 'aosnOpen');
		scrollLock.unlock('aosnMobileOverlay');
	}
}

/**
 * Handles opening of menus on mobile.
 * @param {number} panel - ID Number of panel.
 * @param {string} menuSelector - ID of menu to move into panel.
 */

function open(panel, menuSelector) {
	let panelElement = document.getElementById('aosnPanel' + panel);
	let panelContentContainer = panelElement.querySelector('.navContainer');
	let menuElement = document.getElementById(menuSelector);

	moveElement(menuElement, panelContentContainer);

	addClass(panelElement, 'open');

	panelsOpen++;

	if (panelsOpen === 1) {
		addClass(document.body, 'aosnOpen');
		scrollLock.lock('navContainer');
	}

}

/**
 * Closes all menu levels if clicking outside the menu.
 * @param evt - Passed in from Event Listener.
 */
function tapAway(evt) {
	let target = evt.target;
	let realTarget = evt.target;

	let isMenu = false;

	while (target !== document.body) {
		if (target.id === 'AoStickyNav') {
			isMenu = true;
			break;
		}
		target = target.parentNode;
	}
	if (!isMenu) {
		let openMenus = document.getElementById('AoStickyNav').querySelectorAll('.open');
		Array.prototype.forEach.call(openMenus, function(menu) {
			removeClass(menu, 'open');
		});
		document.body.removeEventListener('touchstart', tapAway);
		lastOpenedMenu = null;
	} else {

		let closestLi = getClosest(realTarget, 'drgdf', stickyElement);//realTarget.closest('li');
		let closestLiWithSubmenu = getClosest(realTarget, 'li[data-submenu]', stickyElement);//realTarget.closest('li[data-submenu]');

		if (closestLiWithSubmenu && closestLiWithSubmenu.hasAttribute('data-submenu') && closestLiWithSubmenu.getAttribute('data-submenu') !== lastOpenedMenu) {
			let childMenus = document.getElementById(lastOpenedMenu);
			childMenus.classList.remove('open');
		} else if (closestLi && closestLi.hasAttribute('data-submenu')) {
			let childMenus = document.getElementById(closestLi.getAttribute('data-submenu'));
			childMenus.classList.add('open');
		}
	}

}

/**
 * A scoped pollyfil of .closest() which accepts a scope param
 * to limit the number of nodes being searched
 *
 * @param target
 * @param selector
 * @param scope defaults to the document.body
 * @returns {*}
 */
function getClosest(target, selector, scope){
	var matches = (scope || this.document || this.ownerDocument).querySelectorAll(selector),
		i,
		el = target;
	do {
		i = matches.length;
		while (--i >= 0 && matches.item(i) !== el) {};
	} while ((i < 0) && (el = el.parentElement));
	return el;
}

/**
 * Handles hover events on desktop.
 * @param {HTMLElement} targetMenu
 * @param {String} method=close - Pass in open or close.
 */
function hover(targetMenu, method, evt) {
	if (method === 'open') {
		addClass(targetMenu, 'open');
	} else {
		removeClass(targetMenu, 'open');
	}
}

function touch(evt) {
	let target = evt.target;
	let realTarget = getClosest(target, 'li', stickyElement);//target.closest('li');
	let targetMenu = realTarget.getAttribute('data-submenu');
	let targetMenuEl = document.getElementById(targetMenu);

	if (targetMenu) {
		if (lastOpenedMenu) {
			let previousMenuLevel = document.getElementById(lastOpenedMenu).getAttribute('data-menulevel');
			let newMenuLevel = targetMenuEl.getAttribute('data-menulevel');
			if (newMenuLevel <= previousMenuLevel) {
				let topLevelElement = element.querySelector('.open[data-menulevel="' + newMenuLevel + '"]');
				if (topLevelElement) {
					let openSubMenus = topLevelElement.querySelectorAll('.open');
					if (openSubMenus) {
						Array.prototype.forEach.call(openSubMenus, function(menu) {
							menu.classList.remove('open');
						});
					}
					topLevelElement.classList.remove('open');
				}
			}
		} else {
			document.body.addEventListener('touchstart', tapAway);
			document.body.addEventListener('mouseover', tapAway);
			// document.body.addEventListener('mouseleave', tapAway);
		}

		if (typeof targetMenuEl.classList === 'object') {
			targetMenuEl.classList.add('open');
		}

		lastOpenedMenu = targetMenu;
	}
}

/**
 * Checks to see if the clicked element or it's descendants have a reference to a sub-menu.
 * @param evt - Passed in from click event.
 */
function handleSubMenuClick(evt) {
	let node = evt.target;
	let subMenuSelector = '';
	let maxBubble = 1;
	let isAnchor = node.getAttribute('href') ? node.getAttribute('href').match(/^#/) : false;

	if (isAnchor) {
		close();
		return false;
	}

	while (node.parentNode) {
		let attrSubMenu = node.getAttribute('data-submenu');
		if (attrSubMenu) {
			subMenuSelector = attrSubMenu;
			break;
		}
		node = node.parentNode;
	}

	if (subMenuSelector.length) {
		let panelToOpen = panelsOpen + 1;
		open(panelToOpen, subMenuSelector);
	}
}

/**
 * Adds a scroll event listener to the window
 * When the top of the root element is off the top of the screen,
 * adds a class of fixed to the container element.
 */
function setupStickyMenu() {
	window.addEventListener('scroll', function() {
		let navDockTop = element.getBoundingClientRect().top;
		if (navDockTop <= 0) {
			addClass(stickyElement, 'fixed');
		} else {
			removeClass(stickyElement, 'fixed');
		}
	});
}

/**
 * Adds breakpointChanged event listener to handle menu setup
 * for both mobile and desktop states.
 */
function setupBreakpointHandling() {
	window.addEventListener('breakpointChanged', function(evt) {
		removeBreakpointEventListeners();
		if (evt.breakpoint === 'mobile') {
			setupMobile();
		} else {
			if (evt.previousBreakpoint === 'mobile') {
				close();
				removeMobileElements();
			}
			setupDesktop();
		}
	});
}

/**
 * For caching event listeners that need to be removed once a breakpoint has changed.
 * @param {String} evtType
 * @param {HTMLElement} evtTarget
 * @param functionReference
 */
function addBreakpointEventListener(evtType, evtTarget, functionReference) {
	evtTarget.addEventListener(evtType, functionReference);
	breakpointEventListeners.push({type: evtType, target: evtTarget, fctn: functionReference});
}

/**
 * Removes all breakpoint specific event listeners.
 */
function removeBreakpointEventListeners() {
	if (breakpointEventListeners.length) {
		breakpointEventListeners.forEach(function(evtListener) {
			evtListener.target.removeEventListener(evtListener.type, evtListener.fctn);
		});
		breakpointEventListeners = [];
	}
}

/**
 * Removes elements from the dom that are specifically for mobile.
 */
function removeMobileElements() {
	let mobileElements = document.body.querySelectorAll('[class^="aosnMobile"]');
	Array.prototype.forEach.call(mobileElements, function(el) {
		el.parentNode.removeChild(el);
	});
}

/**
 * Initialises the menu ready for mobile.
 */
function setupMobile() {
	//Add mobile elements.

	createOverlay();

	for (var i = 1; i <= maxDepth; i++) {
		createPanel(i);
	}

	//Add click event to branding to open mobile menu.
	let navControl = element.querySelector('.aosnBranding');
	addBreakpointEventListener('click', navControl, open.bind(null, 1, 'aosnTopLevelMenu'));
}

/**
 * Initialises the menu ready for desktop.
 */
function setupDesktop() {
	isTouch = typeof window.ontouchstart !== 'undefined';

	if (isTouch) {
		let firstFirstLevelMenus = document.getElementById('aosnTopLevelMenu').children;
		Array.prototype.forEach.call(firstFirstLevelMenus, function(menuItem) {
			addBreakpointEventListener('touchstart', menuItem, touch);
			addBreakpointEventListener('mouseover', menuItem, touch);
		});
	} else {
		//Setup mouseover && mouse leave
		let elementsWithSubMenu = element.querySelectorAll('[data-submenu]');

		if (elementsWithSubMenu.length) {
			Array.prototype.forEach.call(elementsWithSubMenu, function(menuItem) {
				let targetMenu = document.getElementById(menuItem.getAttribute('data-submenu'));
				addBreakpointEventListener('mouseover', menuItem, hover.bind(null, targetMenu, 'open'));
				addBreakpointEventListener('mouseleave', menuItem, hover.bind(null, targetMenu, 'close'));
			});
		}
	}
}

/**
 * Creates a panel element and appends it to the body.
 * @param {number} id
 */
function createPanel(id) {
	//Create panel.
	let panel = document.createElement('div');
	panel.id = 'aosnPanel' + id;
	addClass(panel, 'aosnMobilePanel');

	//Create back button.
	let backButton = document.createElement('div');
	addClass(backButton, 'btnBack');
	backButton.innerHTML = getTranslation('back');
	addBreakpointEventListener('click', backButton, close.bind(null, id));

	//Create container for menu items.
	let navContainer = document.createElement('div');
	addClass(navContainer, 'navContainer');
	addBreakpointEventListener('click', navContainer, handleSubMenuClick);

	//Append elements.
	panel.appendChild(navContainer);
	panel.appendChild(backButton);
	document.body.appendChild(panel);
}

/**
 * Creates an overlay element and appends it to the body.
 * */
function createOverlay() {
	let overlay = document.createElement('div');
	addClass(overlay, 'aosnMobileOverlay');
	addClass(overlay, 'disable-scrolling');

	addBreakpointEventListener('click', overlay, close.bind(null, 0));

	document.body.appendChild(overlay);
}

/**
 * Initialises the standard sticky nav used across brand pages.
 * @param {HTMLElement} container - The outer node of the sticky nav.
 */
export default function navInit(container) {
	//Setup common elements:
	if (typeof container === 'string') {
		element = document.querySelector(container);
	} else {
		element = container;
	}
	stickyElement = element.children[0];
	let topUl = element.querySelector('#aosnTopLevelMenu');
	calcSubMenus(topUl);

	//Setup event listeners
	setupStickyMenu();
	setupBreakpointHandling();

	function init(){
		window.removeEventListener('breakpointChanged', init);
		if (window.breakpoint.value === 'mobile') {
			setupMobile();
		} else {
			setupDesktop();
		}

		let anchors = topUl.querySelectorAll('a[href^="#"]');

		Array.from(anchors).forEach(function(anchor){
			anchor.addEventListener('click', function(e){
				let href = e.target.getAttribute('href');
				e.preventDefault();
				jump(href, {
					duration: 900,
					offset: window.breakpoint.value === 'mobile' ? 0 : 35
				});
			});
		});
	}

	if (typeof window.breakpoint !== 'undefined') {
		init();
	} else {
		window.addEventListener('breakpointChanged', init);
	}
}
