import definePaymentSystem from "../paySysDefiner";

test.each([
  ["23456", "mir"],
  ["344633235153601", "amex"],
  ["4916 3586 3159 8015", "visa"],
  ["5535-5014-9495-5594", "mastercard"],
  ["67890", "unionpay"],
  ["10009", undefined],
])("should test payment system definer", (cardNum, expected) => {
  expect(definePaymentSystem(cardNum)).toEqual(expected);
});
