import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart, cart, calculateCartQuantity } from "../data/cart.js";
//import "../data/cart-class.js";
//import "../data/backend-practice.js";

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

  updateCartQuantity();
  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();

export function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  document.querySelector(
    ".js-cart-item-quantity"
  ).innerHTML = `${cartQuantity} items`;
}

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  }),
]).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
*/
/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  });
})
  .then(() => {
    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })
  .then(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });

  */

/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });
});

*/
