/* eslint max-len:0 */
import axios from 'axios';

export const NO_PRODUCT = 'No product.';
export const NO_PRICE = 'No price.';

const productHandlerUrl = (window.location.hostname === 'ao.com' ? '//content.ao.com/' : '') + '/ProductsHandler.axd';
const helpMeChooseUrl = '/handler/helpmechoose/query';

function queryProductHandler(listerUrl) {
	return new Promise((resolve, reject) => {
		return axios.get(`${productHandlerUrl}?productQuery=${listerUrl}&sort=aol_saleincvat&numberToReturn=1`, { timeout: 10000 })
			.then(response => {
				if (response.status < 200 || response.status >= 300 || !response.data) {
					reject('SERVER ERROR: ' + response.status);
					return;
				}
				resolve(response.data);
			});
	});
}

function queryHelpMeChoose(queries) {
	return new Promise((resolve, reject) => {

		let request = {
			restrictBuckets: false,
			queries: queries
		};

		return axios.post(helpMeChooseUrl, request, { timeout: 10000 })
			.then(response => {
				if (response.status < 200 || response.status >= 300 || !response.data) {
					reject('SERVER ERROR: ' + response.status);
					return;
				}
				resolve(response.data);
			});
	});
}

export function getLowestPrice(target) {
	if (typeof target === 'string') {
		return queryProductHandler(target)
			.then(response => {
				if (!response || response.length === 0) {
					throw new Error(NO_PRODUCT);
				} else if (!(response[0].PricePodViewModel && response[0].PricePodViewModel.NowPrice)) {
					throw new Error(NO_PRICE);
				}
				return Number.parseFloat(response[0].PricePodViewModel.NowPrice);
			});
	}
	return queryHelpMeChoose(target)
		.then(response => {
			if (typeof response.MinProductPrice === 'undefined') {
				throw new Error(NO_PRICE);
			}
			return Number.parseFloat(response.MinProductPrice);
		});
}
