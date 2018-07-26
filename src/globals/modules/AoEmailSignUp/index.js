import AOValidate from '../../js/utils/AOValidate';
import axios from 'axios';
import { addClass, removeClass } from '../../js/utils/dom-utils';

const aoSignUpEmail = {
  bindSubmit: function bindSubmit() {
    let submit = document.querySelector('.submit-email-button');

    submit.addEventListener('click', e => {
      e.preventDefault();
      aoSignUpEmail.submitEntry(); // check this.
    });
  },

  pageInit: function pageInit() {
    let container = document.getElementById('email-signup');

    if (!container) {
      return false;
    }

    let url = window.location.hash;
    this.bindSubmit();
    this.validator = new AOValidate(container);
    let error = container.querySelector('.email-error');

    container.addEventListener('ao-validate', e => {
      if (
        (e.sourceEventType === 'submit' || e.sourceEventType === 'blur') &&
        !e.validityState.valid
      ) {
        addClass(error, 'show');
      } else if (e.sourceEventType === 'input' && e.validityState.valid) {
        removeClass(error, 'show');
      }
    });
    if (localStorage.getItem('aoSignUpEmail') !== null) {
      container.style.display = 'none';
    }
  },

  postData: function postData(entry) {
    let options = {
      url: '/HttpHandlers/EmailCommunicationHandler.ashx',
      data: {
        email: entry.yourEmail,
        firstname: entry.firstName,
        lastname: entry.lastName
      }
    };

    axios
      .post(options.url, options.data)
      .then(function(response) {
        document.getElementById('email-signup-field').value = '';
        let success = document.querySelector('.email-success');
        addClass(success, 'show');
        let inputFields = document.querySelector('.submit-email');
        inputFields.parentNode.removeChild(inputFields);
      })
      .catch(function(response) {
        let error = document.querySelector('.email-error');
        error.innerText = 'Hmm... something went wrong';
        addClass(error, 'show');
        console.log(response);
      });
  },

  submitEntry: function submitEntry() {
    let entry = {
      yourEmail: document.getElementById('email-signup-field').value,
      firstName: '',
      lastName: ''
    };

    this.validator.run({ type: 'submit' });
    let error = document.querySelector('.email-error');

    if (this.validator.isValid) {
      removeClass(error, 'show');
      localStorage.setItem('aoSignUpEmail', entry.yourEmail);
      this.postData(entry);
    } else {
      addClass(error, 'show');
    }
  }
};

export default aoSignUpEmail;
