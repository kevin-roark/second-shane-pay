
$(function() {
  $.getJSON('/braintree_token', function(data) {
    if (!data.token) {
      console.log('fuck');
      return;
    }

    braintree.setup(data.token, "dropin", {
      container: "payment-form",
      onReady: function() {
        console.log('ready to pay shane...');
      },
      onPaymentMethodReceived: function(paymentData) {
        var postParameters = {
          payment_method_nonce: paymentData.nonce
        };
        $.post('/checkout', postParameters, function(checkoutData) {
          console.log(checkoutData);
        });
      },
      onError: function(err) {
        console.log(err);
      }
    });
  });

});
