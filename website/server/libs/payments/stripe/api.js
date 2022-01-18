import stripeModule from 'stripe';
import nconf from 'nconf';

let stripe = stripeModule('test');

function setStripeApi (stripeInc) {
  stripe = stripeInc;
}

function getStripeApi () {
  return stripe;
}

export { getStripeApi, setStripeApi };
