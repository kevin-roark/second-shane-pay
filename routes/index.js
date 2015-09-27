var express = require('express');
var router = express.Router();
var braintree = require("braintree");
var braintreeConfig = require('./braintree-config');

var braintreeGateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: braintreeConfig.merchantID,
  publicKey: braintreeConfig.publicKey,
  privateKey: braintreeConfig.privateKey
});

router.get('/', function(req, res) {
  res.redirect('http://second.mistershane.com');
});

router.get("/braintree_token", function(req, res) {
  braintreeGateway.clientToken.generate({}, function (err, response) {
    if (err) {
      console.log('error generating token:');
      console.log(err);
      res.json({
        error: err
      });
      return;
    }

    res.json({
      token: response.clientToken
    });
  });
});

router.post("/checkout", function(req, res) {
  var nonce = req.body.payment_method_nonce;
  var amount = req.body.payment_amount || '2.00';
  var transactionParameters = {
    amount: amount,
    paymentMethodNonce: nonce
  };

  braintreeGateway.transaction.sale(transactionParameters, function(err, result) {
    if (err) {
      console.log('transation error: ');
      console.log(err);
      res.send({
        success: false,
        error: err
      });
      return;
    }

    res.send({
      success: true,
      amount: amount
    });
  });
});

module.exports = router;
