export default function validateByControlSum(cardNum) {
    const cleanNum = cardNum.replaceAll(' ', '').replaceAll('-', '');
    let controlSum = 0;
    let parity = cleanNum.length % 2;

    for (let i = 0; i < cleanNum.length - 1; i++) {
        const digit = Number(cleanNum[i]);
        if (i % 2 == parity) {
            controlSum += digit;
        } else if (digit > 4) {
            controlSum += digit * 2 - 9;
        } else {
            controlSum += digit * 2
        }
    }
    return Number(cleanNum[cleanNum.length - 1]) == ((10 - (controlSum % 10)) % 10);
}