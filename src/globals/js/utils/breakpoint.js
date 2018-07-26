class Breakpoint {

	constructor(params) {
		const { container, eventName } = params;
		this.container = container && container instanceof HTMLElement ? container : document.body;
		this.eventName = eventName || 'breakpointChanged';
		this.value = '';
		this.hasInitialised = false;
	}

	refreshValue() {
		let oldValue = this.value;
		let newValue = window.getComputedStyle(this.container, ':before').getPropertyValue('content').replace(/\"/g, '');
		this.value = newValue;

		if (newValue != oldValue) {
			var e = document.createEvent('Event');
			e.initEvent(this.eventName, true, true);
			e.breakpoint = newValue;
			e.previousBreakpoint = oldValue;
			window.dispatchEvent(e);
		}
	}

	init() {
		if (!this.hasInitialised) {
			this.hasInitialised = true;
			this.refreshValue();
			window.addEventListener('resize', (evt) => this.refreshValue(evt));
		}
	}
}

export default Breakpoint;
