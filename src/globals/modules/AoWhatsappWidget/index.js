import axios from 'axios';
import translator, { namespacedTranslator } from '../../js/utils/translator';
import translations from './translations';
import { formatString } from '../../js/utils/general-utils';

const whatsappWidgetUrl =
  '//widget.whatsbroadcast.com/widget_more/{widgetId}/?show=numbers';

function updateNumberEl(numberEl, number, link) {
  // Prefix number with a "+"
  numberEl.innerHTML = `+${number}`;
  // Link to the API so users can start the conversation more easily
  numberEl.setAttribute('href', link);
  // Open in new window and protect the window object with rel="noopener"
  // See https://jakearchibald.com/2016/performance-benefits-of-rel-noopener/
  numberEl.setAttribute('target', '_blank');
  numberEl.setAttribute('rel', 'noopener');
}

function setStatusComplete(container) {
  container.classList.add('is-loaded');
}

function setStatusLoading(container) {
  container.classList.add('is-loading');
}

function setStatusError(container) {
  container.classList.remove('is-loading');
  container.classList.add('has-error');
}

export default class AOWhatsappWidget {
  constructor(params) {
    this.setParams(params);

    if (this.container) {
      setStatusLoading(this.container);
      if (this.setNumber()) {
        setStatusComplete(this.container);
      } else {
        setStatusError(this.container);
      }
    }
  }

  setParams(params) {
    if (params.container instanceof HTMLElement) {
      this.container = params.container;
    } else {
      throw new Error('AOXScroll expects a HTMLElement');
    }
    if (params.widgetId) {
      this.widgetId = params.widgetId;
    } else {
      throw new Error('AOXScroll expects a widgetId');
    }
    this.startText = params.startText ? params.startText : 'Start';
  }

  setNumber() {
    const whatsappNumberEl = this.container.querySelector('.whatsapp-number');
    const requestUrl = formatString(whatsappWidgetUrl, {
      widgetId: this.widgetId
    });

    axios
      .get(requestUrl)
      .then(({ data }) => {
        try {
          const number = data[0];
          const link = `https://api.whatsapp.com/send?phone=${number}&text=${
            this.startText
          }`;

          updateNumberEl(whatsappNumberEl, number, link);
          return true;
        } catch (error) {
          throw new Error(error);
          return false;
        }
      })
      .catch(error => {
        return false;
        console.warn(error); // eslint-disable-line no-console
      });
  }
}
