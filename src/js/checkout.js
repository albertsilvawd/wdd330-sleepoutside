import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", "#order-summary");
checkout.init();

document
  .querySelector("#checkout-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    checkout.checkout(this);
  });
