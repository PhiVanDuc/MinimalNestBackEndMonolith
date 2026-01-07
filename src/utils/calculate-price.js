const DISCOUNT_TYPES = require("../consts/discount-types.const");

module.exports = (costPrice, interestPercent, discountType, discount) => {
    const priceWithInterest = costPrice * (1 + interestPercent / 100);
    let finalPrice;

    if (!discount) finalPrice = priceWithInterest;
    else {
        if (discountType === DISCOUNT_TYPES.PERCENT) finalPrice = priceWithInterest - (priceWithInterest * discount) / 100;
        else finalPrice = priceWithInterest - discount;
    }

    return Math.ceil(finalPrice);
}