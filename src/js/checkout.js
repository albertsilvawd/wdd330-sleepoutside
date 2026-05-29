import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", "#order-summary");
checkout.init();

document
  .querySelector("#checkout-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const myForm = document.forms[0];
    const chk_status = myForm.checkValidity();
    myForm.reportValidity();
    if (chk_status) {
      checkout.checkout(this);
    }
  });
