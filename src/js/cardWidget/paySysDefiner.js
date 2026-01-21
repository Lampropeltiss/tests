export default function definePaymentSystem(cardNum) {
  const cleanNum = cardNum.replaceAll(" ", "").replaceAll("-", "");
  switch (Number(cleanNum[0])) {
    case 2:
      return "mir";
    case 3:
      return "amex";
    case 4:
      return "visa";
    case 5:
      return "mastercard";
    case 6:
      return "unionpay";
  }
}
