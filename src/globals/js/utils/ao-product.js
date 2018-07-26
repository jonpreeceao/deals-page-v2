import axios from 'axios';
import translator, { namespacedTranslator } from './translator';

const maxSkusPerCall = 60;
const productsHandler = '/ProductsHandler.axd';
const translations = {
	"en-GB": {
		"save": "Save",
		"was": "Was",
		"rrp": "RRP"
	},
	"de-DE": {
		"save": "",
		"was": "",
		"rrp": "SSP"
	},
	"nl-NL": {
		"save": "",
		"was": "",
		"rrp": ""
	}
};

function getLangFromClientCode(clientCode) {
	let lang = '';
	switch (clientCode.toLowerCase()) {
		case 'aol':
			lang = 'en-GB';
			break;
		case 'ade':
			lang = 'de-DE';
			break;
		case 'anl':
			lang = 'nl-NL';
			break;
		default:
			lang = 'en-GB';
	}
	return lang;
}


export class AoProduct {
	constructor(clientCode = 'aol', timeout = 10000) {
		this.timeout = timeout;
		this.clientCode = clientCode;

		translator.set('product', translations);
		translator.setLang(getLangFromClientCode(clientCode));
		this.getTranslation = namespacedTranslator('product');
	}

	get(query) {
		return new Promise((resolve, reject) => {
			let params = {};
			if (typeof query === 'undefined') {
				console.warn('MISSING_ARGUMENT: query is undefined'); //eslint-disable-line no-console
				reject('MISSING_ARGUMENT');
			} else if (query.hasOwnProperty('lister')) {
				params.productQuery = query.lister;
			} else if (query.hasOwnProperty('skus')) {
				params.products = query.skus.join(',');
			} else {
				console.warn('INVALID_ARGUMENT: query does not contain lister or skus'); //eslint-disable-line no-console
				reject('INVALID_ARGUMENT');
			}

			if (query.sortAscending) {
				params.sort = `${this.clientCode}_saleincvat`;
			}
			params.numberToReturn = query.numberToReturn || maxSkusPerCall;
			params.itemsperpagesize = params.numberToReturn;
			params.filterOutOfStock = query.filterOutOfStock || false;

			axios.get(`${productsHandler}`, {
				params,
				timeout: this.timeout
			}).then(function(response) {
				resolve(response);
			}).catch(function(e) {
				reject(e);
			});
		});
	}

	getLowestPrice(data, formatted = true) {
		return new Promise((resolve, reject) => {
			if (typeof data !== 'string') {
				console.warn('INVALID_ARGUMENT_TYPE: typeof data !== "string"'); //eslint-disable-line no-console
				reject('INVALID_ARGUMENT_TYPE');
			} else if (data.indexOf('/l/') !== 0) {
				console.warn('INVALID_ARGUMENT: String does not start with "/l/"'); //eslint-disable-line no-console
				reject('INVALID_ARGUMENT');
			} else {
				this.get({ lister: data, sortAscending: true, numberToReturn: 1 }).then(function(response) {
						let responseData = response.data;
						if (!responseData.length) {
							console.warn('HANDLER_ERROR: No data returned'); //eslint-disable-line no-console
							reject('HANDLER_ERROR');
						} else {
							resolve(formatted ? responseData[0].PricePodViewModel.FormattedNowPrice : responseData[0].Price);
						}
					})
					.catch(function(e) {
						console.warn('XHR_ERROR', e); //eslint-disable-line no-console
						reject('XHR_ERROR');
					});
			}
		});
	}

	getProducts(products, filterOutOfStock = false) {
		return new Promise((resolve, reject) => {
			let query = {};
			if (Array.isArray(products)) {
				if (products.length > this.maxSkusPerCall) {
					console.warn(`INVALID_ARGUMENT: length of products is greater than ${this.maxSkusPerCall}`); //eslint-disable-line no-console
					reject('INVALID_ARGUMENT');
				}
				query = { skus: products, filterOutOfStock };
			} else if (typeof products === 'string') {
				if (products.indexOf('/l/') !== 0) {
					console.warn('INVALID_ARGUMENT: String does not start with "/l/"'); //eslint-disable-line no-console
					reject('INVALID_ARGUMENT');
				}
				query = { lister: products, filterOutOfStock };
			} else {
				console.warn('INVALID_ARGUMENT_TYPE: products is not an array or a string'); //eslint-disable-line no-console
				reject('INVALID_ARGUMENT_TYPE');
			}
			this.get(query).then(function(response) {
					let responseData = response.data;
					if (!responseData.length) {
						console.warn('HANDLER_ERROR: No data returned'); //eslint-disable-line no-console
						reject('HANDLER_ERROR');
					} else {
						resolve(responseData);
					}
				})
				.catch(function(e) {
					console.warn('XHR_ERROR', e); //eslint-disable-line no-console
					reject('XHR_ERROR');
				});
		});
	}

	createPricePod(product, returnDomNode = true) {
		if (!product.hasOwnProperty('PricePodViewModel')) {
			return '';
		}
		let {
			WasPrice,
			NowPrice,
			RetailPriceIncVat,
			FormattedWasPrice,
			FormattedNowPrice,
			FormattedRetailPriceIncVat,
			FormattedRetailPriceSavings,
			FormattedSavePrice
		} = product.PricePodViewModel;
		let tplWas = '';
		if (WasPrice > 0 && WasPrice > NowPrice) {
			tplWas = `<span class="savings">${this.getTranslation('was')} ${FormattedWasPrice}<span class="percentage">${this.getTranslation('save').toUpperCase()} ${FormattedSavePrice}</span></span>`; //eslint-disable-line new-cap
		} else if (RetailPriceIncVat > 0 && RetailPriceIncVat > NowPrice) {
			tplWas = `<span class="savings">${this.getTranslation('rrp')} ${FormattedRetailPriceIncVat}<span class="percentage">${this.getTranslation('save').toUpperCase()} ${FormattedRetailPriceSavings}</span></span>`; //eslint-disable-line new-cap
		}
		let tplNow = `${FormattedNowPrice}`;
		if (returnDomNode) {
			let pricePod = document.createElement('div');
			pricePod.classList.add('price-information');
			if (tplWas.length) {
				pricePod.classList.add('has-saving');
			}
			pricePod.innerHTML = `${tplNow}${tplWas}`;
			return pricePod;
		}
		return `<div class="price-information${tplWas.length ? ' has-saving' : ''}">${tplNow}${tplWas}</div>`;
	}

	getPricePods(products, returnDomNodes = true, filterOutOfStock = false) {
		return this.getProducts(products, filterOutOfStock).then(response => {
				let pods = {};
				response.forEach(product => {
					pods[product.Code] = this.createPricePod(product, returnDomNodes);
				});
				return pods;
			})
			.catch(function(e) {
				console.warn('ERROR', e); //eslint-disable-line no-console
				return {};
			});
	}
}
