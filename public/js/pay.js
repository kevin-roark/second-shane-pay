
$(function() {

  var $paymentPledgeInput = $('#payment-pledge-input');
  var $paymentPledgeError = $('#payment-pledge-error');
  var $makeThePledge = $('#make-the-pledge-button');
  var $returnURLInput = $('#return-url-input');

  validatePledgeInput();

  setTimeout(function() {
    $paymentPledgeInput.focus();
  }, 250);

  function paymentAmountIsValid(valid, ignorePledgeInput) {
    if (valid) {
      if (!ignorePledgeInput) {
        $paymentPledgeInput.removeClass('invalid');
        $paymentPledgeInput.addClass('valid');
      }
      $makeThePledge.attr('disabled', false);
      $makeThePledge.addClass('valid');
    }
    else {
      if (!ignorePledgeInput) {
        $paymentPledgeInput.addClass('invalid');
        $paymentPledgeInput.removeClass('valid');
      }
      $makeThePledge.attr('disabled', true);
      $makeThePledge.removeClass('valid');
    }
  }

  function validatePledgeInput() {
    var rawVal = $paymentPledgeInput.val();
    if (rawVal === undefined || rawVal.length === 0) {
      paymentAmountIsValid(false, true);
      return;
    }

    var value = Number(rawVal);
    if (isNaN(value)) {
      paymentAmountIsValid(false);
      $paymentPledgeError.text('Shane Requests Money Payments Only');
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

        var returnURL = 'http://www.secondshane.website/success/?amount=' + money;
        $returnURLInput.val(returnURL);
      }

      $paymentPledgeInput.val(money);
    }
  }

  $paymentPledgeInput.change(function() {
    validatePledgeInput();
  });

});
