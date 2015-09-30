
$(function() {

  findAmount();

  function findAmount() {
    var search = window.location.search;
    var amountIndex = search.indexOf('amount=');
    var amount = amountIndex >= 0 ? Number(unescape(search.substring(amountIndex + 'amount='.length))) : 2;
    if (isNaN(amount)) {
      amount = 2;
    }
    grantRewardsWithAmount(amount);
  }

  function grantRewardsWithAmount(amount) {
    var $paymentContainer = $('#payment-container');
    var $rewardContainer = $('#reward-container');
    var $coupon = $('#coupon');
    var SmallRewardCoupon = 'Get What You Earned';
    var LargeRewardCoupon = 'The Money You Paid Will Have An Impact On Shane';

    var hasLargeCoupon = amount >= 4.99;
    $coupon.text(hasLargeCoupon ? LargeRewardCoupon : SmallRewardCoupon);

    $rewardContainer.fadeIn(200);

    $paymentContainer.fadeOut(800, function() {
      setTimeout(function() {
        var hasLargeCoupon = amount > 2;
        $coupon.text(hasLargeCoupon ? LargeRewardCoupon : SmallRewardCoupon);

        $rewardContainer.fadeIn(200);
      }, 200);
    });
  }
});
