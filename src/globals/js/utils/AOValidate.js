/* eslint-disable no-bitwise */
/* eslint-disable max-len */

// regex for each type of input
const regex = {
	email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	name: /^[a-zA-ZÀ-ž-\s'\.\-]+$/,
	password: /^[\w\W]+$/,
	textarea: /^[ A-Za-z0-9_@.<>\/#=&+*^;:\$£"\?!()%{}-]+$/,
	url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
	tel: /^[\s-\d()+#]+$/,

	postcodeUK: /^((GIR 0AA)|([A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}))$/
};

const typeTests = {
	email: function(value) {
		return regex.email.test(value);
	},
	name: function(value) {
		return regex.name.test(value);
	},
	password: function(value) {
		return regex.password.test(value);
	},
	textarea: function(value){
		regex.textarea.test(value);
	},
	url: function(value){
		return regex.url.test(value);
	},
	tel: function(value) {
		return regex.tel.test(value);
	},

	// Swiped from http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/additional-methods.js
	//phoneUK: /^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/,
	phoneUK: function(value){
		let v = value.replace(/\(|\)|\s+|-/g, '');
		return v.length > 9 && v.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/);
	},

	//mobileUK: /^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[45789]\d{2}|624)\s?\d{3}\s?\d{3})$/
	mobileUK: function(value){
		let v = value.replace(/\(|\)|\s+|-/g, '');
		return v.length > 9 && v.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[45789]\d{2}|624)\s?\d{3}\s?\d{3})$/);
	},

	creditCardTypes: function(value, param = { mastercard: true, visa: true, amex: true }){
		if (/[^0-9\-]+/.test(value)) {
			return false;
		}

		let v = value.replace(/\D/g, '');

		var validTypes = 0x0000;

		if (param.mastercard) {
			validTypes |= 0x0001;
		}
		if (param.visa) {
			validTypes |= 0x0002;
		}
		if (param.amex) {
			validTypes |= 0x0004;
		}
		if (param.dinersclub) {
			validTypes |= 0x0008;
		}
		if (param.enroute) {
			validTypes |= 0x0010;
		}
		if (param.discover) {
			validTypes |= 0x0020;
		}
		if (param.jcb) {
			validTypes |= 0x0040;
		}
		if (param.maestro) {
			validTypes |= 0x0080;
		}
		if (param.unknown) {
			validTypes |= 0x0100;
		}
		if (param.all) {
			validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080 | 0x00100;
		}
		if (validTypes & 0x0001 && /^(5[12345])/.test(v)) { //mastercard
			return v.length === 16;
		}
		if (validTypes & 0x0002 && /^(4)/.test(v)) { //visa
			return v.length === 16;
		}
		if (validTypes & 0x0004 && /^(3[47])/.test(v)) { //amex
			return v.length === 15;
		}
		if (validTypes & 0x0008 && /^(3(0[012345]|[68]))/.test(v)) { //dinersclub
			return v.length === 14;
		}
		if (validTypes & 0x0010 && /^(2(014|149))/.test(v)) { //enroute
			return v.length === 15;
		}
		if (validTypes & 0x0020 && /^(6011)/.test(v)) { //discover
			return v.length === 16;
		}
		if (validTypes & 0x0040 && /^(3)/.test(v)) { //jcb
			return v.length === 16;
		}
		if (validTypes & 0x0040 && /^(2131|1800)/.test(v)) { //jcb
			return v.length === 15;
		}
		if(validTypes & 0x0080 && /^(5[06-7]|6)/.test(v)) { //maestro
			return v.length === 15;
		}
		if (validTypes & 0x0100) { //unknown
			return true;
		}

		//TODO: use Luhn for checksum https://en.wikipedia.org/wiki/Luhn_algorithm

		return false;
	},

	postcodeUK: function(value){
		let v = value.toLocaleUpperCase();
		return regex.postcodeUK.test(v);
	}
};

// regex for replacing tags and special characters
const tagsRegex = /(<([^>]+)>)/gi;
const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script(\s+)?>/gi;

/* Private Functions */

function findAndAddInputs(){
	var inputs = this.form.querySelectorAll('input, select, textarea');
	var len = inputs.length;
	for(var i = 0; i < len; i++) {
		var type = inputs[i].type;
		// if the inputs are supported store them
		if(type !== 'hidden' && type !== 'button' && type !== 'submit' && type !== 'radio' && type !== 'checkbox') {
			this.addInput(inputs[i]);
		}
	}
}

function onFormSubmit(event){
	this.run(event);

	if(!this.isValid) {
		if(event.preventDefault) {
			event.preventDefault();
		}else{
			event.returnValue = false;
		}

		if(event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		}
	}

	// if all is valid remove all validation error messages, remove script tags and html if necessary, then submit
	if(this.isValid) {

		this.inputs.forEach((inputObj, input) => {

			input.value = inputObj.value = input.value.replace(scriptRegex, '');

			if(input.getAttribute('data-validate-remove-html') !== 'false') {
				input.value = inputObj.value = input.value.replace(tagsRegex, '');
			}

		});

		if(this.onValidSubmit){
			this.onValidSubmit.call(this.form, event);
		}

	}
}

function  onChange(inputObj, event) {
	this.validate(inputObj, event);
}

function dispatchValidateEvent(input, status){
	var e = document.createEvent('Event');
	e.initEvent(this.eventName, true, true);
	e.isValid = status.isValid || false;
	e.sourceEventType = status.sourceEventType || null;
	e.validityState = status.validityState || {};
	input.dispatchEvent(e);
}

/* Validation Functions */

let InputTests = {};
InputTests.required = function(inputObj){

	// Make sure the field isn't just full of spaces
	const realChars = inputObj.value.split('').filter(char => char !== ' ');

	if(realChars.length === 0 && inputObj.required) {
		inputObj.validityState.valid = false;
		inputObj.validityState.valueMissing = true;
	}

	return inputObj.validityState.valid;
};

InputTests.size = function(inputObj){
	if(inputObj.value) {
		if (inputObj.value.length < inputObj.minlength) {
			inputObj.validityState.valid = false;
			inputObj.validityState.tooShort = true;
		}

		if (inputObj.value.length > inputObj.maxlength) {
			inputObj.validityState.valid = false;
			inputObj.validityState.tooLong = true;
		}
	}

	return inputObj.validityState.valid;
};

InputTests.eqaulity = function(inputObj){
	if(inputObj.value) {
		if (inputObj.eqTarget) {
			if (inputObj.eqTarget.value !== inputObj.value) {
				inputObj.validityState.valid = false;
				inputObj.validityState.equalityError = true;
			}
		}
	}

	return inputObj.validityState.valid;
};

/**
 * Custom validation may manipulate input so it must execute the validation function even if value empty.
 * @param inputObj
 * @param validateFns - Object with validationFn names as keys
 * @returns {boolean}
 */
InputTests.customFunction = function(inputObj, validateFns){
	validateFns = validateFns || {};
	if (inputObj.validateFn && typeof validateFns[inputObj.validateFn] == 'function') {
		var validateFn = validateFns[inputObj.validateFn];
		if (!validateFn(inputObj.input)) {
			inputObj.validityState.valid = false;
			inputObj.validityState.customError = true;
		}
	}

	return inputObj.validityState.valid;
};

InputTests.pattern = function(inputObj){
	var pattern = inputObj.pattern;
	if(inputObj.value){
		var isValid = true;
		if(pattern){
			try {
				isValid = pattern.test(inputObj.value);
			}catch(e){
				isValid = false;
			}
		}

		if(!isValid){
			inputObj.validityState.valid = false;
			inputObj.validityState.patternMismatch = true;
		}
	}

	return inputObj.validityState.valid;
};

InputTests.type = function(inputObj, customTypeTest){
	var typeTest = typeTests[inputObj.type] || customTypeTest[inputObj.type];
	if(inputObj.value){
		var isValid = true;
		if(typeTest){
			try {
				isValid = typeTest(inputObj.value);
			}catch(e){
				isValid = false;
			}
		}

		if(!isValid){
			inputObj.validityState.valid = false;
			inputObj.validityState.typeMismatch = true;
		}
	}

	return inputObj.validityState.valid;
};

function isInvalidOption(option){
	var placeholder = option.getAttribute('data-validate-option-placeholder');
	var noSelect = option.getAttribute('data-validate-noselect');
	return (noSelect && noSelect.toLowerCase() === 'true') || (placeholder && placeholder.toLowerCase() === 'true'); //eslint-disable-line no-extra-parens
}

let SelectTests = {};
SelectTests.required = function(inputObj) {
	if(inputObj.required){
		var input = inputObj.input;
		if(input.multiple){
			for (var i = 0; i < input.options.length; i++) {
				let option = input.options[i];
				if(isInvalidOption(option)){
					inputObj.validityState.valid = false;
					inputObj.validityState.valueMissing = true;
				}
			}
		}else{
			if(isNaN(input.selectedIndex) || input.selectedIndex === -1){ //eslint-disable-line no-lonely-if
				inputObj.validityState.valid = false;
				inputObj.validityState.badInput = true;
			} else {
				let option = input.options[input.selectedIndex];
				if(isInvalidOption(option)){
					inputObj.validityState.valid = false;
					inputObj.validityState.valueMissing = true;
				}
			}
		}
	}

	return inputObj.validityState.valid;
};

export class AOValidate {
	constructor(form, settings) {

		this.form = form;

		settings = settings || {};

		/* Settings */
		this.onValidCallback = settings.onValid || null;
		this.onInValidCallback = settings.onInValid || null;
		this.onValidSubmit = settings.onSubmit || null;
		this.validateFns = settings.validateFns || {};
		this.eventName = settings.eventName || 'ao-validate';
		this.typeTests = {};

		this.groups = new Map();

		if(settings.groups){
			let invalidSettings = ['id', 'items', 'named', 'validate'];
			for(var groupName in settings.groups){
				if(settings.groups.hasOwnProperty(groupName)){
					let group = this.getGroup(groupName);
					let groupDefn = settings.groups[groupName];
					for(var groupSetting in groupDefn){
						if(groupSetting === 'validate'){
							group.validate = groupDefn[groupSetting];
						}else if(invalidSettings.indexOf(groupSetting) === -1){
							group[groupSetting] = groupDefn[groupSetting];
						}
					}
				}
			}
		}

		/* Derived */
		this.isValid = false;
		this.inputs = new Map();
		this.onFormSubmit = onFormSubmit.bind(this);

		form.addEventListener('submit', this.onFormSubmit, false);

		findAndAddInputs.call(this);
	}

	getGroup(name){
		let group = this.groups.get(name);
		if(!group){
			group = {
				id: name,
				items: [],
				named: {},
				settings: {},
				validate: null
			};
			this.groups.set(name, group);
		}
		return group;
	}

	//TODO: getter/setter for form
	//TODO: applySettings(settings)

	/**
	 * Adds an Input to the validator.
	 * @param {[type]} input [description]
	 */
	addInput(input){
		// pull all data attributes, store them and listen for blur, keyup / change events
		var length = input.getAttribute('data-validate-length');
		if(length){
			length = length.split(',');
		}


		var value = null;
		if(input.type === 'select-one'){
			if(input.selectedIndex > -1){
				value = input.options[input.selectedIndex].value;
			}
		}else{
			value = input.value;
		}

		var eqTarget = null;
		if(input.getAttribute('data-validate-equals')) {
			eqTarget = document.getElementById(input.getAttribute('data-validate-equals'));
		}

		var inputObj = {
			input: input,
			minlength: length ? length[0] : Math.max(input.minLength || 0, 0),
			maxlength: length ? length[1] : (input.maxLength > 0 ? input.maxLength : 50),
			type: input.getAttribute('data-validate-type') || input.type,
			required: input.getAttribute('data-validate-required') || input.required || input.getAttribute('required') || false,
			value: value,
			pattern: input.pattern || input.getAttribute('data-validate-pattern') ? new RegExp(input.pattern || input.getAttribute('data-validate-pattern')) : null,
			validateFn: input.getAttribute('data-validate-fn'),
			eqTarget: eqTarget,
			group: input.getAttribute('data-validate-group'),
			validityState: { valid: false }

		};

		inputObj.onChange = onChange.bind(this, inputObj);

		var type = input.type === 'select-one' ? 'change' : 'input';

		if(type !== 'change'){
			input.addEventListener(type, inputObj.onChange);
		}
		input.addEventListener('change', inputObj.onChange);
		input.addEventListener('blur', inputObj.onChange);

		if(eqTarget){
			if(type !== 'change'){
				eqTarget.addEventListener(type, inputObj.onChange);
			}
			eqTarget.addEventListener('change', inputObj.onChange);
			eqTarget.addEventListener('blur', inputObj.onChange);
		}

		if(inputObj.group){
			var group = this.getGroup(inputObj.group);
			group.items.push(inputObj);
			if(input.name){
				group.named[input.name] = inputObj;
			}
		}

		this.inputs.set(input, inputObj);

		return inputObj;
	}

	removeInput(input){
		let inputObj = this.inputs.get(input);

		if(inputObj){
			var type = input.type === 'select-one' ? 'change' : 'input';

			if(type !== 'change'){
				input.removeEventListener(type, inputObj.onChange);
			}
			input.removeEventListener('change', inputObj.onChange);
			input.removeEventListener('blur', inputObj.onChange);

			if(inputObj.eqTarget){
				if(type !== 'change'){
					inputObj.eqTarget.removeEventListener(type, inputObj.onChange);
				}
				inputObj.eqTarget.removeEventListener('change', inputObj.onChange);
				inputObj.eqTarget.removeEventListener('blur', inputObj.onChange);
			}

			if(inputObj.group){
				var group = this.getGroup(inputObj.group);
				let itemIndex = group.items.indexOf(inputObj);
				if(itemIndex > -1){
					group.items.splice(itemIndex, 1);
				}
				if(input.name){
					group.named[input.name] = null;
				}
			}

			for(let prop in inputObj){
				inputObj[prop] = null;
			}
		}

		this.inputs.delete(input);
	}

	validate(inputObj, event){
		var input = inputObj.input;

		inputObj.value = input.type === 'select' ? input.options[input.selectedIndex].value : input.value;

		// IE9 .hasPlaceholder watermark fix.
		if(inputObj.value === inputObj.input.getAttribute('placeholder')){
			inputObj.value = '';
		}

		inputObj.validityState = { valid: true };

		if(inputObj.type === 'select-one' || inputObj.type === 'select-multiple') {
			SelectTests.required(inputObj);
		} else {
			InputTests.required(inputObj);
			InputTests.size(inputObj);
			InputTests.eqaulity(inputObj);
			InputTests.customFunction(inputObj, this.validateFns);
			InputTests.pattern(inputObj);
			InputTests.type(inputObj, this.typeTests);
		}

		if(inputObj.group){
			var group = this.getGroup(inputObj.group);
			if(group.validate){
				group.validate(group, event);
			}
		}

		this.isInputValid(inputObj, event);
	}

	hasInvalidity(inputObj){
		let v = inputObj.validityState;
		for(let invalidity in v){
			if(invalidity !== 'valid'){
				return true;
			}
		}
		return false;
	}

	isInputValid(inputObj, event) {

		if(inputObj.validityState.valid){
			if(this.onValidCallback) {
				this.onValidCallback(inputObj.input, event, inputObj.validityState);
			}
		} else {
			if(this.onInValidCallback){ // eslint-disable-line no-lonely-if
				this.onInValidCallback(inputObj.input, event, inputObj.validityState);
			}
		}

		dispatchValidateEvent.call(this, inputObj.input, { isValid: inputObj.validityState.valid, sourceEventType: event ? event.type : null, validityState: inputObj.validityState });
	}

	run(event) {
		if(!event){
			event = {};
		}

		this.isValid = true;

		this.inputs.forEach((inputObj) => {
			this.validate(inputObj, event);

			if(inputObj.validityState.valid !== true) {

				if(inputObj.required) {
					this.isValid = false;
				}

				this.isValid = false;
			}
		});

	}

	reset(updateInputs) {
		this.inputs.forEach((inputObj) => {
			inputObj.validityState = { valid: true };
			this.isInputValid(inputObj, window.event);
		});

		if(updateInputs){
			this.inputs.forEach((inputObj) => {
				this.removeInput(inputObj.input);
			});

			findAndAddInputs.call(this);
		}
	}

	addValidateFunction(name, fn){
		if(typeof name == 'string' && typeof fn == 'function'){
			this.validateFns[name] = fn;
		}
	}

	addTypeTest(name, fn){
		if(typeof name == 'string' && typeof fn == 'function' && !this.typeTests[name]){
			this.typeTests[name] = fn;
		}
	}
}

export default AOValidate;
