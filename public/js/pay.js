
$(function() {

  var $paymentPledgeInput = $('#payment-pledge-input');
  var $paymentPledgeError = $('#payment-pledge-error');
  var $makeThePledge = $('#make-the-pledge-button');
  var $pledgeEnter = $('#pledge-enter');
  var $thanksForPledging = $('#thanks-for-pledging');
  var $pledgedAmount = $('#pledged-amount');
  var $checkoutBlocker = $('#checkout-blocker');
  var $paymentError = $('#payment-error');

  var state = {
    validPaymentAmount: false
  };

  setTimeout(function() {
    $paymentPledgeInput.focus();
  }, 1000);

  function paymentAmountIsValid(valid) {
    state.validPaymentAmount = valid;
    if (valid) {
      $paymentPledgeInput.removeClass('invalid');
      $paymentPledgeInput.addClass('valid');
      $makeThePledge.removeClass('disabled');
      $makeThePledge.addClass('valid');
    }
    else {
      $paymentPledgeInput.addClass('invalid');
      $paymentPledgeInput.removeClass('valid');
      $makeThePledge.addClass('disabled');
      $makeThePledge.removeClass('valid');
    }
  }

  $paymentPledgeInput.change(function() {
    var value = Number($paymentPledgeInput.val());
    if (isNaN(value)) {
      paymentAmountIsValid(false);
      $paymentPledgeError.text('Shane Requests Number Payments Only');
    }
    else {
      var money = value.toFixed(2);
      if (money < 2) {
        paymentAmountIsValid(false);
        $paymentPledgeError.text('Shane Requests at least $2.00 U.S. Dollars');
      }
      else {
        paymentAmountIsValid(true);
        $paymentPledgeError.text('');
      }

      $paymentPledgeInput.val(money);
    }
  });

  $makeThePledge.click(function() {
    if (!state.validPaymentAmount || state.pledgedPaymentAmount) {
      return;
    }

    var amount = Number($paymentPledgeInput.val()).toFixed(2);
    state.pledgedPaymentAmount = amount;
    $pledgedAmount.text('$' + amount + ' U.S. Dollars');

    $pledgeEnter.fadeOut(500, function() {
      $thanksForPledging.fadeIn(500);
    });

    $checkoutBlocker.fadeOut(800);
    setupBraintree();
  });

  function setupBraintree() {
    $.getJSON('/braintree_token', function(data) {
      if (!data.token) {
        console.log('fuck');
        return;
      }

      braintree.setup(data.token, "dropin", {
        container: "payment-form",
        onReady: readyToPay,
        onPaymentMethodReceived: paymentMethodRecieved,
        onError: paymentMethodError
      });
    });
  }

  function readyToPay() {}

  function paymentMethodError(err) {
    console.log('payment error...');
    console.log(err);
  }

  function paymentMethodRecieved(paymentData) {
    if (state.hasSubmittedPayment) {
      return;
    }

    state.hasSubmittedPayment = true;
    $paymentError.text('');

    var postParameters = {
      payment_method_nonce: paymentData.nonce,
      payment_amount: state.pledgedPaymentAmount
    };
    $.post('/checkout', postParameters, function(checkoutData) {
      if (!checkoutData.success) {
        console.log('error making transaction:');
        console.log(checkoutData.error);
        $paymentError.text('Transaction Error ... Please Submit Again.');
        state.hasSubmittedPayment = false;
      }
      else {
        grantRewardsWithAmount(Number(checkoutData.amount));
      }
    });
  }

  function grantRewardsWithAmount(amount) {
    var $paymentContainer = $('#payment-container');
    var $rewardContainer = $('#reward-container');
    var $archiveDownloadLink = $('#archive-download-link');
    var $coupon = $('#coupon');
    var ArchiveDownloadURL = '/fully-downloadable-complete-offline-second-shane-archive-computer.zip';
    var SmallRewardCoupon = 'GetWhatYouEarned';
    var LargeRewardCoupon = 'TheMoneyYouPaidWillHaveAnImpactOnHumanLives';

    $paymentContainer.fadeOut(800, function() {
      setTimeout(function() {
        $archiveDownloadLink.attr('href', ArchiveDownloadURL);

        var hasLargeCoupon = amount > 2;
        $coupon.text(hasLargeCoupon ? LargeRewardCoupon : SmallRewardCoupon);

        $rewardContainer.fadeIn(200);
      }, 200);
    });
  }

});
