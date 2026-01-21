import CreditCardWidget from "./cardWidget/cardWidget";
import AuthorWidget from "./authorWidget";

const container1 = document.querySelector(".container1");
const container2 = document.querySelector(".container2");

const authorWidget = new AuthorWidget(container1);
authorWidget.insertWidget();

const widget = new CreditCardWidget(container2);
widget.insertWidget();
