// import nconf from 'nconf';

// import { getStripeApi } from './api';
import {
  // NotAuthorized,
  NotFound,
} from '../../errors';
import { // eslint-disable-line import/no-cycle
  model as Group,
  basicFields as basicGroupFields,
} from '../../../models/group';
import shared from '../../../../common';
import { getOneTimePaymentInfo, applyGemPayment } from './oneTimePayments'; // eslint-disable-line import/no-cycle
// import { applyGemPayment } from './oneTimePayments';
// import { checkSubData } from './subscriptions'; // eslint-disable-line import/no-cycle
import { validateGiftMessage } from '../gems'; // eslint-disable-line import/no-cycle

// const BASE_URL = nconf.get('BASE_URL');

export async function createCheckoutSession (options) {
  const {
    user,
    gift,
    gemsBlock: gemsBlockKey,
    sub,
    // groupId,
    // coupon,
  } = options;
  // @TODO: We need to mock this, but curently we don't have correct
  // Dependency Injection. And the Stripe Api doesn't seem to be a singleton?
  // let stripeApi = getStripeApi();
  // if (stripeInc) stripeApi = stripeInc;

  let type = 'gems';
  if (gift) {
    type = gift.type === 'gems' ? 'gift-gems' : 'gift-sub';
    validateGiftMessage(gift, user);
  } else if (sub) {
    type = 'subscription';
  }

  const metadata = {
    gift: gift ? JSON.stringify(gift) : undefined,
    userId: user._id,
    // sub: sub ? JSON.stringify(sub) : undefined,
  };

  if (type === 'subscription') {
    metadata.subscription = user._id;
  } else {
    const {
      amount,
      gemsBlock,
      subscription,
    } = await getOneTimePaymentInfo(gemsBlockKey, gift, user);
    metadata.gemsBlock = gemsBlock ? gemsBlock.key : undefined;
    metadata.amount = amount;
    metadata.subscription = subscription;
  }
  const session = {
    metadata,
    customer: 'customer-id',
  };

  await applyGemPayment(session);

  return session;
}

export async function createEditCardCheckoutSession (options) {
  const {
    user,
    groupId,
  } = options;

  const type = groupId ? 'edit-card-group' : 'edit-card-user';

  if (type === 'edit-card-group') {
    const groupFields = basicGroupFields.concat(' purchased');
    const group = await Group.getGroup({
      user, groupId, populateLeader: false, groupFields,
    });
    if (!group) {
      throw new NotFound(shared.i18n.t('groupNotFound', user.preferences.language));
    }
  }
  return '/redirect/stripe-success-checkout';
}
