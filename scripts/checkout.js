import { renderOrderSummary } from "./checkout/orderSummary.js";
import {
  renderPaymentSummary,
  updatePlaceOrderButton,
} from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart,calculateCartQuantity } from "../data/cart.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";

// renders checkout header using MVC.
renderCheckoutHeader();

async function loadPage() {
  try {
    await Promise.all([
      loadProductsFetch(),
      new Promise((resolve) => {
        loadCart(() => {
          resolve();
        });
      }),
    ]);
  } catch (error) {
    console.log("Unexpected Error. Please try again later.");
  }

 
  renderOrderSummary();
  renderPaymentSummary();
  updatePlaceOrderButton();
}

loadPage();




