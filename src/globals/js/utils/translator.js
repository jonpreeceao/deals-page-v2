let translations = {};
let lang = 'en-gb';
let client = '';

const translator = {
	setLang: function(value){
		lang = value;
	},

	setClient: function(value){
		client = value;
	},
	set: function(resource, value){
		var additions = {};
		additions[resource] = value;

		translations = Object.assign(translations, additions);
	},
	get: function(resource, name){
		resource = resource || 'default';

		if (client &&
			translations[resource] &&
			translations[resource][client] &&
			translations[resource][client][lang] &&
			translations[resource][client][lang][name]) {
			return translations[resource][client][lang][name];
		} else if (translations[resource] &&
					translations[resource][lang] &&
					translations[resource][lang][name]) {
			return translations[resource][lang][name];
		}
		return '';
	}
};

export default translator;


export function namespacedTranslator(resource) {
	return translator.get.bind(translator, resource);
}
