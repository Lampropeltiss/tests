import "../../css/widget.css";
import validateByControlSum from "./validator";
import definePaymentSystem from "./paySysDefiner";

import visaIco from "../../img/visa.png";
import mastercardIco from "../../img/mastercard.png";
import mirIco from "../../img/mir.png";
import unionpayIco from "../../img/unionpay.png";
import amexIco from "../../img/amex.png";

import crossIco from "../../img/cross.png";
import checkIco from "../../img/check.png";

export default class CreditCardWidget {
  constructor(parent) {
    this.parent = parent;
  }

  static get markup() {
    return `
        <div class="credit-card-widget">
            <div class="card-icons">
                <img class="card-ico card-off visa" src=${visaIco}>
                <img class="card-ico card-off mastercard" src=${mastercardIco}>
                <img class="card-ico card-off mir" src=${mirIco}>
                <img class="card-ico card-off unionpay" src=${unionpayIco}>
                <img class="card-ico card-off amex" src=${amexIco}>
            </div>
            <div class="widget-input-line">
                <input type="text" placeholder="Введите номер карты">
                <button id="validate">Проверить</button>
                <img class="valid-result cross-ico inv" src=${crossIco} alt="cross">
                <img class="valid-result check-ico inv" src=${checkIco} alt="check">
            </div>
        </div>`;
  }

  insertWidget() {
    this.parent.innerHTML = CreditCardWidget.markup;

    const validateBtn = this.parent.querySelector("#validate");
    validateBtn.addEventListener("click", () => {
      this.validateInput();
    });

    this.cross = this.parent.querySelector(".cross-ico");
    this.check = this.parent.querySelector(".check-ico");
  }

  validateInput() {
    const input = this.parent.querySelector("input");
    const cardNum = input.value;
    const isValid = validateByControlSum(cardNum);
    if (isValid) {
      this.check.classList.remove("inv");
      this.cross.classList.add("inv");
    } else {
      this.cross.classList.remove("inv");
      this.check.classList.add("inv");
    }

    const cardIcons = this.parent.querySelectorAll(".card-ico");
    cardIcons.forEach((cardIco) => {
      cardIco.classList.add("card-off");
    });

    const cardType = definePaymentSystem(cardNum);
    const card = this.parent.querySelector(`.${cardType}`);
    if (card) {
      card.classList.remove("card-off");
    }
  }
}
