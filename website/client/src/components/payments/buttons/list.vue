<template>
  <div class="payments-column mx-auto mt-auto">
    <div v-if="user.contributor.admin">
      <button
        v-if="stripeAvailable"
        class="btn btn-primary payment-button payment-item with-icon"
        :class="{disabled}"
        :disabled="disabled"
        @click="stripeFn()"
      >
        <div
          v-once
          class="svg-icon color credit-card-icon"
          v-html="icons.creditCardIcon"
        ></div>
        {{ $t('card') }}
      </button>
    </div>
    <!-- <button
      v-if="paypalAvailable"
      class="btn payment-item paypal-checkout payment-button"
      :class="{disabled}"
      :disabled="disabled"
      @click="paypalFn()"
    >
      &nbsp;
      <img
        src="~@/assets/images/paypal-checkout.png"
        :alt="$t('paypal')"
      >&nbsp;
    </button>
    <amazon-button
      v-if="amazonAvailable"
      class="payment-item"
      :disabled="disabled"
      :amazon-data="amazonData"
    /> -->
  </div>
</template>

<style lang="scss" scoped>
  @import '~@/assets/scss/colors.scss';

  .payments-column {
    display: flex;
    flex-direction: column;
    width: 296px;
    justify-content: center;

    .payment-item {
      margin-bottom: 12px;
      display: flex;

      &.payment-button {
        display: flex;
        justify-content: center;
        align-items: center;

        .credit-card-icon {
          width: 21.3px;
          height: 16px;
          margin-right: 8.7px;
        }

        &.paypal-checkout {
          background: #009cde;

          img {
            width: 157px;
            height: 21px;
          }
        }
      }
    }
  }

  .disabled {
    opacity: 0.64;

    .btn, .btn:hover, .btn:active {
      box-shadow: none;
      cursor: default !important;
    }
  }
</style>

<script>
// import amazonButton from '@/components/payments/buttons/amazon';
import creditCardIcon from '@/assets/svg/credit-card-icon.svg';
import { mapState } from '@/libs/store';

export default {
  components: {
    // amazonButton,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    amazonData: {
      type: Object,
    },
    stripeFn: {
      type: Function,
    },
    paypalFn: {
      type: Function,
    },
  },
  data () {
    return {
      icons: Object.freeze({
        creditCardIcon,
      }),
    };
  },
  computed: {
    ...mapState({ user: 'user.data' }),
    stripeAvailable () {
      return typeof this.stripeFn === 'function';
    },
    paypalAvailable () {
      return typeof this.paypalFn === 'function';
    },
    amazonAvailable () {
      return this.amazonData !== undefined;
    },
  },
};
</script>
