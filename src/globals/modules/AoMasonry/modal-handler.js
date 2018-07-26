import { hasClass, removeClass, addClass } from '../../js/utils/dom-utils';
import { hasId, stickyElement } from './utils';
import { breakpoint } from './index.js';

export class ModalHandler {
	constructor() {
		this.closeModalEventReference = [];
		this.scrollPos = 0;
		this.stage = document.getElementById('modal-tech');
		this.stageContainer = document.querySelector('.modal-tech-wrapper');
		this.mainContainer = document.querySelector('.masonry-container');
		this.handleTriggers(document.querySelectorAll('.item-link'));
	}

	handleTriggers(triggers) {
		Array.prototype.forEach.call(triggers, trigger => {
			trigger.addEventListener('click', this.openModal.bind(this));
		});
	}

	createCloseModalEvents() {

		// Add a reference of the event listener into the array so we can remove it later
		this.closeModalEventReference.push({
			eventTarget: document,
			eventType: 'keyup',
			eventRef: this.closeModal.bind(this)
		});
		document.addEventListener('keyup', this.closeModalEventReference[0].eventRef);

		const closeTriggers = document.querySelectorAll('#modal-bg, #modal-tech, .modal-tech-wrapper, .close-modal-tech');
		Array.from(closeTriggers).forEach(closeTrigger => {
			this.closeModalEventReference.push({
				eventTarget: closeTrigger,
				eventType: 'click',
				eventRef: this.closeModal.bind(this)
			});
			const eventIndex = this.closeModalEventReference.length - 1;
			closeTrigger.addEventListener('click', this.closeModalEventReference[eventIndex].eventRef);
		});
	}

	deleteCloseModalEvents() {
		this.closeModalEventReference.forEach((event) => {
			event.eventTarget.removeEventListener(event.eventType, event.eventRef);
		});
	}

	openModal(event) {
		event.stopPropagation();
		event.stopImmediatePropagation();

		this.scrollPos = window.scrollY;

		const col = event.currentTarget;
		const sku = col.getAttribute('data-sku-parent');

		if (col) {
			addClass(col, 'cat-growfromnormal');
			addClass(this.stageContainer, 'show');
			addClass(document.body, 'modal-opened');

			setTimeout(() => {
				addClass(this.stage, 'cat-growfromsmall');
				addClass(this.stageContainer, 'shown');
				this.stage.style.display = 'block';

				const childElm = document.querySelector(`[data-sku="${sku}"]`);
				addClass(childElm, 'show');
			}, 250);

			setTimeout(() => {
				this.stickyElementHandler = stickyElement(this.stageContainer, this.mainContainer);
				window.addEventListener('scroll', this.stickyElementHandler);
				this.stickyElementHandler();
			}, 250);

			this.createCloseModalEvents();
		}
	}

	closeModal(event) {

		const srcElement = event.target || event.srcElement;

		if (event.type === 'keyup') {
			// Close modal if Esc key is pressed
			if (typeof event.keyCode !== 'undefined' && event.keyCode && event.keyCode !== 27) {
				return;
			}
		} else if (
			 !hasId(srcElement, 'modal-bg') &&
			 !hasClass(srcElement, 'modal-tech-wrapper') &&
			 !hasClass(srcElement, 'close-modal-tech') &&
			 !hasId(srcElement, 'modal-tech')
			) {
			return;
		}

		// Tidy up and remove the close modal event listeners
        this.deleteCloseModalEvents();

		event.stopPropagation();
		event.stopImmediatePropagation();

		window.removeEventListener('scroll', this.stickyElementHandler);

		const activeStage = this.stage.querySelector('.modal-content.show');

		addClass(this.stage, 'cat-shrinkfromnormal');
		removeClass(this.stage, 'cat-growfromsmall');
		removeClass(this.stageContainer, 'shown');
		removeClass(document.body, 'modal-opened');

		setTimeout(() => {
			const originalColumn = document.querySelector('.item-link.item.cat-growfromnormal');
			if (originalColumn) {
				addClass(originalColumn, 'cat-shrinkfromlarge');
				removeClass(originalColumn, 'cat-growfromnormal');
			}

			setTimeout(() => {
				if (originalColumn) {
					removeClass(originalColumn, 'cat-shrinkfromlarge');
				}
				removeClass(activeStage, 'show');
				removeClass(this.stage, 'cat-shrinkfromnormal');
				removeClass(this.stageContainer, 'show');
				this.stageContainer.removeAttribute('style');
				this.stage.style.display = '';

				if (breakpoint.value.indexOf('mobile') > -1) {
					// Scroll the user back to where they were when they first clicked the modal
					// but only on smaller screens, as this behaviour is disorientating on larger screens)
					window.scrollTo(window.scrollX, this.scrollPos);
				}

			}, 250);
		}, 250);
	}
}
